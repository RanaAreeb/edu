import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaEnvelope, FaLock, FaUserCircle, FaUser } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "parent"
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('accountType', formData.accountType);
        router.push('/dashboard');
      } else {
        setError(data.message || "Failed to create account");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
      <div className="flex justify-center items-center flex-1 px-4 py-8">
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
              <motion.h2 
                variants={itemVariants}
                className="text-2xl font-bold text-center text-darkGreen mb-8"
              >
                Create Your Account
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-darkGreen bg-transparent outline-none transition-all duration-300"
                    placeholder="Full Name"
                    required
                  />
                </motion.div>

                {/* Email Input */}
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-darkGreen bg-transparent outline-none transition-all duration-300"
                    placeholder="Email"
                    required
                  />
                </motion.div>

                {/* Password Input */}
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-darkGreen bg-transparent outline-none transition-all duration-300"
                    placeholder="Password"
                    required
                  />
                </motion.div>

                {/* Confirm Password Input */}
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-darkGreen bg-transparent outline-none transition-all duration-300"
                    placeholder="Confirm Password"
                    required
                  />
                </motion.div>

                {/* Account Type Select */}
                <motion.div variants={itemVariants} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserCircle className="text-gray-400 z-10" />
                  </div>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-b-2 border-gray-300 focus:border-darkGreen bg-white outline-none transition-all duration-300 appearance-none"
                    style={{
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="parent">Parent</option>
                    <option value="institution">Educational Institution</option>
                  </select>
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-darkGreen to-lightGreen text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Account
                </motion.button>
              </form>

              <motion.p 
                variants={itemVariants}
                className="mt-6 text-center text-gray-600"
              >
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-darkGreen hover:underline font-medium">
                  Sign In
                </Link>
              </motion.p>
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
