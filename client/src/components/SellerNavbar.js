import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from 'react-router-dom';
import { UserRound } from 'lucide-react';


function SellerNavbar() {

    const [cookies, setCookie, removeCookie] = useCookies(['user_id']);
    const [userId, setUserId] = useState(null);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false); 
    
    useEffect(() => {
        
        if (cookies.user_id) {
            setUserId(cookies.user_id);
        }
    }, [cookies.user_id]);
    

// Toggle the account dropdown visibility
    function toggleAccountDropdown() {
        setIsAccountDropdownOpen(!isAccountDropdownOpen);
    };
    
    function signOut() {
        console.log("Sign Out");
        removeCookie('Email', { path: '/' });
        removeCookie('user_id', { path: '/' });
        removeCookie('AuthToken', { path: '/' });
        removeCookie('Role', { path: '/' });

        setTimeout(() => {
            window.location.reload();
            window.location.href = '/';
        }, 100);
    }


  return (
    <nav className="p-4 bg-[#fff] relative">
        <div className="container mx-auto flex justify-between items-center">
        
            <div className="ml-16 flex">
                <img 
                    className="mr-2" 
                    src="/ShopEase.png" 
                    alt="ShopEase Logo" 
                    width={35} />
            </div>
            <h1 className="text-[28px] font-work_sans font-bold text-[#6e993b]">ShopEase</h1>

            <ul className="flex space-x-4 font-inter font-medium text-[#3a3a3a] ml-auto mr-16">

                <li className="relative">

                    {/* Account button */}
                    <button 
                        className="flex flex-row hover:text-[#000] cursor-pointer focus:outline-none"
                        onClick={toggleAccountDropdown}>

                        <UserRound
                            className="stroke-[#3a3a3a] hover:stroke-[#000] lucide lucide-user mr-1"
                            width={22}
                            height={22}/>Account
                    </button>

                    {/* Dropdown menu for account */}
                    {isAccountDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                            
                            <button 
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                onClick={signOut}>Logout
                            </button>
                        </div>
                    )}
                </li>
            </ul>
        </div>
    </nav>
  );
}

export default SellerNavbar;