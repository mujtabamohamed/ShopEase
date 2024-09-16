import React from 'react';

function DeleteConfirmModal({ setShowDeleteModal, confirmDelete, productName, productToDelete }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-[400px]"> {/* Set the width here */}
            <h2 className="text-lg text-[#3a3a3a] font-bold mb-4">Delete {productName}?</h2>
            <p className="text-[#3a3a3a] mb-6 text-balance">
                Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
                <button 
                    className="text-[#be3535] hover:text-red-600 font-semibold px-4 py-2 rounded-full"
                    onClick={() => confirmDelete(productToDelete)}>
                    Delete
                </button>
                <button 
                    className="bg-[#be3535] hover:bg-red-600 px-4 py-2 rounded-full"
                    onClick={() => setShowDeleteModal(false)}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
    
    );
}

export default DeleteConfirmModal;
