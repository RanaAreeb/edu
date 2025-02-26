import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Import icons from react-icons

export default function GameCard({ game }) {
  const [rating, setRating] = useState(null); // Track rating
  const [comment, setComment] = useState(""); // Track comment
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const [totalPlays, setTotalPlays] = useState(game.totalPlays); // Track total plays

  const router = useRouter();

  // Check if the user is logged in by looking for a token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handlePlayGame = async () => {
    // Update the total plays on the backend or database
    const response = await fetch(`/api/games/${game.id}/incrementPlay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      setTotalPlays(data.totalPlays); // Update local state with new total plays
    }
  };

  const handleRating = async (newRating) => {
    if (!isLoggedIn) {
      alert("Please sign in to leave a rating.");
      return;
    }

    // Send the rating to the backend or database
    const response = await fetch(`/api/games/${game.id}/rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: newRating }),
    });

    if (response.ok) {
      setRating(newRating); // Update local state with new rating
    }
  };

  const handleComment = async () => {
    if (!isLoggedIn) {
      alert("Please sign in to leave a comment.");
      return;
    }

    // Send the comment to the backend or database
    const response = await fetch(`/api/games/${game.id}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });

    if (response.ok) {
      setComment(""); // Clear the comment input after submission
    }
  };

  return (
    <div className="bg-white p-6 border rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
      <h3 className="text-xl font-semibold text-primary mb-4">{game.title}</h3>
      <p className="text-gray-600 mb-4">{game.description}</p>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Grade: {game.grade}</p>
        <p className="text-sm text-gray-500">Total Plays: {totalPlays}</p>
      </div>

      {/* Like/Dislike Buttons */}
      <div className="flex items-center mb-4 space-x-4">
        <button
          onClick={() => handleRating("👍🏾")}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
            rating === "👍🏾"
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-500"
          }`}
          title="Like this game"
        >
          <FaThumbsUp className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleRating("👎🏾")}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
            rating === "👎🏾"
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-500"
          }`}
          title="Dislike this game"
        >
          <FaThumbsDown className="w-6 h-6" />
        </button>
      </div>

      {/* Comment Section */}
      {isLoggedIn && (
        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleComment}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-all duration-300"
          >
            Post Comment
          </button>
        </div>
      )}

      {/* Play Game Button */}
      <div className="mt-4">
        <button
          onClick={handlePlayGame}
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-all duration-300"
        >
          Play Game
        </button>
      </div>
    </div>
  );
}