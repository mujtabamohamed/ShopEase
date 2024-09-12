import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CartPage() {

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
      // Fetch products from the backend
      const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/cart`);
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
      };
  
      fetchCart();
    }, []);


  // Function to handle quantity change
  const handleQuantityChange = (id, delta) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    setCartItems(updatedCart);
  };

  // Calculate the total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="bg-[#f3f3f3] text-gray-100 min-h-screen">

      {/* Cart Section */}
      <section className="py-20 text-center bg-[#f3f3f3]">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-[#3a3a3a]">Your Cart</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-12 gap-4">

            {cartItems.map((item) => (
              <div key={item.id} className="w-72 bg-white p-4 rounded-lg shadow-md text-left">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-54 object-cover rounded-xl"
                />
                <div className="flex justify-between items-center mt-2">
                  <h4 className="text-xl font-semibold text-[#3a3a3a]">{item.productName}</h4>
                  <p className="text-[21px] text-[#3a3a3a] font-bold">${item.price}</p>
                </div>
                <p className="text-sm text-[#707070]">Quantity: {item.quantity}</p>

                {/* Quantity Control */}
                <div className="flex items-center space-x-2 mt-4">
                  <button
                    className="bg-[#53742c] text-white px-3 py-1 rounded-full"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold text-[#3a3a3a]">{item.quantity}</span>
                  <button
                    className="bg-[#53742c] text-white px-3 py-1 rounded-full"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-[#3a3a3a]">Total Price: ${getTotalPrice()}</h3>
            <button className="mt-4 bg-[#53742c] hover:bg-[#466325] text-white px-6 py-3 rounded-full text-lg">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
