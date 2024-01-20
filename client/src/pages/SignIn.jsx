import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
const SignIn = () => {
  const navigate = useNavigate();
  const [formData,setFormData]=useState({})
  const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState(null)
  const handleChange=(e)=>{
    setFormData({
    ...formData,
    [e.target.id]:e.target.value
    })
  }
  const handleSubmit = async (e)=>{
   e.preventDefault()
   setIsLoading(true)
   const res = await fetch('/api/auth/signin',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body : JSON.stringify(formData)
   })
   const data = await res.json()
   if(data.success===false){
    setIsLoading(false)
    setError(data.message)
    return
   }
   setIsLoading(false)
   setError(null)
   navigate('/home')
   console.log(data)
  }
  
  console.log(formData)
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl font-bold text-center my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="p-3 border rounded-lg"
          onChange={handleChange}

        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="p-3 border rounded-lg"
          onChange={handleChange}

        />
        <button disabled={isLoading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {isLoading ? "Loading" : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do not have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 ">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-800 mt-5 px-1">{error}</p> }
    </div>
  );
};

export default SignIn;

