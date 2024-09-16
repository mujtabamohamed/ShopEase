import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

import { Trash2 } from 'lucide-react';

import Modal from '../components/Modal';
import SellerNavbar from '../components/SellerNavbar';

function Dashboard() {
    const { user_id } = useParams();
    const [sellerProducts, setSellerProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [modalMode, setModalMode] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [cookies, setCookie, removeCookie] = useCookies(['user_id']);

    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // If there's no user_id in the cookies, redirect to the login page
        if (!cookies.user_id) {
            navigate('/login');
        }
    }, [cookies, navigate]);


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

    useEffect(() => {
        if (!user_id) {
            setError('Invalid userId');
            setLoading(false);
            return;
        }
        fetchSellerProducts();
    }, [user_id]);
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    const deleteProduct = async (productId) => {
        console.log("Removing product ID:", productId);

        try {
            const response = await fetch(`http://localhost:8000/dashboard/delete/${user_id}/${productId}`,{
              method: "DELETE",
              headers: { 'Content-Type': 'application/json' },
          });
    
          if (response.ok) {
            console.log("Product deleted successfully");
            setMessage('Product was deleted successfully');
            fetchSellerProducts();
          } else {
                console.log('Failed to delete product');
                setMessage('Failed to delete product');
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
                    sellerProduct={selectedProduct} 
                    fetchProducts={fetchSellerProducts} 
                    />
                )}

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

                    {message && <div className="text-center font-semibold text-[#426e1d] mb-10">{message}</div>}

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
