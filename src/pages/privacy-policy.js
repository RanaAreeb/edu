import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLock, FaUserSecret, FaDatabase, FaCookie, FaShieldAlt, FaFacebook, FaInstagram } from 'react-icons/fa';

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
<footer className="bg-darkGreen text-white text-center py-4 mt-auto">
  <p className="text-sm md:text-lg">© Copyright 2025 EFG Games, a division of Konduct Coach Learning. All Rights Reserved</p>

  {/* Social Media Icons */}
  <div className="flex justify-center space-x-6 mt-4">
    <a href="https://www.facebook.com/profile.php?id=61559394101077&sk=about" target="_blank" rel="noopener noreferrer">
      <FaFacebook className="text-2xl hover:text-lightGreen transition-colors duration-300" />
    </a>
    <a href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
      <FaInstagram className="text-2xl hover:text-lightGreen transition-colors duration-300" />
    </a>
  </div>

  {/* Legal Links */}
  <div className="mt-4 px-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs md:text-sm">
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
      <a className="text-white hover:text-lightGreen transition-colors duration-300 inline-flex items-center whitespace-nowrap">
       
        Partnership
      </a>
    </Link>
  </div>
</footer>
    </div>
  );
} 