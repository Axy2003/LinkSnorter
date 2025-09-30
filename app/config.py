from functools import lru_cache
from pydantic_settings import BaseSettings

# Configuration class using Pydantic's BaseSettings 

# this will read from environment variables if set, otherwise use default values
class Settings(BaseSettings):
    env_name: str = "Local"
    base_url: str = "http://localhost:8000"
    db_url: str = "sqlite:///./shortener.db"

# this function will cache the settings instance to avoid reloading it multiple times
@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    print(f"Loading settings for: {settings.env_name}")
    return settings




# # Alternative approach using Pydantic's BaseSettings with .env support

# class Settings(BaseSettings):
#     env_name: str = "Local"
#     base_url: str = "http://localhost:8000"
#     db_url: str = "sqlite:///./shortener.db"

#     class Config:
#         env_file = ".env"
