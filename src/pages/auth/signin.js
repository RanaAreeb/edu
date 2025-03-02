import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaFacebook, FaInstagram } from "react-icons/fa"; // Import social media icons
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("parent");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, accountType }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the token and account type
        localStorage.setItem("token", data.token);
        localStorage.setItem("accountType", data.accountType);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect to home page
        router.push("/");
      } else {
        setError(data.error || "An error occurred during sign in");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred during sign in");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-lightGreen">
      <div className="flex justify-center items-center flex-1">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <header className="text-center p-6 md:p-8 bg-gradient-to-r text-white">
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/EFG_Games.jpg" // Logo path
                alt="EFG Games Logo"
                width={150} // Reduced logo size
                height={150}
                className="rounded-full"
              />
            </div>
          </header>
          <h2 className="text-2xl font-bold text-center text-primary mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out transform hover:scale-105"
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out transform hover:scale-105"
                required
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </button>
          </form>

          {/* Link to Sign Up */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-darkGreen text-white text-center py-4 mt-4">
        <p className="text-sm md:text-lg">© 2025 EFG Games. All rights reserved.</p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://www.facebook.com/profile.php?id=61559394101077&sk=about"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>

          <a
            href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
        </div>

        {/* Legal Links (Terms and Conditions, Privacy Policy) */}
        <div className="mt-4 text-sm">
          <Link href="/terms-and-conditions" legacyBehavior>
            <a className="text-white hover:text-gray-400 transition-colors duration-300 mx-2">
              Terms and Conditions
            </a>
          </Link>
          |
          <Link href="/privacy-policy" legacyBehavior>
            <a className="text-white hover:text-gray-400 transition-colors duration-300 mx-2">
              Privacy Policy
            </a>
          </Link>
        </div>
      </footer>
    </div>
  );
}
