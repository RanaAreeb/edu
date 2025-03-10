import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, accountType }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store user info and account type in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('accountType', accountType);
        
        // Check for returnUrl in query parameters
        const returnUrl = router.query.returnUrl;
        if (returnUrl) {
          // Decode the URL and redirect back to the game
          router.push(decodeURIComponent(returnUrl));
        } else {
          // Default redirect if no returnUrl
          router.push(data.redirectTo);
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-lightGreen">
      <div className="flex justify-center items-center flex-1 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md"
        >
          {/* Card Container */}
          <div className="backdrop-blur-md bg-white/90 rounded-2xl shadow-2xl overflow-hidden">
            {/* Logo Section */}
            <motion.div 
              className="relative h-40 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-500 p-6"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-500 opacity-90"></div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Image
                  src="/EFG_Games.jpg"
                  alt="EFG Games Logo"
                  width={120}
                  height={120}
                  className="rounded-full "
                />
              </motion.div>
            </motion.div>

            {/* Form Section */}
            <div className="p-8">
              <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <div className="relative">
                    <FaUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent appearance-none bg-white"
                      style={{
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1.5em 1.5em'
                      }}
                    >
                      <option value="student">Player</option>
                      <option value="parent">Parent</option>
                      <option value="institution">Educator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link href="/auth/reset-password" className="text-darkGreen hover:text-accent transition-colors duration-300">
                    Reset Password
                  </Link>
                  <Link href="/auth/signup" className="text-darkGreen hover:text-accent">
                    Sign up
                  </Link>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 bg-darkGreen text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>

     
      {/* Footer Section */}
<footer className="bg-darkGreen text-white py-4">
  <div className="container mx-auto px-4">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
      {/* Left Section - Logo and Social Media */}
      <div className="flex flex-col items-center md:items-start">
        <Image
          src="/EFG_Games.jpg"
          alt="EFG Games Logo"
          width={120}
          height={120}
          className="rounded-full mb-4"
        />
        {/* Social Media Icons */}
        <div className="flex space-x-12">
          <a href="https://www.facebook.com/profile.php?id=61559394101077&sk=about" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
          <a href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
        </div>
      </div>

      {/* Right Section - Legal Links */}
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-2 gap-y-2 text-3xs">
        <Link href="/terms-and-conditions" legacyBehavior>
          <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
            Terms and Conditions
          </a>
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/privacy-policy" legacyBehavior>
          <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
            Privacy Policy
          </a>
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/about" legacyBehavior>
          <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
            About
          </a>
        </Link>
        <span className="text-gray-400">•</span>
        <Link href="/partnership" legacyBehavior>
          <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
            Partnership
          </a>
        </Link>
      </div>
    </div>

    {/* Copyright Text - At the very bottom */}
    <div className="border-t border-gray-600 mt-4 pt-4">
      <p className="text-[14px] text-center text-gray-400">
        © Copyright 2025 EFG Games, a division of Konduct Coach Learning. All Rights Reserved
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}
