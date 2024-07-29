from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Product(BaseModel):
    productName: str
    price: float
    rating: float
    discount: int
    availability: str

def get_sort_key(product, sort_by):
    return product.get(sort_by, 0)


@app.get('/')
def root():
    return {'message': 'API running successfully'}

@app.get("/products", response_model=List[Product])
def get_products(company: str, 
                 category: str, 
                 top: int, 
                 minPrice: int, 
                 maxPrice: int, 
                 sort_by: Optional[str] = Query(None, enum=["rating", "price", "company", "discount"]),
                 order: Optional[str] = Query("asc", enum=["asc", "desc"])):
    url = f"http://20.244.56.144/test/companies/{company}/categories/{category}/products"
    params = {
        "top": top,
        "minPrice": minPrice,
        "maxPrice": maxPrice
    }
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIyMjUwMjAwLCJpYXQiOjE3MjIyNDk5MDAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjFkNzY2ZjAzLTY0MGMtNDJkNS04NmVjLWFiNjQwMzAyMmE5OSIsInN1YiI6InNpZGRoYXJ0aDRAcy5hbWl0eS5lZHUifSwiY29tcGFueU5hbWUiOiJBbWl0eVVuaXZlcnNpdHlOb2lkYSIsImNsaWVudElEIjoiMWQ3NjZmMDMtNjQwYy00MmQ1LTg2ZWMtYWI2NDAzMDIyYTk5IiwiY2xpZW50U2VjcmV0IjoidW1seE9ZZ2p6VEdHY2dIRCIsIm93bmVyTmFtZSI6IlNpZGRoYXJ0aCIsIm93bmVyRW1haWwiOiJzaWRkaGFydGg0QHMuYW1pdHkuZWR1Iiwicm9sbE5vIjoiQTIzMDUzMjEwMDUifQ.-GZNyZcHGssmT7kOhAA-uvhAYbb0veMd08PX-gPqook"
    }

    with httpx.Client() as client:
        response = client.get(url, params=params, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Error fetching data from external API")
        products = response.json()

    if sort_by:
            reverse = order.lower() == "desc"
            products.sort(key=lambda x: get_sort_key(x, sort_by), reverse=reverse)

    return products





