import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-lightYellow">
      {/* Header Section */}
      <header className="text-center p-6 md:p-10 bg-gradient-to-r bg-lightGreen text-white">
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <Image
              src="/EFG_Games.jpg" // Logo path
              alt="EFG Games Logo"
              width={180} // Adjust logo size
              height={180}
              className="rounded-full"
            />
          </Link>
          <p className="text-1xl font-bold">Play and Learn Your Way</p>
        </div>
      </header>

      {/* About Section */}
      <div className="flex justify-center items-center p-4 md:p-10">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-black mb-6">
            About EFG Games
          </h1>
          <p className="text-lg text-gray-800 mb-4">
            EFG Games is dedicated to making learning fun and engaging for students of all grades. Our games cover various subjects such as math, science, and language arts, providing an interactive experience to help students improve their skills.
          </p>
          <p className="text-lg text-gray-800 mb-4">
            Our platform is designed to cater to both elementary and middle school students, with age-appropriate content that aligns with the curriculum. We believe that learning should be enjoyable, and our games aim to foster a love for learning.
          </p>
          <p className="text-lg text-gray-800 mb-4">
            Join us today and explore a wide range of educational games to make your learning journey more fun!
          </p>
          <div className="text-center">
            <Link href="/" passHref>
              <button className="bg-darkGreen text-white px-6 py-2 rounded-lg  transition-colors duration-300">
                Go Back Home
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Section */}
<footer className="bg-darkGreen text-white text-center py-4 mt-auto">
  <p className="text-sm md:text-lg">© 2025 EFG Games. All rights reserved.</p>

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
  <div className="mt-4 text-sm">
    <Link href="/" legacyBehavior>
      <a className="text-white hover:text-gray-400 transition-colors duration-300 mx-2">
        Terms and Conditions
      </a>
    </Link>
    |
    <Link href="/" legacyBehavior>
      <a className="text-white hover:text-gray-400 transition-colors duration-300 mx-2">
        Privacy Policy
      </a>
    </Link>
    |
    <Link href="/about" legacyBehavior>
      <a className="text-white hover:text-gray-400 transition-colors duration-300 mx-2">
        About
      </a>
    </Link>
  </div>
</footer>

    </div>
  );
}
