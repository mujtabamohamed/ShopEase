import { useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

function Modal({ mode, setShowModal, sellerProduct, fetchProducts }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const { user_id } = useParams();

  const editMode = mode === 'edit' ? true : false;
  console.log(sellerProduct)

  const [data, setData] = useState({
    user_id: cookies.user_id, 
    product_id: sellerProduct?.product_id ?? "",   
    product_name: editMode? sellerProduct.product_name : "",
    description: editMode? sellerProduct.description : "",
    category: editMode? sellerProduct.category : "",
    price: editMode? sellerProduct.price : "",
    imageurl: editMode? sellerProduct.imageurl : "",
  });

  async function postData(e) {
    e.preventDefault();

    const addProductData = {
        user_id: user_id,
        product_id: data.product_id,  
        product_name: data.product_name,
        description: data.description,
        category: data.category,
        price: data.price,
        imageurl: data.imageurl
      };

    try {
      const response = await fetch(`http://localhost:8000/dashboard/add/${user_id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(addProductData),
      });

      if (response.ok) {
        console.log("Product added successfully");
        setShowModal(false);
        fetchProducts(); 
      } else {
            console.log('Failed to add product');
      }
      
    } catch (err) {
        console.error(err);
    }
  }

  async function editData(e) {
    e.preventDefault();
  
    const productData = {
      user_id: user_id,
      product_id: data.product_id,  // Use data.product_id here
      product_name: data.product_name,
      description: data.description,
      category: data.category,
      price: data.price,
      imageurl: data.imageurl
    };
  
    try {
      const response = await fetch(`http://localhost:8000/dashboard/edit/${user_id}/${data.product_id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(productData),
      });
  
      if (response.ok) {
        console.log("Product edited successfully");
        setShowModal(false);
        fetchProducts(); 
      } else {
        console.log('Failed to edit product');
      }
      
    } catch (err) {
      console.error(err);
    }
  }
  

    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
        <div className="bg-[#ffffff] border border-[#eeeeee] px-10 py-6 rounded-xl shadow-lg xs:w-[320px] xs:py-4 sm:w-[480px] md:w-[540px]">
          <button 
              className="relative left-128 bottom-6 focus:outline-none 
              rounded-sm rounded-tr-xl text-[#3a3a3a] active:text-red-600 py-2 px-4
              xs:left-60 xs:bottom-4 sm:left-96 sm:bottom-0 md:left-112 md:bottom-2" 
              onClick={() => setShowModal(false)}>X
          </button>
          <div className="flex justify-between items-center">
            <h3 className="text-[#3a3a3a] text-xl font-semibold mb-2">Let's {mode} your product</h3>
            
          </div>
          <form className="flex flex-col">

            <label
              className="text-[#3a3a3a] text-sm font-medium mt-2">Product Name</label>
              
            <input
              required
              autoFocus
              className="bg-[#f3f3f3] text-[#3a3a3a] text-sm rounded-lg mt-1 p-2.5 outline-none"
              maxLength="30"
              placeholder="Enter product name"
              name="title"
              value={data.product_name}
              onChange={(e) => setData({ ...data, product_name: e.target.value })} />

            <label
              className="text-[#3a3a3a] text-sm font-medium mt-4">Description</label>

            <input
              required
              className="bg-[#f3f3f3] text-[#3a3a3a] text-sm rounded-lg mt-1 p-2.5 outline-none"
              maxLength="30"
              placeholder="Enter product description"
              name="description"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })} />


            <label
              className="text-[#3a3a3a] text-sm font-medium mt-4">Category</label>
            
            <select
              required
              className="bg-[#f3f3f3] text-[#3a3a3a] text-sm rounded-lg mt-1 p-2.5 focus:outline-none"
              name="category"
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}>
              <option value="">Select</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Electronics</option>
            </select>

            <label
              className="text-[#3a3a3a] text-sm font-medium mt-4">Price</label>
            
            <input
              required
              className="bg-[#f3f3f3] text-[#3a3a3a] text-sm rounded-lg mt-1 p-2.5 outline-none"
              maxLength="30"
              placeholder="Enter product price"
              name="price"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })} />

            <label
              className="text-[#3a3a3a] text-sm font-medium mt-4">Image URL</label>
            
            <textarea
              required
              className="bg-[#f3f3f3] text-[#3a3a3a] text-sm rounded-lg mt-1 p-2.5 outline-none"
              maxLength="500"
              placeholder="Enter product image URL"
              name="imageurl"
              value={data.imageurl}
              onChange={(e) => setData({ ...data, imageurl: e.target.value })} />
            
            <input 
              className="bg-[#53742c] hover:bg-[#466325] text-white text-md font-semibold rounded-full w-full mt-10 mb-4 py-2 
              cursor-pointer transition duration-300 hover:opacity-85 border-none" 
              value={mode} type="submit" onClick={editMode ? editData : postData} />
          </form>
        </div>
      </div>

    );
  }
  
  export default Modal;
  