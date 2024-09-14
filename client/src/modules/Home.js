import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import ProductCard from "../components/ProductCard";

function Home() {

  const [products, setProducts] = useState([]);
  const [cookies] = useCookies(['user_id']);
  const [message, setMessage] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(''); // Add state for selected category
  const [categories, setCategories] = useState([]); // Store categories

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

    // Function to handle adding products to the cart
    const handleAddToCart = async (productId) => {
      if (!cookies.user_id) {
        setMessage("You need to log in to add items to the cart");
        return;
      }
  
      try {
        const response = await axios.post(`http://localhost:8000/cart/add`, {
          user_id: cookies.user_id,
          product_id: productId,
          quantity: 1  // Default quantity is 1
        });
  
        if (response.status === 200) {
          setMessage('Product added to cart!');
        } else {
          setMessage('Error adding product to cart.');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        setMessage('Failed to add product to cart.');
      }
    };

    // Filter products by selected category
    const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="bg-[#fff] text-gray-100 min-h-screen">


      {/* Hero Section */}
      <section className="py-20 text-center bg-[#fff]">
        <div className="container mx-auto">

          <h2 className="text-4xl font-bold mt-20 mb-4 text-[#3a3a3a]">Welcome to ShopEase</h2>
          <p className="text-[#8a8a8a] mb-6">Explore our collection of the latest fashion trends</p>
          <a
            href="#shop"
            className="bg-[#53742c] hover:bg-[#466325] text-white px-4 py-3 rounded-full text-lg">
            Shop Now
          </a>

        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-[#fff]">
        <div className="container mx-auto text-center">

          <h3 className="text-3xl font-bold text-[#3a3a3a]">Featured Products</h3>

            {/* Dropdown Menu for Category Filter */}
          <div className="my-6 text-[#3a3a3a]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}  // Update selected category
              className="p-2 border rounded w-1/4 focus:outline-none bg-[#f1f1f1]">

              <option value="">All</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Electronics">Electronics</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Render ProductCard for each filtered product */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-12 gap-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  productId={product.id}  
                  productName={product.product_name}
                  price={`₹${product.price}`}
                  description={product.description}
                  imageUrl={product.imageurl || 'https://via.placeholder.com/200'}
                  handleAddToCart={handleAddToCart}  // Pass the function to ProductCard
                />
              ))
            ) : (
              <p>No products found in this category...</p>
            )}
          </div>
          
          {/* Success/Error Message */}
          {message && <div className="text-center text-[#426e1d]">{message}
          </div>}
        </div>
      </section>
    </div>
  );
}

export default Home;
