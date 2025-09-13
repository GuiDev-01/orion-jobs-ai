from fastapi import APIRouter
from typing import Union
from pydantic import BaseModel

router = APIRouter()

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@router.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@router.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_price": item.price, "item_id": item_id}