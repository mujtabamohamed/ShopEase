import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { Trash2 } from 'lucide-react';

import Modal from '../components/Modal';


function Dashboard() {
    const { user_id } = useParams();
    const [sellerProducts, setSellerProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modalMode, setModalMode] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [cookies, setCookie, removeCookie] = useCookies(['user_id']);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false); 

    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // If there's no user_id in the cookies, redirect to the login page
        if (!cookies.user_id) {
            navigate('/login');
        }
    }, [cookies, navigate]);



    useEffect(() => {
        console.log("User ID from URL:", user_id);
        if (!user_id) {
            setError('Invalid userId');
            setLoading(false);
            return;
        }

        const fetchSellerProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/dashboard/${user_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch seller products');
                }
                const data = await response.json();
                console.log("Seller products data:", data.items);


                const productsWithQuantity = data.items.map(item => ({
                    ...item,
                    product_id: item.id
                }));
                setSellerProducts(productsWithQuantity);
                console.log("Seller : ",sellerProducts)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerProducts();
    }, [user_id]);

    const toggleAccountDropdown = () => {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };
    
    const signOut = () => {
        console.log("Signing out...");
    
        console.log("Before removing cookies:", cookies);
    
        removeCookie('user_id', { path: '/' });
        removeCookie('AuthToken', { path: '/' });
        removeCookie('Role', { path: '/' });
        removeCookie('Email', { path: '/' });
    
        console.log("After removing cookies:", cookies);
    
        window.location.href = "/";    
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    const deleteProduct = async (productId) => {
        console.log("Removing product ID:", productId);

        try {
            const response = await fetch(`http://localhost:8000/dashboard/${user_id}/delete/${productId}`,{
              method: "DELETE",
              headers: { 'Content-Type': 'application/json' },
          });
    
          if (response.ok) {
            console.log("Product added successfully");
            // getData();
          } else {
                console.log('Failed to add product');
          }
          
        } catch (err) {
            console.error(err);
        }
    }
        
    return (
        <div className="bg-[#fff] text-gray-100 min-h-screen ">

            {showModal && (
                <Modal 
                    mode={modalMode} 
                    setShowModal={setShowModal} 
                    sellerProduct={selectedProduct} />
                )}

            <nav className="p-4 bg-[#fff] relative">
                <div className="container mx-auto flex justify-between items-center">
                
                    <div className="ml-16">
                        <h1 className="text-[24px] font-work_sans font-bold text-[#53742c]">SHOPEASE</h1>
                    </div>

                    <ul className="flex space-x-4 font-inter font-medium text-[#3a3a3a] ml-auto mr-16">
    
                        <li className="relative">
                            {/* Account button */}
                            <button onClick={toggleAccountDropdown} className="flex flex-row hover:text-[#000] cursor-pointer focus:outline-none">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="22" 
                                    height="22" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="#3a3a3a" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    className="hover:stroke-[#000] lucide lucide-user mr-1">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>Account
                            </button>

                            {/* Dropdown menu for account */}
                            {isAccountDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                    
                                    <button 
                                        onClick={signOut} 
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>

            {/* {showModal && <Modal mode={modalMode} setShowModal={setShowModal} sellerProducts={sellerProducts}/>} */}

            {/* Product Section */}
            <section className="py-20 text-center bg-[#fff]">
                <div className="flex flex-col container mx-auto text-center">
                
                <div className="flex flex-col gap-4 justify-center mx-auto">
                    <h1 className="text-2xl text-[#3a3a3a] justify-center text-center font-bold mb-4">YOUR PRODUCTS</h1>
                    
                    <button className="mb-20 w-64 mx-auto block bg-[#53742c] hover:bg-[#466325] text-white px-4 py-2 rounded-full text-lg"
                            onClick={() => {
                                setModalMode('create')
                                setShowModal(true)}}>
                            Add new products
                    </button>

                    {sellerProducts.map((item) => (
                    <div key={item.product_id} className="flex items-start pb-6 border-b justify-between">
                        <div className="flex">
                            <img
                                src={item.imageurl || 'https://via.placeholder.com/200'}
                                alt={item.product_name}
                                className="w-24 h-24 object-cover rounded-xl" />

                            <div className="text-left w-full ml-16">
                                <h1 className="text-xl font-bold text-[#3a3a3a] whitespace-nowrap">{item.product_name}</h1>
                                <p className="text-sm text-[#707070] mt-0">{item.description}</p>
                                <p className="text-sm text-[#707070] mt-0">{item.category}</p>
                                <p className="text-lg font-bold text-[#3a3a3a] mt-1">₹{item.price}</p>
                            </div>
                        </div>

                        {/* Delete Icon */}
                        <div className="ml-36 flex-shrink-0 flex items-center">
                            <p className='mr-4 font-semibold text-md text-[#3a3a3a] hover:text-black cursor-pointer' 
                                onClick={() => {
                                setModalMode('edit');
                                setSelectedProduct(item);
                                setShowModal(true);}}>Edit</p>

                            <Trash2 
                                className=" stroke-[#3a3a3a] hover:stroke-[#000] cursor-pointer"
                                onClick={() => {
                                    console.log("Product ID to delete:", item.product_id);
                                    deleteProduct(item.product_id)
                                }}
                                width={"20"}
                                height={"20"}/> 
                        </div>
                    </div>
                    ))}
                </div>

                
                </div>
            </section>
            </div>

    );
}

export default Dashboard;
