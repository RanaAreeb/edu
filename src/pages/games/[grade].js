import { useRouter } from "next/router";
import { games } from "../../data/games"; // Import the games data
import GameCard from "../../components/GameCard";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram } from "react-icons/fa"; // Import social media icons

export default function GradePage() {
  const router = useRouter();
  const { grade } = router.query;

  // Filter games based on the grade
  const filteredGames = games.filter((game) => game.grade === grade);

  console.log(filteredGames); // Log to check if games are being filtered correctly

  return (
    <div className="flex flex-col min-h-screen bg-lightGreen">
      {/* Header Section */}
      <header className="text-center p-6 md:p-10 bg-gradient-to-r bg-lightGreen text-white">
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <Image
              src="/EFG_Games.jpg" // Logo path
              alt="EFG Games Logo"
              width={180}  // Adjust logo size
              height={180}
              className="rounded-full"
            />
          </Link>
          <p className="text-1xl font-bold ">Play and Learn Your Way</p>
        </div>
      </header>
      
      

      <header className="text-center p-6 md:p-2 bg-lightGreen text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{grade} Grade Games</h1>
        <p className="text-base md:text-xl">
          Explore all the {grade} games and have fun while learning!
        </p>
      </header>
      {/* Go Back Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => router.back()}
          className="bg-darkGreen text-white px-4 py-2 rounded-lg text-lg  transition-colors duration-300"
        >
          Go Back
        </button>
      </div>

      {/* Games Grid Section */}
      <div className="flex justify-center items-center p-4 md:p-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => <GameCard key={game.id} game={game} />)
          ) : (
            <p className="text-center text-lg  text-white">Coming Soon!</p>
          )}
        </div>
      </div>

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
