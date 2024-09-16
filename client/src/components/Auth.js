import { useState } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from "react-router-dom";
// import { FaGithub } from 'react-icons/fa';

// import Loader from "./Loader/Loader";

function Auth() {
  const[cookies,setCookie, removeCookie] = useCookies(null);

  const [isLogIn, setIsLogin] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [role, setRole] = useState(null);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // console.log(cookies);

  function viewLogin(status) {
    setError(null);
    setIsLogin(status);
  }

  async function handleSubmit(e, endpoint) {
    e.preventDefault();
    setIsLoading(true);

    if(!isLogIn && password !== confirmPassword) {
      setError('Make sure passwords match!');
      setIsLoading(false);
      return
    }
    
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/${endpoint}`, {
      method: 'POST',
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({ email, password, role })
    });

    const data = await response.json();
    // console.log(data);

    if(data.detail) {
      setError(data.detail);
      setIsLoading(false);

    } else {
      setCookie('Email', data.email);
      setCookie('AuthToken', data.token);
      setCookie('Role', data.role);
      setCookie('user_id', data.user_id);
      setRole(data.role);
      // console.log(data.role);

      if (data.role === "seller") {
        navigate(`/dashboard/${data.user_id}`);

      } else {
        navigate('/'); 
      }
      window.location.reload();
    }
  }

    return (
    <div className="bg-[#fff] h-screen flex flex-col items-center justify-center px-8">
      <div className="flex flex-col items-center justify-center mb-24">

        <div className="flex flex-row items-ceter justify-center xs:mb-8 lg:mb-12"> 
          
          <img 
            className="mr-3" 
            src="/ShopEase.png" 
            alt="ShopEase Logo" 
            width={50} />
            
          <h1 className="text-5xl font-work_sans font-bold text-[#6e993b]">ShopEase</h1> 

          {/* <img 
            src={`${process.env.PUBLIC_URL}/images/check.png`} 
            alt="Logo"
            className="xs:w-12 xs:h-12 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-30 xl:h-30 2xl:w-30 2xl:h-30"/> */}
        </div>

        <form className="flex flex-col items-center w-full xl:w-auto 2xl:w-auto">
          <div className="text-lg mb-4 font-medium text-[#3a3a3a] xs:text-2xl xs:mb-5 sm:mb-5 sm:text-2xl lg:text-2xl lg:mb-5 xl:mb-5 ">
            {isLogIn ? 'Please log in' : 'Please sign up'}</div>

          <input 
            type="email"
            placeholder="Enter your email address" 
            className = "rounded-lg text-sm mb-4 xs:w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px] p-4 bg-[#e9e9e9] placeholder-[#808080] focus:border-[#808080] focus:ring-0 outline-none text-[#3a3a3a] pl-4"
            onChange={(e) => setEmail(e.target.value)} />

          <input 
            type="password"
            placeholder="Password"
            className = "rounded-lg text-sm mb-4 xs:w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px] p-4 bg-[#e9e9e9] placeholder-[#808080] focus:border-[#808080] focus:ring-0 outline-none text-[#3a3a3a] pl-4"
            onChange={(e) => setPassword(e.target.value)} />
            

          {!isLogIn && <input 
            type="password"
            placeholder="Confirm Password" 
            className = "rounded-lg text-sm mb-4 xs:w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px] p-4 bg-[#e9e9e9] placeholder-[#808080] focus:border-[#808080] focus:ring-0 outline-none text-[#3a3a3a] pl-4"
            onChange={(e) => setConfirmPassword(e.target.value)} />}

            {/* Select input for buyer or seller */}
            {!isLogIn && (
                <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg text-sm mb-4 xs:w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px] p-4 bg-[#eeeeee] text-[#3a3a3a]">
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                </select>)}
          
          {error && <p className="text-red-600 text-lg font-semibold mb-3">{error}</p>}

          <input 
            type="submit" 
            value={isLogIn ? "Login" : 'Sign up'} 
            className="text-[#fff] font-medium text-center bg-[#6e993b] rounded-lg py-2 w-[250px] hover:bg-[#5e8332] xs:w-[280px] sm:w-[320px] md:w-[380px] lg:w-[400px] xl:w-[420px] 2xl:w-[420px]"
            onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signup')} /> 

          {/* {isLoading && <Loader className="mt-4" />} */}
            
          <div className="text-[#838383] font-normal text-sm mt-3 sm:text-sm sm:mt-3 lg:text-[16px] lg:mt-4 ">
            <p>
            {isLogIn ? "don't have an account?" : 'already have an account?'}&nbsp;
            <a 
              className="text-blue-500 cursor-pointer hover:underline" 
              onClick={() => (isLogIn ? viewLogin(false) : viewLogin(true))}>
            {isLogIn ? 'Sign up' : 'Sign in'}</a>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
  
export default Auth;
  