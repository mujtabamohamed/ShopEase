import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="p-4 bg-[#f3f3f3]">
            <div className="container mx-auto flex justify-between items-center">

            <h1 className="text-3xl font-extrabold text-[#53742c]">ShopEase</h1>

            <ul className="flex space-x-4 font-medium text-[#3a3a3a]">
                <li>
                    <Link to="/" className="hover:text-[#53742c]">Home</Link>
                </li>

                <li>
                    <Link to="/cart" className="hover:text-[#53742c]">Cart</Link>
                </li>
            </ul>

            </div>
        </nav>
    );
}

export default Navbar;