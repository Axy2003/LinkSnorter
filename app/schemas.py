from pydantic import BaseModel


# this will be used to validate data coming from the user
class URLBase(BaseModel):
    target_url: str
    
    
# this will be used to read data from the database and send it to the user
class URL(URLBase):
    is_active: bool
    clicks: int

    class Config:
        from_attributes = True        


# this will be used to send data to the user after creating a new shortened URL   
class URLInfo(URL):
    url: str
    admin_url: str