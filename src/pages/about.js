import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaGamepad, 
  FaChartLine, 
  FaUsers, 
  FaLightbulb,
  FaAward,
  FaFacebook,
  FaInstagram,
  FaHome
} from 'react-icons/fa';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function About() {
  const features = [
    {
      icon: <FaGamepad className="text-4xl text-darkGreen" />,
      title: "Interactive Learning",
      description: "Our games make learning fun and engaging, helping students stay motivated while developing essential skills."
    },
    {
      icon: <FaChartLine className="text-4xl text-darkGreen" />,
      title: "Progress Tracking",
      description: "Detailed analytics help parents and teachers monitor student progress and identify areas for improvement."
    },
    {
      icon: <FaLightbulb className="text-4xl text-darkGreen" />,
      title: "Adaptive Learning",
      description: "Our platform adjusts to each student's pace and learning style, ensuring optimal educational outcomes."
    }
  ];

  const achievements = [
    {
      icon: <FaUsers className="text-3xl text-darkGreen" />,
      number: "50,000+",
      label: "Active Students"
    },
    {
      icon: <FaGamepad className="text-3xl text-darkGreen" />,
      number: "100+",
      label: "Educational Games"
    },
    {
      icon: <FaAward className="text-3xl text-darkGreen" />,
      number: "95%",
      label: "Satisfaction Rate"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Head>
        <title>About Us - EFG Games</title>
        <meta name="description" content="Learn about EFG Games and our mission to revolutionize education through gaming" />
      </Head>

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
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
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <FaGraduationCap className="text-7xl text-darkGreen mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-bold text-darkGreen mb-4">Revolutionizing Education Through Gaming</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At EFG Games, we believe learning should be an adventure. Our mission is to transform education by creating 
            engaging, interactive experiences that make learning fun and effective.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="inline-block p-3 bg-gray-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-darkGreen mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-darkGreen mb-6">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We envision a world where every student has access to high-quality, engaging educational content that adapts 
              to their unique learning style. Through our innovative gaming platform, we're making this vision a reality, 
              one student at a time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="inline-block p-3 bg-gray-50 rounded-full mb-3">
                    {achievement.icon}
                  </div>
                  <p className="text-2xl font-bold text-darkGreen">{achievement.number}</p>
                  <p className="text-gray-600">{achievement.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Founder's Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-16"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-darkGreen mb-6 text-center">Founder's Story</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Clifton Manneh is the founder of EFG Games which is dedicated to making learning fun and engaging for students of all grades. 
                Our games cover various subjects such as math, science, coding, and language arts, providing an interactive experience to help 
                students improve their skills.
              </p>
              <p>
                Our platform is designed to cater to both elementary and middle school students, with age-appropriate content that aligns with 
                the curriculum. We believe that learning should be enjoyable, and our games aim to foster a love for learning.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg my-8">
                <p className="italic">
                  "In addition to EFG Games, Clifton is also the founder of Tutorants, a community and mentorship-based platform that provides 
                  24-hour tutoring to students in need of academic support. Tutorants has 5,000 expert tutors specializing in all academic disciplines."
                </p>
              </div>
              <p>
                Clifton's journey towards creating EFG Games began in Monrovia, Liberia, where he was born, and his dedication to education 
                was further fueled by the loss of his little sister and the hardships his family faced. With a degree in Organizational 
                Communications from Metropolitan State University, Clifton has transformed his personal experiences into a mission to make 
                quality education accessible and engaging for all students.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-darkGreen mb-8">Join Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you're a parent, teacher, or educational institution, we invite you to join us in revolutionizing 
            education through engaging, interactive learning experiences.
          </p>
          <Link href="/partnership" className="inline-block bg-darkGreen text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1">
            Partner With Us
          </Link>
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
