import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState("parent"); // Default value set to 'parent'
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Send form data (email, password, accountType) to the API
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, accountType }),
    });

    const data = await response.json();
    if (response.ok) {
      router.push("/auth/signin"); // Redirect to the sign-in page after successful signup
    } else {
      setError(data.message || "An error occurred. Please try again."); // Show error message
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
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Sign Up</h2>
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
          <div className="mb-4">
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

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Account Type Select */}
          <div className="mb-6">
            <label htmlFor="accountType" className="block text-sm text-gray-700">
              Account Type
            </label>
            <select
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="parent">Parent</option>
              <option value="institution">Educational Institution</option>
              <option value="individual">Individual</option>
            </select>
          </div>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Sign Up
          </button>
        </form>

        {/* Link to Sign In */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
       {/* Footer Section */}
      
    </div>
  );
}
