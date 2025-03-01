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
      setTotalPlays(selectedGame.totalPlays || 0); // Ensure totalPlays is set correctly
      setRating(selectedGame.rating || null);
    } else {
      console.error("Game not found", { grade, id });
    }
  };

  // Handle rating update
  const handleRating = async (newRating) => {
    setRating(newRating);
    try {
      const response = await fetch(`/api/games/${grade}/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: newRating }),
      });
      await response.json();
    } catch (error) {
      console.error("Failed to update rating:", error);
    }
  };

  // Handle comment submission
  const handleComment = async () => {
    try {
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
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  // Handle play game or exit game action
  const handlePlayOrExitGame = async () => {
    setIsGamePlaying((prev) => !prev);
    if (!isGamePlaying) {
      try {
        const response = await fetch(`/api/games/${grade}/${id}/incrementPlay`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setTotalPlays(data.totalPlays || 0); // Update local state with the new play count
      } catch (error) {
        console.error("Failed to increment play count:", error);
      }
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
      className="flex flex-col items-center p-6 bg-gray-50 min-h-screen bg-lightGreen"
    >
    <div className="w-full max-w-md overflow-hidden rounded-lg shadow-lg mb-6 mx-auto" style={{ maxWidth: '300px' }}>
  <img
    src={game.thumbnail}
    alt={game.title}
    className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-300"
    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
  />
</div>




      {/* Game Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{game.title}</h1>



      {/* Rating Buttons */}
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

   

      {/* Play Game / Exit Button */}
      <div className="w-full max-w-2xl">
        <button
          onClick={handlePlayOrExitGame}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-darkGreen text-white rounded-md hover:bg-secondary transition-all duration-300"
        >
          {isGamePlaying ? (
            <>
              <FaTimes />
              Quit
            </>
          ) : (
            <>
              <FaPlay />
              Play
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
        paddingLeft:"150%", // 16:9 aspect ratio
        height: 0,
      }}
    >
      <iframe
        id="game-frame"
        src={game.link} // External game link
        style={{
          position: "absolute",
          top: 0,
          left: "-15%",
          right: 0,
       
          height: "100%",
          border: "none",
        }}
        title={game.title}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  </div>
)}

<style jsx>{`
  .iframe-container {
    max-width: 150%;
    margin: 0 auto;
  }

  /* For mobile devices */
  @media (max-width: 640px) {
   .iframe-container {
    max-width: 150%;
    margin: -560 auto;
  }

    #game-frame {
      width: 72% !important;
      height: 78% !important;
      left: -17px!important;
    }
  }

  /* For tablet devices */
  @media (min-width: 641px) and (max-width: 1024px) {
   .iframe-container {
    max-width: 150%;
    margin: -560 auto;
  }
    #game-frame {
      width: 70% !important;
      height: 70% !important;
      left:-15px !important;
    }
  }

  /* For larger desktop devices */
  @media (min-width: 1025px) {
    #game-frame {
      width: 100% !important;
      height: 100% !important;
    }
  }
`}</style>


      {/* Total Plays */}
      <p  className="text-sm text-gray-500 mt-6">
        Total Plays: {totalPlays.toLocaleString()}
      </p>

   
    </motion.div>
  );
}
