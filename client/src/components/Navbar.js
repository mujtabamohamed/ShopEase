import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { House } from 'lucide-react';
import { UserRound } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';

function Navbar() {
    const [cookies, setCookie, removeCookie] = useCookies(['user_id']);
    const [userId, setUserId] = useState(null);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false); 

    useEffect(() => {
        
        if (cookies.user_id) {
            setUserId(cookies.user_id);
        }
    }, [cookies.user_id]);

    // Toggle the account dropdown visibility
    const toggleAccountDropdown = () => {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };

    function signOut() {
        console.log("Sign Out");
        removeCookie('user_id',);
        removeCookie('AuthToken');
        removeCookie('Role');
        removeCookie('Email');
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
                            <House 
                                size={22}
                                className="stroke-[#3a3a3a] hover:stroke-[#000] lucide lucide-house mr-1" />Home
                        </Link>
                    </li>

                    <li className="relative">
                        {/* Account button */}
                        <button onClick={toggleAccountDropdown} className="flex flex-row hover:text-[#000] cursor-pointer focus:outline-none">
                            <UserRound
                                size={22}
                                className="stroke-[#3a3a3a] hover:stroke-[#000] lucide lucide-user mr-1" />Account
                        </button>

                        {/* Dropdown menu for account */}
                        {isAccountDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                                <button 
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                    onClick={signOut}>Logout
                                </button>
                            </div>)}
                    </li>
                    
                    <li>
                        {/* Cart button that dynamically uses userId */}
                        {userId ? (
                            <Link to={`/cart/${userId}`} className="flex flex-row hover:text-[#000] cursor-pointer">
                                <ShoppingBag
                                    size={22}
                                    className="stroke-[#3a3a3a] hover:stroke-[#000] lucide lucide-shopping-bag mr-1" />Bag
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
