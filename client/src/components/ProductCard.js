import React from 'react';

function ProductCard({ productId, productName, price, description, imageUrl, handleAddToCart }) {
  return (
    <div className="w-116 bg-[#00000] p-4 rounded-lg text-left">
    
      <img
        src={imageUrl}
        id={productId}
        alt={productName}
        className="w-full h-54 object-cover rounded-xl" />

      <div className="flex justify-between items-center mt-2">
      
        <h4 className="text-xl font-semibold text-left text-[#3a3a3a]">
          {productName}
        </h4>
        
        <p className="text-[21px] text-[#3a3a3a] font-bold text-right">
          {price}
        </p>
      </div>
      
      <p className="text-sm text-[#707070] text-left">{description}</p>

      <button 
        className="mt-3 text-[15px] font-medium bg-[#6e993b] hover:bg-[#5e8332] text-white px-4 py-2 rounded-full self-start"
        onClick={() => handleAddToCart(productId)}>        
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
