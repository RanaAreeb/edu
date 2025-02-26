import GameCard from "../../components/GameCard";
import { games } from "../../data/games"; // Importing game data

export default function GameList() {
  return (
    <div className="flex flex-col min-h-screen bg-lightYellow">
      {/* Banner Section */}
      <header className="text-center p-10 bg-primary text-white">
        <h1 className="text-4xl font-bold mb-4">Educational Games for Kids</h1>
        <p className="text-lg">
          Explore our wide range of educational games across different grade levels.
        </p>
      </header>

      {/* Grade Categories Section */}
      <div className="flex justify-center items-center gap-6 p-10">
        <div className="flex flex-wrap justify-center gap-6">
          {["K4", "K", "1st", "2nd", "3rd", "4th", "5th"].map((grade, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-lightGreen p-6 rounded-full shadow-lg cursor-pointer hover:bg-accent hover:text-white transition duration-300"
            >
              <div className="w-16 h-16 mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">{grade}</span>
              </div>
              <h3 className="text-lg">{grade} Grade</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Game List Section */}
      <div className="bg-lightGreen p-10">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Explore Our Educational Games
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-darkGreen text-white text-center py-4 mt-auto">
        <p className="text-lg">© 2025 EFG Games. All rights reserved.</p>
      </footer>
    </div>
  );
}
