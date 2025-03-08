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
        
        // Redirect to the appropriate page
        router.push(data.redirectTo);
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
    <div className="flex flex-col justify-between min-h-screen bg-gradient-to-b from-lightGreen to-darkGreen">
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
              className="relative h-40 flex items-center justify-center bg-gradient-to-r from-darkGreen to-lightGreen p-6"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-darkGreen to-lightGreen opacity-90"></div>
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
              <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <div className="relative">
                    <FaUserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="institution">Educational Institution</option>
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
                  className={`w-full py-3 bg-darkGreen text-white rounded-lg hover:bg-accent transition-colors duration-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </motion.button>

                <p className="text-sm text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-darkGreen hover:text-accent">
                    Sign up
                  </Link>
                </p>
              </motion.form>
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
