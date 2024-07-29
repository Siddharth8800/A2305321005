"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [top, setTop] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");
  const [products, setProducts] = useState([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      company,
      category,
      top,
      minPrice,
      maxPrice,
      sort_by: sortBy,
      order,
    }).toString();

    fetch(`http://localhost:8000/products?${query}`)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <div className="flex flex-col text-bold justify-center items-center p-10 w-full space-y-8">
        <h1 className="text-6xl text-green-600">Look for Products</h1>
        <form
          className="space-y-4 border-2 rounded-xl p-10"
          onSubmit={handleSubmit}
        >
          <div>
            <Label>Company:</Label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="">Select Company</option>
              <option value="AMZ">Amazon</option>
              <option value="APL">Apple</option>
              <option value="MSFT">Microsoft</option>
            </select>
          </div>
          <div>
            <Label>Category:</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Phone">Phone</option>
              <option value="Tablet">Tablet</option>
            </select>
          </div>
          <div>
            <Label>Top:</Label>
            <select value={top} onChange={(e) => setTop(e.target.value)}>
              <option value="">Select Top</option>
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
            </select>
          </div>
          <div>
            <Label>Min Price:</Label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <Label>Max Price:</Label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div>
            <Label>Sort By:</Label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Select Sort By</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
          <div>
            <Label>Order:</Label>
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
              <option value="">Select Order</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <Button type="submit">Search</Button>
        </form>
        <div className="border-2 rounded-xl flex flex-col space-y-10 justify-center items-center">
          <h2 className="text-4xl text-green-600 m-4">Products</h2>
          <div className="flex flex-row">
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <Card className="m-4" key={index}>
                  <CardHeader>
                    <CardTitle>{product.productName}</CardTitle>
                    <CardDescription>Price: ${product.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Rating:</strong> {product.rating}
                    </p>
                    <p>
                      <strong>Discount:</strong> {product.discount}%
                    </p>
                    <p>
                      <strong>Availability:</strong> {product.availability}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p>Additional details can go here.</p>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="p-4 text-red-600">
                No products found, Kindly Select options and submit form
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
