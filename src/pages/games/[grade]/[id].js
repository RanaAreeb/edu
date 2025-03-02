import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaPlay, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { games } from "../../../data/games"; // Importing the game data directly from the data file
import { FaFacebook, FaInstagram } from "react-icons/fa"; // Import social media icons
import Link from "next/link"; // Import Link for Terms and Privacy links

export default function GameDetails() {
  const router = useRouter();
  const { grade, id } = router.query; // Get grade and id from URL

  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comment, setComment] = useState("");
  const [totalPlays, setTotalPlays] = useState(0);
  const [isGamePlaying, setIsGamePlaying] = useState(false);

  const [playTime, setPlayTime] = useState(0); // To track time played
  const [playTimer, setPlayTimer] = useState(null); // To store the timer
  const [iframeLoaded, setIframeLoaded] = useState(false); // To track iframe load

  // Fetch the game data when the router is ready
  useEffect(() => {
    if (!router.isReady) return;
    fetchGameData();
  }, [router.isReady, grade, id]);

  const fetchGameData = async () => {
    try {
      // Get the game data from the database API
      const response = await fetch(`/api/games/${grade}/${id}`);
      const data = await response.json();
      
      if (data.error) {
        console.error('Error fetching game:', data.error);
        return;
      }

      // If the game is not in the database, get it from local data
      if (!data.game) {
        const localGame = games.find(g => g.grade === grade && g.id.toString() === id);
        if (!localGame) {
          console.error('Game not found in local data');
          return;
        }
        setGame(localGame);
        setLikes(0);
        setDislikes(0);
      } else {
        setGame(data.game);
        setLikes(data.game.likes || 0);
        setDislikes(data.game.dislikes || 0);
      }

      // Set the total plays from the database
      setTotalPlays(data.totalPlays || 0);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  // Remove the separate fetchTotalPlays function since we're getting it with game data
  const incrementPlayCount = async () => {
    try {
      const response = await fetch(`/api/games/${grade}/${id}/incrementPlay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      if (data.error) {
        console.error('Error incrementing play count:', data.error);
        return;
      }

      // Update both the game and totalPlays state with the new data
      if (data.game) {
        setGame(data.game);
      }
      if (data.totalPlays !== undefined) {
        setTotalPlays(data.totalPlays);
      }
    } catch (error) {
      console.error("Failed to increment play count:", error);
    }
  };

  // Handle rating update
  const handleRating = async (action) => {
    if (rating === action) {
      // If clicking the same button again, remove the rating
      setRating(null);
      return;
    }

    setRating(action);
    try {
      const response = await fetch(`/api/games/${grade}/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      
      if (data.error) {
        console.error('Error updating rating:', data.error);
        return;
      }

      setLikes(data.likes);
      setDislikes(data.dislikes);
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

  // Handle play or exit game logic
  const handlePlayOrExitGame = async () => {
    if (!isGamePlaying) {
      // User is starting to play the game
      try {
        await incrementPlayCount(); // Increment play count when starting the game
      } catch (error) {
        console.error("Failed to increment play count:", error);
      }
      setPlayTime(0); // Reset play time when game starts
      const timer = setInterval(() => {
        setPlayTime((prev) => prev + 1); // Increase play time by 1 second
      }, 1000);
      setPlayTimer(timer);
    } else {
      // User is quitting the game
      clearInterval(playTimer);
      setPlayTimer(null);
    }
    
    setIsGamePlaying((prev) => !prev); // Toggle game state
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true); // Set iframeLoaded to true when iframe is loaded
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
    <>
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
        {/* Game Description */}
        <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
          {game.description}
        </p>

        {/* Rating Buttons */}
        <div className="flex items-center mb-4 space-x-4">
          <button
            onClick={() => handleRating('like')}
            className="flex flex-col items-center justify-center p-2 rounded-lg"
          >
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              rating === 'like' 
                ? "bg-green-500 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-500"
            }`}>
              <FaThumbsUp className="w-6 h-6" />
            </div>
            <span className="text-sm mt-1">{likes}</span>
          </button>
          <button
            onClick={() => handleRating('dislike')}
            className="flex flex-col items-center justify-center p-2 rounded-lg"
          >
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              rating === 'dislike'
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-500"
            }`}>
              <FaThumbsDown className="w-6 h-6" />
            </div>
            <span className="text-sm mt-1">{dislikes}</span>
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
                onLoad={handleIframeLoad}
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
              margin-top: -530px; /* Move iframe up for mobile */
            }

            #game-frame {
              width: 72% !important;
              height: 86% !important;
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

        <p className="text-sm text-gray-500 mt-6">Total Plays: {totalPlays}</p>
      </motion.div>

      {/* Footer Section */}
      <footer className="bg-darkGreen text-white text-center py-4 mt-auto w-full">
        <p className="text-sm md:text-lg">© 2025 EFG Games. All rights reserved.</p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://www.facebook.com/profile.php?id=61559394101077&sk=about"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>

          <a
            href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
        </div>

        {/* Legal Links (Terms and Conditions, Privacy Policy) */}
       {/* Legal Links */}
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
    </>
  );
}
