import { useRouter } from "next/router";
import { FaPlay } from "react-icons/fa"; // React Icons
import { motion } from "framer-motion"; // For animations

export default function GameCard({ game }) {
  const router = useRouter();

  const handlePlayGame = () => {
    // Redirect to the detailed game page with dynamic route for grade and id
    router.push(`/games/${game.grade}/${game.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative p-4 rounded-lg shadow-xl group cursor-pointer"
    >
      {/* Game Image with Link */}
      <a href={game.link} target="_blank" rel="noopener noreferrer">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </a>

      {/* Play Game Button */}
      <button
        onClick={handlePlayGame}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-yellow-600 text-white rounded-lg hover:from-green-700 hover:to-yellow-700 transition-all duration-300 group-hover:scale-105"
      >
        <FaPlay className="text-lg" />
        Play Game
      </button>

      {/* Total Plays */}
      <p className="text-sm text-gray-500 mt-4">
        Total Plays: {game.totalPlays}
      </p>
    </motion.div>
  );
}
