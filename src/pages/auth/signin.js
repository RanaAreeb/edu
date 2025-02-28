import { useState } from "react";
import { useRouter } from "next/router";

import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("parent"); // Add accountType state
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send login data to the API, including account type
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, accountType }), // Send account type with the request
    });

    const data = await response.json();
    if (response.ok) {
      // If login is successful, save the token to localStorage
      localStorage.setItem("token", data.token);
      
      // Optionally, you can also store the account type in localStorage if you need to access it
      localStorage.setItem("accountType", data.accountType); 

      // Redirect to the home page
      router.push("/");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-lightGreen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <header className="text-center p-6 md:p-10 bg-gradient-to-r  text-white">
        <div className="flex flex-col items-center justify-center">
        
            <Image
              src="/EFG_Games.jpg" // Logo path
              alt="EFG Games Logo"
              width={180}  // Adjust logo size
              height={180}
              className="rounded-full"
            />
          
        
        </div>
      </header>
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

       

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Sign In
          </button>
        </form>

        {/* Link to Sign Up */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-primary hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
    
  );
}
