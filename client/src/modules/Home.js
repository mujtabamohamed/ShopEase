import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ProductCard from "../components/ProductCard";

function Home() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/products');
        setProducts(response.data); // Assuming response.data is an array of products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-[#f3f3f3] text-gray-100 min-h-screen">


      {/* Hero Section */}
      <section className="py-20 text-center bg-[#f3f3f3]">
        <div className="container mx-auto">

          <h2 className="text-4xl font-bold mb-4 text-[#3a3a3a]">Welcome to ShopEase</h2>
          <p className="text-[#8a8a8a] mb-6">Explore our collection of the latest fashion trends</p>
          <a
            href="#shop"
            className="bg-[#53742c] hover:bg-[#466325] text-white px-6 py-3 rounded-full text-lg">
            Shop Now
          </a>

        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-[#f3f3f3]">
        <div className="container mx-auto text-center">

          <h3 className="text-3xl text-left font-bold ml-16 text-[#3a3a3a]">Featured Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-12 gap-2">

          {/* Render ProductCard for each product */}

          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                productName={product.name}
                price={`$${product.price}`}
                description={product.description}
                imageUrl={product.imageUrl || 'https://via.placeholder.com/200'}
              />
            ))

          ) : (
            <p>Loading products...</p>
          )}


          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">© 2024 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
