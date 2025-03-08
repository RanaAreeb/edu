import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLock, FaUserSecret, FaDatabase, FaCookie, FaShieldAlt, FaFacebook, FaInstagram, FaHome } from 'react-icons/fa';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <FaUserSecret className="text-4xl text-darkGreen" />,
      title: "Information We Collect",
      content: "We collect information necessary to provide our educational services, including: name, age, grade level, email address, and learning progress data. For students under 13, we require parental consent in compliance with COPPA."
    },
    {
      icon: <FaDatabase className="text-4xl text-darkGreen" />,
      title: "How We Use Your Data",
      content: "Your data is used to personalize learning experiences, track educational progress, and improve our services. We never sell personal information to third parties and maintain strict data protection standards."
    },
    {
      icon: <FaCookie className="text-4xl text-darkGreen" />,
      title: "Cookies & Tracking",
      content: "We use cookies to enhance your experience and maintain your login session. These help us understand how you use our platform and allow us to make improvements to better serve our users."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-darkGreen" />,
      title: "Data Security",
      content: "We implement robust security measures to protect your personal information, including encryption, secure servers, and regular security audits. We comply with all relevant data protection regulations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Head>
        <title>Privacy Policy - EFG Games</title>
        <meta name="description" content="Privacy Policy for EFG Games educational platform" />
      </Head>

      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
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
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
          >
            <FaLock className="text-6xl text-darkGreen mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-darkGreen mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We take your privacy seriously. Learn how we protect and manage your personal information.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-8 max-w-4xl mx-auto"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-50 rounded-full">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-darkGreen mb-3">{section.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto"
        >
          <h2 className="text-xl font-semibold text-darkGreen mb-4">Contact Us About Privacy</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about our privacy practices or would like to exercise your data rights, please contact our Privacy Team at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-darkGreen">Email: privacy@efggames.com</p>
            <p className="text-darkGreen">Phone: (555) 123-4567</p>
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