import { useState } from 'react';
import Head from 'next/head';
import { FaHandshake, FaRocket, FaChartLine, FaUsers, FaGlobe, FaFacebook, FaInstagram, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Partnership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const benefits = [
    {
      icon: <FaRocket className="text-3xl text-darkGreen" />,
      title: "Rapid Growth",
      description: "Access to a growing user base of students and educational institutions"
    },
    {
      icon: <FaChartLine className="text-3xl text-darkGreen" />,
      title: "Data Insights",
      description: "Detailed analytics and learning patterns of students"
    },
    {
      icon: <FaUsers className="text-3xl text-darkGreen" />,
      title: "Community",
      description: "Join a network of educational content creators and institutions"
    },
    {
      icon: <FaGlobe className="text-3xl text-darkGreen" />,
      title: "Global Reach",
      description: "Expand your reach to students worldwide"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact/partnership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Thank you for your partnership request! We will get back to you soon.'
        });
        setFormData({
          name: '',
          email: '',
          organization: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Head>
        <title>Partnership - EFG Games</title>
        <meta name="description" content="Partner with EFG Games to create engaging educational experiences" />
      </Head>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Link href="/" className="inline-block mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-darkGreen text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
            >
              <FaHome className="text-xl" />
              <span>Back to Home</span>
            </motion.div>
          </Link>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <FaHandshake className="text-7xl text-darkGreen mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-darkGreen mb-4">Partner With Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our mission to revolutionize education through interactive and engaging games.
            Together, we can make learning an adventure.
          </p>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-50 rounded-full">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-darkGreen mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partnership Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-darkGreen mb-6 text-center">
                Start Your Partnership Journey
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-darkGreen focus:border-transparent transition-all duration-300"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-darkGreen focus:border-transparent transition-all duration-300"
                    />
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-darkGreen focus:border-transparent transition-all duration-300"
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Proposal
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-darkGreen focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your vision for partnership..."
                  />
                </motion.div>

                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {status.message}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg text-white bg-darkGreen hover:bg-opacity-90 transition-all duration-300 transform ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Partnership Request'
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </main>

    
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