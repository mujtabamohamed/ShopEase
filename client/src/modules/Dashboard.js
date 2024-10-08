import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

import Modal from '../components/Modal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

import { Trash2 } from 'lucide-react';


function Dashboard() {
    const { user_id } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['user_id']);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    const [sellerProducts, setSellerProducts] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

// If there is no user_id, redirect to the login page
        if (!cookies.user_id) {
            navigate('/login');
        }
    }, [cookies, navigate]);


// Retrieve products for a specific seller
    async function fetchSellerProducts() {

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/dashboard/${user_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch seller products');
            }
            const data = await response.json();
            // console.log("Seller products data:", data.items);

            const productsWithQuantity = data.items.map(item => ({
                ...item,
                product_id: item.id
            }));
            setSellerProducts(productsWithQuantity);
            // console.log("Seller : ",sellerProducts)

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


// Delete seller product  
    async function confirmDeleteProduct(product_id) {
        // console.log("Removing product ID:", productId);
        if (!productToDelete) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/dashboard/delete/${user_id}/${product_id}`,{
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

        } finally {
            setShowDeleteModal(false);  
            setProductToDelete(null); 
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
 
    
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

                {showDeleteModal && (
                <DeleteConfirmModal
                    setShowDeleteModal={setShowDeleteModal}
                    confirmDelete={confirmDeleteProduct}
                    productName={sellerProducts.find(p => p.product_id === productToDelete)?.product_name}
                    productToDelete={productToDelete}
                />
            )}

            {/* Product Section */}
            <section className="py-20 text-center bg-[#fff]">
                <div className="flex flex-col container mx-auto text-center">
                
                    <div className="flex flex-col gap-4 justify-center mx-auto">
                        <h1 className="text-2xl text-[#3a3a3a] justify-center text-center font-bold mb-4">YOUR PRODUCTS</h1>
                        
                        <button 
                            className="mb-20 w-64 mx-auto block bg-[#6e993b] hover:bg-[#5e8332] text-white px-4 py-2 rounded-full text-lg"
                            onClick={() => {
                                setModalMode('create')
                                setShowModal(true)}}>Add new products</button>


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


                            {/* Edit */}
                            <div className="ml-36 flex-shrink-0 flex items-center">
                                <p className='mr-4 font-semibold text-md text-[#3a3a3a] hover:text-black cursor-pointer' 
                                    onClick={() => {
                                    setModalMode('edit');
                                    setSelectedProduct(item);
                                    setShowModal(true);}}>Edit</p>
                                    
                            {/* Delete */}
                                <Trash2 
                                    className=" stroke-[#3a3a3a] hover:stroke-[#000] cursor-pointer"
                                    onClick={() => {
                                        setProductToDelete(item.product_id);
                                        console.log(item.product_id)
                                        setShowDeleteModal(true);}}
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
