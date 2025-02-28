import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment, FaPlay, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { games } from "../../../data/games"; // Importing the game data directly from the data file

export default function GameDetails() {
  const router = useRouter();
  const { grade, id } = router.query; // Get grade and id from URL

  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [totalPlays, setTotalPlays] = useState(0);
  const [isGamePlaying, setIsGamePlaying] = useState(false);

  // UseEffect to fetch the game data when the router is ready
  useEffect(() => {
    if (!router.isReady) return;
    fetchGameData();
  }, [router.isReady, grade, id]);

  // Fetch game data from the games array based on the grade and id
  const fetchGameData = () => {
    const selectedGame = games.find(
      (g) => g.id.toString() === id && g.grade === grade
    );
    if (selectedGame) {
      setGame(selectedGame);
      setTotalPlays(selectedGame.totalPlays);
      setRating(selectedGame.rating || null);
    } else {
      console.error("Game not found", { grade, id });
    }
  };

  // Handle rating update
  const handleRating = async (newRating) => {
    setRating(newRating);
    const response = await fetch(`/api/games/${grade}/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: newRating }),
    });
    await response.json();
  };

  // Handle comment submission
  const handleComment = async () => {
    const response = await fetch(`/api/games/${grade}/${id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });
    const data = await response.json();
    if (data.message === "Comment added") {
      setComment(""); // Clear comment input
    }
  };

  // Handle play game or exit game action
  const handlePlayOrExitGame = async () => {
    setIsGamePlaying((prev) => !prev);
    if (!isGamePlaying) {
      const response = await fetch(`/api/games/${grade}/${id}/incrementPlay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTotalPlays(data.totalPlays); // Update local state with the new play count
    }
  };

  if (!game) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-red-600">Game Not Found</h1>
        <p className="text-lg text-gray-600">
          Sorry, we couldn't find this game.
        </p>
        <a href="/" className="mt-6 px-4 py-2 bg-primary text-white rounded-lg">
          Go Back
        </a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center p-6 bg-gray-50 min-h-screen"
    >
      {/* Game Thumbnail */}
      <div className="w-full max-w-2xl overflow-hidden rounded-lg shadow-lg mb-6">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Game Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{game.title}</h1>

      {/* Game Description */}
      <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
        {game.description}
      </p>

      {/* Rating Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => handleRating("👍")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            rating === "👍"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-green-50"
          }`}
        >
          <FaThumbsUp />
          Like
        </button>
        <button
          onClick={() => handleRating("👎")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            rating === "👎"
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-red-50"
          }`}
        >
          <FaThumbsDown />
          Dislike
        </button>
      </div>

      {/* Comment Section */}
      <div className="w-full max-w-2xl mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
        />
        <button
          onClick={handleComment}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-all duration-300"
        >
          <FaComment />
          Post Comment
        </button>
      </div>

      {/* Play Game / Exit Button */}
      <div className="w-full max-w-2xl">
        <button
          onClick={handlePlayOrExitGame}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-all duration-300"
        >
          {isGamePlaying ? (
            <>
              <FaTimes />
              Exit Game
            </>
          ) : (
            <>
              <FaPlay />
              Play Game
            </>
          )}
        </button>
      </div>

      {isGamePlaying && (
        <div id="game-container" className="w-full max-w-2xl mt-6">
          <div
            className="iframe-container"
            style={{
              position: "relative",
              paddingBottom: "96.25%",
              height: 0,
            }}
          >
            <iframe
              id="game-frame"
              src={game.link} // External game link
              style={{
                position: "absolute",
                top: 0,
                left: "15%", // Adjust to move iframe left
                right: 0,
                width: "150%",
                height: "100%",
                transform: "translateX(-25%)", // Move it left by 25% more, tweak if necessary
              }}
              title={game.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Total Plays */}
      <p className="text-sm text-gray-500 mt-6">
        Total Plays: {totalPlays.toLocaleString()}
      </p>
    </motion.div>
  );
}
