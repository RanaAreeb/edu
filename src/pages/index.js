import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"; // For next and previous buttons
import { games } from "../data/games"; // Import the games data
import GameCard from "../components/GameCard"; // Import the GameCard component
import { FaFacebook,  FaInstagram } from "react-icons/fa";
export default function Home() {
  const [isMiddleSchool, setIsMiddleSchool] = useState(false); // State to toggle between Elementary and Middle School

  // Manually specify the IDs of the games you want to feature
  const featuredGameIds = [1,2,3,4,5,6,7]; // Change these IDs to feature different games

  // Filter games based on the selected IDs
  const featuredGames = games.filter((game) =>
    featuredGameIds.includes(game.id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-lightYellow">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
              <h3 className="text-lg md:text-xl font-semibold  mb-2 md:mb-4">Language Arts Games</h3>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-lightYellow rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl md:text-2xl text-primary">✏️</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer Section */}
       {/* Footer Section */}
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