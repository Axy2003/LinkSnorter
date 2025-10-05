# shortener_app/main.py

import validators
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from starlette.datastructures import URL


from fastapi.middleware.cors import CORSMiddleware # Added for CORS

from . import crud, models, schemas
from .database import SessionLocal, engine
from .config import get_settings


app = FastAPI()
models.Base.metadata.create_all(bind=engine) # this creates the database tables

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# this function will be used to get a database session for each request by utilizing FastAPI's dependency injection system
def get_db():
    db = SessionLocal()  # initiated in database.py
    try:
        yield db
    finally:
        db.close()

# ...

# utility function to raise a 400 Bad Request error
def raise_bad_request(message):
    raise HTTPException(status_code=400, detail=message)

# ...


@app.post("/url", response_model=schemas.URLInfo)
def create_url(url: schemas.URLBase, db: Session = Depends(get_db)):
    if not validators.url(url.target_url):
        raise_bad_request(message="Your provided URL is not valid")

    db_url = crud.create_db_url(db=db, url=url)
    return get_admin_info(db_url)


def raise_not_found(request):
    message = f"URL '{request.url}' not found"
    raise HTTPException(status_code=404, detail=message)


@app.get("/{url_key}")
def forward_to_target_url(url_key: str, request: Request, db: Session = Depends(get_db)):
        if db_url := crud.get_db_url_by_key(db=db, url_key=url_key):
            crud.update_db_clicks(db=db, db_url=db_url)
            return RedirectResponse(db_url.target_url)
        else:
            raise_not_found(request)


def get_admin_info(db_url: models.URL) -> schemas.URLInfo:
    base_url = URL(get_settings().base_url)
    admin_endpoint = app.url_path_for(
        "administration info", secret_key = db_url.secret_key
    )
    
    db_url.url = str(base_url.replace(path=db_url.key))
    db_url.admin_url = str(base_url.replace(path=admin_endpoint))
    return db_url


@app.get(
    "/admin/{secret_key}",
    name="administration info",
    response_model=schemas.URLInfo,
)
def get_url_info(
    secret_key: str, request: Request, db: Session = Depends(get_db)
):
    if db_url := crud.get_db_url_by_secret_key(db, secret_key = secret_key):
        return get_admin_info(db_url)
    else:
        raise_not_found(request)
        
        
@app.delete("/admin/{secret_key}")
def delete_url(
    secret_key: str, request: Request, db: Session = Depends(get_db)
):
    if db_url := crud.deactivate_db_url_by_secret_key(db, secret_key=secret_key):
        message = f"Successfully deleted shortened URL for '{db_url.target_url}'"
        return {"detail": message}
    else:
        raise_not_found(request)