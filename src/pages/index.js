import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-lightYellow">
      {/* Header Section with Logo and Tagline */}
      <header className="text-center p-6 md:p-10 bg-gradient-to-r  bg-lightGreen text-white">
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
          <p className="text-2xl font-bold ">Play and Learn Your Way</p>
        </div>
      </header>

      {/* Grade Categories Section */}
      <div className="flex justify-center items-center p-4 md:p-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["K", "1st", "2nd", "3rd", "4th", "5th"].map((grade, index) => (
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

      {/* Educational Categories Section */}
      <div className="flex justify-center items-center p-4 md:p-10 bg-lightGreen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Finance", "Reading", "Language Arts"].map((grade, index) => (
               <Link href={`/games/${grade}`} key={index}>
            <div
              key={index}
              className="flex flex-col items-center bg-lightBlue p-4 md:p-6 rounded-lg shadow-lg cursor-pointer hover:bg-accent hover:text-white transition duration-300"
            >
              {/* Subject Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 mb-2 md:mb-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📚</span> {/* Replace with actual subject icons */}
              </div>
              <h3 className="text-base md:text-lg font-semibold">{grade}</h3>
              <p className="text-xs md:text-sm">Explore fun games in {grade}.</p>
            </div>
            </Link>
          ))}
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
      <footer className="bg-darkGreen text-white text-center py-4 mt-auto">
        <p className="text-sm md:text-lg">© 2025 EFG Games. All rights reserved.</p>
      </footer>
    </div>
  );
}
