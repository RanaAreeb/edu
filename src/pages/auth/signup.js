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
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-b from-lightGreen to-darkGreen">
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
                  className="rounded-full shadow-xl"
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

      {/* Footer */}
      <footer className="bg-darkGreen/90 backdrop-blur-md text-white text-center py-4">
        <p className="text-sm">© 2025 EFG Games. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-4">
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="https://www.facebook.com/profile.php?id=61559394101077&sk=about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-lightGreen transition-colors duration-300"
          >
            <FaFacebook className="text-2xl" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.1 }}
            href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-lightGreen transition-colors duration-300"
          >
            <FaInstagram className="text-2xl" />
          </motion.a>
        </div>
        <div className="mt-4 flex justify-center items-center space-x-4 text-sm">
          <Link href="/terms-and-conditions" className="hover:text-lightGreen transition-colors duration-300">
            Terms
          </Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-lightGreen transition-colors duration-300">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
