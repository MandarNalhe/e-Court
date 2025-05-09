import { useState } from 'react';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
const register = ()=>{
  const navigate = useNavigate();
    const [value, setValue] = useState(true);
    const handleToggle = () => setValue(!value);

    const [otp, setOTP] = useState(false);
    const handleOTP = async () => {
      try {
        const response = await fetch("http://backend-production-969c.up.railway.app:5000/api/otp/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        });
  
        const data = await response.json();
        if (data.success) {
          alert("OTP sent to your email.");
          setOTP(!otp);
        } else {
          alert("Failed to send OTP.");
        }
      } catch (error) {
        console.error("OTP request error:", error);
      }
    };
    
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role : ""
      });
    
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        otp : ""
      });

      const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            alert("Login successful!");
    
            setTimeout(() => {
              navigate("/dashboard");
            }, 100);
          } else {
            alert("Login failed. Please check your credentials and OTP.");
          }
        } catch (error) {
          console.error("Login error:", error);
          alert("Something went wrong. Please try again.");
        }
      }

      const handleLoginChange = (e) => {
        setLoginData({
          ...loginData,
          [e.target.name]: e.target.value, 
        });
      }
    
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value, 
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault(); 
    
        try {
          const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData), 
          });
    
          const data = await response.json();
          if (response.ok) {
            alert("Registration Successful!");
          } else {
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("Something went wrong!");
        }
      };
    
    
    return(
    <div className="h-screen w-full bg-[#111111] flex p-2">
        <div className="h-screen w-[55%] flex flex-col">
            <div className="flex p-5 place-content-between item-end">
                <div className="">
                    <h1 className="font-mono text-white font-bold text-2xl">e-Judicate</h1>
                </div>
                <div className="flex gap-10 item-end pt-3 pr-6">
                    <h1 className="font-mono text-white font-semibold">Contact</h1>    
                    <h1 className="font-mono text-white font-semibold underline">{value ?'Login':'Sign Up'}</h1>
                </div>
            </div>
            <div className='p-2 flex item-center justify-center'>
                <img className='fit-cover' src={logo} alt="" />
            </div>
            <div className='p-6'>
                <h1 className='font-mono text-6xl text-white font-bold ml-5'>{value?'Welcome!':'Welcome Back!'}</h1>
            </div>
        </div>
        <div className="h-full w-[45%] bg-white rounded-[15%] shadow-lg flex flex-col ">
            <div className='mt-25  ml-25'>
                <h1 className='font-bold text-4xl'>Sign Up</h1>
            </div>
            <div className='mt-10'>
                {value ? (<form onSubmit={handleSubmit} className='pl-25'>
                    <h3 className='ml-2 font-mono'>Full Name</h3>
                    <input type='text' name='name' placeholder='Saul Altman' value={formData.name} onChange={handleChange} className='w-[80%] bg-[#e7e7e7] w- p-2 rounded-xl'/>
                    <h3 className=' ml-2 font-mono'>Email</h3>
                    <input type='email'name='email' placeholder='hello@greet.com' value={formData.email} onChange={handleChange} className='w-[80%] bg-[#e7e7e7] w- p-2 rounded-xl'/>
                    <h3 className='mt-5 ml-2 font-mono'>Password</h3>
                    <input type='password' name='password' placeholder='*******' value={formData.password} onChange={handleChange} className='w-[80%] bg-[#e7e7e7] w- p-2 rounded-xl'/>
                    <h3 className='mt-5 ml-2 font-mono'>Role</h3>
                    <input type='text' placeholder='Role' name='role' value={formData.role} onChange={handleChange} className='w-[80%] bg-[#e7e7e7] w- p-2 rounded-xl'/>
                    <button type='submit' className='w-[80%] p-2 mt-5 bg-black text-white rounded-full'>Create Account</button>
                </form>) : 
                (<form onSubmit={handleLoginSubmit} className='pl-25'>
                    <h3 className=' ml-2 font-mono'>Email</h3>
                    <input type='email' name='email' placeholder='hello@greet.com' value={loginData.email} onChange={handleLoginChange} className='w-[80%] bg-[#e7e7e7] w- p-2 rounded-xl'/>
                    <h3 className='mt-5 ml-2 font-mono'>Password</h3>
                    <input type='password' name='password' placeholder='*******' value={loginData.password} onChange={handleLoginChange} className='w-[80%] bg-[#e7e7e7] w- p-2 rounded-xl'/>
                    
                    <h3 className='mt-5 ml-2 font-mono'>One Time Password (OTP)</h3>
                    {otp && <input type='text' name='otp' placeholder='0000' value={loginData.otp} onChange={handleLoginChange} className='w-[80%] bg-[#e7e7e7] w- p-2 rounded-xl'/> }{ !otp && (<button type='button' onClick={handleOTP} className='w-[60%] p-2 mt-5 bg-[#e3e3e3] rounded-full bg-black text-white'>Send Otp </button>)}
                    {otp && <button type='submit' className='w-[80%] p-2 mt-5 bg-black text-white rounded-full'>Login</button>}
                </form>)}
            </div>
            <div>
            <div className='text-center mt-5'>
                <h3>{value ?'Already have an account?':'Don\'t have an account ?'} </h3>
                <button onClick={handleToggle} className='w-[60%] p-2 mt-5 bg-[#e3e3e3] rounded-full'>{value?'Login':'Sign Up'}</button>
            </div>
            </div>

        </div> 
    </div>
)}

export default register;
