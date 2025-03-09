import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"; // For next and previous buttons
import { games } from "../data/games"; // Import the games data
import GameCard from "../components/GameCard"; // Import the GameCard component
import { FaFacebook,  FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Home() {
  const [isMiddleSchool, setIsMiddleSchool] = useState(false); // State to toggle between Elementary and Middle School
  const [isAntHovered, setIsAntHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide notification on mobile after interaction
  useEffect(() => {
    if (isMobile && isAntHovered) {
      const timer = setTimeout(() => {
        setIsAntHovered(false);
      }, 3000); // Hide after 3 seconds on mobile
      return () => clearTimeout(timer);
    }
  }, [isMobile, isAntHovered]);

  // Handle both hover and touch
  const handleInteraction = () => {
    if (isMobile) {
      setIsAntHovered(prev => !prev); // Toggle on mobile
    }
  };

  // Manually specify the IDs of the games you want to feature
  const featuredGameIds = [1,2,3,4,5,6,7]; // Change these IDs to feature different games

  // Filter games based on the selected IDs
  const featuredGames = games.filter((game) =>
    featuredGameIds.includes(game.id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-lightYellow">
      {/* Animated Squid Character with improved mobile support */}
      <motion.div
        className="fixed bottom-4 right-4 z-50 cursor-pointer"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onHoverStart={() => !isMobile && setIsAntHovered(true)}
        onHoverEnd={() => !isMobile && setIsAntHovered(false)}
        onTouchStart={handleInteraction}
        role="button"
        aria-label="Learning assistant"
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="w-20 h-20 md:w-32 md:h-32"
        >
          <motion.g
            animate={isAntHovered ? {
              rotate: [0, -5, 5, -5, 0],
              scale: 1.1
            } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Main Body */}
            <motion.path
              d="M60 30 C40 30 25 45 25 70 C25 95 45 105 60 105 C75 105 95 95 95 70 C95 45 80 30 60 30"
              fill="#4CAF50"
              stroke="#2D3748"
              strokeWidth="2"
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
            />

            {/* Eyes */}
            <g>
              <circle cx="45" cy="55" r="8" fill="white" />
              <circle cx="75" cy="55" r="8" fill="white" />
              <motion.circle 
                cx="45" 
                cy="55" 
                r="4" 
                fill="#2D3748"
                animate={isAntHovered ? {
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.circle 
                cx="75" 
                cy="55" 
                r="4" 
                fill="#2D3748"
                animate={isAntHovered ? {
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </g>

            {/* Happy Mouth */}
            <motion.path
              d="M50 70 Q60 80 70 70"
              stroke="#2D3748"
              strokeWidth="2"
              fill="none"
              animate={isAntHovered ? {
                d: ["M50 70 Q60 80 70 70", "M50 75 Q60 85 70 75"]
              } : {}}
              transition={{ duration: 0.5 }}
            />

            {/* Tentacles */}
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.path
                key={`tentacle-${i}`}
                d={`M${35 + i * 10} 90 Q${35 + i * 10} 110 ${30 + i * 10} 115`}
                stroke="#4CAF50"
                strokeWidth="3"
                fill="none"
                animate={{
                  d: [
                    `M${35 + i * 10} 90 Q${35 + i * 10} 110 ${30 + i * 10} 115`,
                    `M${35 + i * 10} 90 Q${40 + i * 10} 105 ${35 + i * 10} 110`,
                    `M${35 + i * 10} 90 Q${35 + i * 10} 110 ${30 + i * 10} 115`
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}

            {/* Graduation Cap */}
            <motion.g
              animate={isAntHovered ? {
                rotate: [-5, 5, -5],
                y: [-2, 2, -2]
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <path
                d="M40 35 L80 35 L60 20 Z"
                fill="#2D3748"
              />
              <rect
                x="55"
                y="25"
                width="10"
                height="10"
                fill="#2D3748"
              />
              <motion.path
                d="M60 35 L60 40"
                stroke="#2D3748"
                strokeWidth="2"
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.g>
          </motion.g>
        </svg>

        {/* Improved Mobile Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isAntHovered ? 1 : 0,
            y: isAntHovered ? 0 : 10,
            x: isMobile ? '-50%' : 0
          }}
          className={`absolute ${
            isMobile 
              ? 'bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-48 text-center' 
              : 'bottom-full right-0 mb-2'
          } bg-lightGreen text-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-normal`}
        >
          <div className="relative">
            {isMobile ? (
              <>
                Ready to learn something new? 🎓
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-lightGreen rotate-45"></div>
              </>
            ) : (
              <>
                Ready to learn something new? 🎓
                <div className="absolute -bottom-2 right-6 w-3 h-3 bg-lightGreen rotate-45"></div>
              </>
            )}
          </div>
        </motion.div>

        {/* Mobile Tap Indicator */}
        {isMobile && !isAntHovered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
          />
        )}
      </motion.div>

      {/* Header Section with Logo and Tagline */}
      <header className="text-center p-6 md:p-10 bg-gradient-to-r bg-lightGreen text-white">
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <Image
              src="/EFG_Games.jpg" // Logo path
              alt="EFG Games Logo"
              width={220} // Adjust logo size
              height={220}
              className="rounded-full"
            />
          </Link>
          <p className="text-2xl font-bold ">Play and Learn Your Way</p>
        </div>
      </header>

      {/* Play and Learn Your Way Section (Heading in Yellow) */}
      <div className="bg-lightYellow p-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          {isMiddleSchool
            ? "Middle School Grades (5th-9th)"
            : "Elementary School Grades (K-4th)"}
        </h2>
      </div>

      {/* Grade Categories Section */}
      <div className="flex justify-center items-center p-4 md:p-10 transition-all duration-300">
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${isMiddleSchool ? "fade-in" : ""}`}
        >
          {isMiddleSchool
            ? ["5th", "6th","7th", "8th","9th"].map((grade, index) => (
                <Link href={`/games/${grade}`} key={index}>
                  <div className="flex flex-col items-center bg-lightGreen p-4 md:p-6 rounded-full shadow-lg cursor-pointer hover:bg-accent hover:text-white transition duration-300">
                    <div className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xl md:text-2xl text-white">{grade}</span>
                    </div>
                    <h3 className="text-sm md:text-lg">{grade} Grade</h3>
                  </div>
                </Link>
              ))
            : ["K", "1st", "2nd", "3rd", "4th"].map((grade, index) => (
                <Link href={`/games/${grade}`} key={index}>
                  <div className="flex flex-col items-center bg-lightGreen p-4 md:p-6 rounded-full shadow-lg cursor-pointer hover:bg-accent hover:text-white transition duration-300">
                    <div className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xl md:text-2xl text-white">{grade}</span>
                    </div>
                    <h3 className="text-sm md:text-lg">{grade} Grade</h3>
                  </div>
                </Link>
              ))}
        </div>
      </div>

      {/* Next / Previous Button Section */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setIsMiddleSchool(false)}
          className={`px-2 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
            !isMiddleSchool ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isMiddleSchool}
        >
          <FaArrowLeft className="inline-block mr-2" /> Back to Elementary
        </button>

        <button
          onClick={() => setIsMiddleSchool(true)}
          className={`px-2 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
            isMiddleSchool ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isMiddleSchool}
        >
          Next: Middle School <FaArrowRight className="inline-block ml-2" />
        </button>
      </div>

      {/* Featured Games Section */}
      <div className="bg-lightGreen flex justify-center items-center p-4 md:p-10 mt-3">
        <div className="w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">
            Featured Games
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredGames.map((game) => (
              <div key={game.id} className="game-card w-full max-w-xs mx-auto">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Play. Learn. Practice Section */}
      <div className="bg-lightGreen p-4 md:p-10">
        <p className="text-center text-sm md:text-lg text-white mb-4 md:mb-6">
          Our games are designed to make learning fun and engaging for all grade levels.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/games/Math">
            <div className="bg-lightGreen p-4 md:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Math Games</h3>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-lightYellow rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl text-primary">➗</span>
              </div>
            </div>
          </Link>
          <Link href="/games/Science">
            <div className="bg-lightGreen p-4 md:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Science Games</h3>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-lightYellow rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl text-primary">🔬</span>
              </div>
            </div>
          </Link>
          <Link href="/games/Language Arts">
            <div className="bg-lightGreen p-4 md:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Language Arts Games</h3>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-lightYellow rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl text-primary">✏️</span>
              </div>
            </div>
          </Link>
          <Link href="/games/Other">
            <div className="bg-lightGreen p-4 md:p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Other Games</h3>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-lightYellow rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl text-primary">🎮</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-darkGreen text-white py-4">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
            {/* Left Section - Logo and Social Media */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative w-[120px] h-[120px] mb-4">
                <Image
                  src="/EFG_Games.jpg"
                  alt="EFG Games Logo"
                  fill
                  className="rounded-full object-cover"
                  priority
                />
              </div>
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

      {/* CSS for Transition */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}