import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaHandshake, FaUserShield, FaBalanceScale, FaFacebook, FaInstagram, FaHome } from 'react-icons/fa';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function TermsAndConditions() {
  const sections = [
    {
      icon: <FaHandshake className="text-4xl text-darkGreen" />,
      title: "1. Acceptance of Terms",
      content: "By accessing and using EFG Games' services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms apply to all users, including students, parents, and educational institutions."
    },
    {
      icon: <FaUserShield className="text-4xl text-darkGreen" />,
      title: "2. User Accounts",
      content: "Users are responsible for maintaining the confidentiality of their account credentials. Parents/guardians are responsible for monitoring their children's use of the service. We reserve the right to terminate accounts that violate our terms."
    },
    {
      icon: <FaBalanceScale className="text-4xl text-darkGreen" />,
      title: "3. Intellectual Property",
      content: "All content, including games, educational materials, and software, is the property of EFG Games and protected by copyright laws. Users may not reproduce, distribute, or create derivative works without our permission."
    },
    {
      icon: <FaShieldAlt className="text-4xl text-darkGreen" />,
      title: "4. User Conduct",
      content: "Users must not engage in any activity that disrupts or interferes with our services, including attempting to gain unauthorized access, transmitting malware, or harassing other users."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Head>
        <title>Terms and Conditions - EFG Games</title>
        <meta name="description" content="Terms and Conditions for EFG Games educational platform" />
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
          <FaBalanceScale className="text-6xl text-darkGreen mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-darkGreen mb-4">Terms and Conditions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our educational gaming platform.
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
          className="mt-12 text-center"
        >
          <p className="text-gray-600 max-w-2xl mx-auto">
            For any questions about these terms, please{' '}
            <Link href="/contact" className="text-darkGreen hover:text-lightGreen transition-colors duration-300">
              contact us
            </Link>
            .
          </p>
        </motion.div>
      </main>

      {/* Footer Section */}
      <footer className="bg-darkGreen text-white py-4">
  <div className="container mx-auto px-4">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
        <div className="flex space-x-4">
          <a href="https://www.facebook.com/profile.php?id=61559394101077&sk=about" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="ml-4 text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
          <a href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="ml-3 text-2xl hover:text-lightGreen transition-colors duration-300" />
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