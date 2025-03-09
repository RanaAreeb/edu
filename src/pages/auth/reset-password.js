import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
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
        when: 'beforeChildren',
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
                  className="rounded-full"
                />
              </motion.div>
            </motion.div>

            {/* Form Section */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Reset Password</h2>
              <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
                {/* Email Field */}
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
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                      required
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                      required
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {success && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-500 text-sm text-center"
                  >
                    {success}
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
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </motion.button>

                <div className="text-center">
                  <motion.a
                    href="/auth/signin"
                    className="text-darkGreen hover:text-accent transition-colors duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Back to Sign In
                  </motion.a>
                </div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 