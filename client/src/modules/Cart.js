import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';

function Cart() {
    const { user_id } = useParams();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("User ID from URL:", user_id);
        if (!user_id) {
            setError('Invalid userId');
            setLoading(false);
            return;
        }

        const fetchCartItems = async () => {
            try {
                const response = await fetch(`http://localhost:8000/cart/${user_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                console.log("Cart items data:", data.items);

                const itemsWithQuantity = data.items.map(item => ({
                    ...item,
                    quantity: item.quantity || 1,
                }));
                setCartItems(itemsWithQuantity);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [user_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    // Function to handle removing item from cart
    const handleRemoveItem = async (productId) => {
        console.log("Removing product ID:", productId);

        try {
            const response = await fetch(`http://localhost:8000/cart/${user_id}/${productId}`,{
              method: "DELETE"
          });
            
            if(response.status === 200) {
                const updatedCart = cartItems.filter(item => item.product_id !== productId);
                setCartItems(updatedCart);

            } else {
                console.error('Error removing item from cart');
            }
      
          } catch (err) {
            console.error('Error removing item from cart:', error);
          }
        }
        
    // Calculate the total price
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="bg-[#fff] text-gray-100 min-h-screen ">
        
            {/* Cart Section */}
            <section className="py-20 text-center bg-[#fff]">
                <div className="flex flex-col container mx-auto text-center">
                
                    <div className="flex flex-col gap-4 justify-center mx-auto">
                        <h1 className="text-2xl text-[#3a3a3a] justify-center text-center font-bold mb-24">SHOPPING BAG</h1>

                        {cartItems.map((item) => (
                        <div key={item.product_id} className="flex items-start pb-6 border-b justify-between">
                            <div className="flex">
                                <img
                                    src={item.imageurl || 'https://via.placeholder.com/200'}
                                    alt={item.product_name}
                                    className="w-36 h-36 object-cover rounded-xl"
                                />
                                <div className="text-left w-full ml-16">
                                    <h1 className="text-2xl font-bold text-[#3a3a3a] whitespace-nowrap">{item.product_name}</h1>
                                    <p className="text-md text-[#707070] mt-1">Quantity: {item.quantity}</p>
                                    <p className="text-xl font-bold text-[#3a3a3a] mt-2">₹{item.price}</p>
                                </div>
                            </div>

                            {/* Delete Icon */}
                            <div className="ml-36 flex-shrink-0 flex items-center">
                                <X 
                                    className=" stroke-[#3a3a3a] hover:stroke-[#000] cursor-pointer"
                                    onClick={() => handleRemoveItem(item.product_id)}
                                    width={"24"}
                                    height={"24"}/>
                            </div>
                        </div>
                        ))}
                    </div>

                {/* Cart Summary */}
                    <div className="mt-8 p-4 justify-center">
                        <h3 className="text-xl font-semibold text-[#3a3a3a]">
                        Total Price: ₹{getTotalPrice()}
                        </h3>
                        <button className="mt-2 bg-[#53742c] hover:bg-[#466325] text-white px-4 py-2 rounded-full text-md">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default Cart;
