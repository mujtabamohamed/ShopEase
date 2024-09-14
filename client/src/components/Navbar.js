import { Link,  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function Navbar() {
    const [cookies, setCookie, removeCookie] = useCookies(['buyer_id']);
    const [buyerId, setBuyerId] = useState(null);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false); // Dropdown toggle state
    const navigate = useNavigate(); // For redirection after logout


    useEffect(() => {
        
        if (cookies.buyer_id) {
            setBuyerId(cookies.buyer_id); // Set buyerId from cookies
        }
    }, [cookies.buyer_id]);

    // Toggle the account dropdown visibility
    const toggleAccountDropdown = () => {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };

    // Handle user logout and redirect to login page
    const handleLogout = () => {
        removeCookie('buyer_id', { path: '/' });  // Ensure cookie is removed
        setBuyerId(null);          // Clear buyerId state immediately
        navigate('/login', { replace: true });  // Force redirect to login page
    };
    function signOut() {
        console.log("Sign Out");
        removeCookie('buyer_id',);
        removeCookie('AuthToken');
        window.location.reload();
      }
    
    return (
        <nav className="p-4 bg-[#fff] relative">
            <div className="container mx-auto flex justify-between items-center">
            
                <div className="ml-16">
                    <h1 className="text-[24px] font-work_sans font-bold text-[#53742c]">SHOPEASE</h1>
                </div>

                <ul className="flex space-x-4 font-inter font-medium text-[#3a3a3a] ml-auto mr-16">
                    <li>
                        <Link to="/" className="flex flex-row hover:text-[#000] cursor-pointer">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="22" 
                                height="22" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="hover:stroke-[#000] lucide lucide-house mr-1">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            </svg>Home
                        </Link>
                    </li>

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
                    
                    <li>
                        {/* Cart button that dynamically uses buyerId */}
                        {buyerId ? (
                            <Link to={`/cart/${buyerId}`} className="flex flex-row hover:text-[#000] cursor-pointer">
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
                                className="lucide lucide-shopping-bag mr-1">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                                <path d="M3 6h18"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>Bag
                            </Link>
                        ) : (
                            <span>Login to view cart</span>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
