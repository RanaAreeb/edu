import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaPlay, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { games } from "../../../data/games"; // Importing the game data directly from the data file
import { FaFacebook, FaInstagram } from "react-icons/fa"; // Import social media icons
import Link from "next/link"; // Import Link for Terms and Privacy links
import { MdScreenRotation } from "react-icons/md"; // Import rotation icon

export default function GameDetails() {
  const router = useRouter();
  const { grade, id } = router.query; // Get grade and id from URL

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [game, setGame] = useState(null);
  const [rating, setRating] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comment, setComment] = useState("");
  const [totalPlays, setTotalPlays] = useState(0);
  const [isGamePlaying, setIsGamePlaying] = useState(false);
  const [showRotateNotice, setShowRotateNotice] = useState(true); // New state for rotation notice
  const [isMobile, setIsMobile] = useState(false); // New state to track mobile device

  const [playTime, setPlayTime] = useState(0); // To track time played
  const [playTimer, setPlayTimer] = useState(null); // To store the timer
  const [iframeLoaded, setIframeLoaded] = useState(false); // To track iframe load
  const [hasIncrementedPlay, setHasIncrementedPlay] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Add listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide rotation notice after 5 seconds
  useEffect(() => {
    if (showRotateNotice) {
      const timer = setTimeout(() => {
        setShowRotateNotice(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showRotateNotice]);

  // First, try to get the game from local data
  useEffect(() => {
    if (!router.isReady) return;
    
    const localGame = games.find(g => g.grade === grade && g.id.toString() === id);
    if (localGame) {
      setGame(localGame);
    }
  }, [router.isReady, grade, id]);

  // Then fetch additional data from the database
  useEffect(() => {
    if (!router.isReady) return;
    fetchGameData();
  }, [router.isReady, grade, id]);

  const fetchGameData = async () => {
    if (!grade || !id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/games/${grade}/${id}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      if (data.game) {
        setGame(prevGame => ({
          ...prevGame,
          ...data.game
        }));
        setLikes(data.game.likes || 0);
        setDislikes(data.game.dislikes || 0);
      }

      setTotalPlays(data.totalPlays || 0);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setError('Failed to load game data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle play count increment
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

  // Handle play time tracking and increment play count after 30 seconds
  useEffect(() => {
    let timer;
    if (isGamePlaying && !hasIncrementedPlay) {
      timer = setInterval(() => {
        setPlayTime(prev => {
          const newTime = prev + 1;
          // Increment play count after 30 seconds
          if (newTime === 30 && !hasIncrementedPlay) {
            incrementPlayCount();
            setHasIncrementedPlay(true);
            // Clear the interval after incrementing
            clearInterval(timer);
          }
          return newTime;
        });
      }, 1000);
      setPlayTimer(timer);
    }

    // Cleanup function
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isGamePlaying, hasIncrementedPlay]);

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
  const handlePlayOrExitGame = () => {
    if (!isGamePlaying) {
      // Starting the game
      setPlayTime(0);
      setHasIncrementedPlay(false);
    } else {
      // Quitting the game
      if (playTimer) {
        clearInterval(playTimer);
        setPlayTimer(null);
      }
      // Only reset play time if we haven't incremented yet
      if (!hasIncrementedPlay) {
        setPlayTime(0);
      }
    }
    
    setIsGamePlaying(prev => !prev);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      if (playTimer) {
        clearInterval(playTimer);
      }
    };
  }, []);

  // Update the loading and error states rendering
  if (!router.isReady || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lightGreen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-darkGreen border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-darkGreen">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-lightGreen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg text-darkGreen mb-6">{error}</p>
        <Link href="/" className="px-6 py-3 bg-darkGreen text-white rounded-lg hover:bg-accent transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-lightGreen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Game Not Found</h1>
        <p className="text-lg text-darkGreen mb-6">
          Sorry, we couldn't find this game.
        </p>
        <Link href="/" className="px-6 py-3 bg-darkGreen text-white rounded-lg hover:bg-accent transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center p-6 bg-gray-50 min-h-screen bg-lightGreen relative"
      >
        {/* Rotation Notice for Mobile */}
        {isMobile && showRotateNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4"
          >
            <div className="bg-darkGreen text-white p-6 rounded-xl shadow-2xl max-w-sm w-full flex flex-col items-center space-y-4">
              <MdScreenRotation className="text-4xl animate-spin-slow" />
              <p className="text-center text-base font-medium">
                Rotate your device for the best gaming experience!
              </p>
              <button 
                onClick={() => setShowRotateNotice(false)}
                className="mt-4 px-4 py-2 bg-white text-darkGreen rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium flex items-center space-x-2"
              >
                <span>Got it</span>
                <FaTimes className="text-sm" />
              </button>
            </div>
          </motion.div>
        )}

        {!isGamePlaying && (
          <>
            {/* Game Image - Only shown when not playing */}
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
            <div className="flex items-center justify-center mb-4 space-x-4 w-full">
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

            <p className="text-sm text-gray-500 mt-2">Total Plays: {totalPlays}</p>
          </>
        )}

        {/* Play Game / Exit Button - Always at the top */}
        <div className="w-full max-w-2xl mb-4">
          <button
            onClick={handlePlayOrExitGame}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-darkGreen text-white rounded-md hover:bg-secondary transition-all duration-300"
          >
            {isGamePlaying ? (
              <>
                <FaTimes className="w-5 h-5" />
                <span>Quit</span>
              </>
            ) : (
              <>
                <FaPlay className="w-5 h-5" />
                <span>Play</span>
              </>
            )}
          </button>
        </div>

        {isGamePlaying && (
          <>
            {/* Game Container */}
            <div id="game-container" className="w-full max-w-2xl mb-6">
              <div
                className="iframe-container"
                style={{
                  position: "relative",
                  paddingBottom: "96.25%",
                  paddingLeft: "150%",
                  height: 0,
                }}
              >
                <iframe
                  id="game-frame"
                  onLoad={handleIframeLoad}
                  src={game.link}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-15%",
                    right: 0,
                    height: "100%",
                    border: "none",
                    width: "100%",
                  }}
                  title={game.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Game Info Below Iframe */}
            <div className="w-full max-w-2xl mt-4 space-y-4">
              <h1 className="text-2xl font-bold text-gray-900 text-center">{game.title}</h1>
              
              <p className="text-sm text-gray-600 text-center">
                {game.description}
              </p>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleRating('like')}
                  className="flex flex-col items-center justify-center p-2 rounded-lg"
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    rating === 'like' 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-500"
                  }`}>
                    <FaThumbsUp className="w-4 h-4" />
                  </div>
                  <span className="text-xs mt-1">{likes}</span>
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
                    <FaThumbsDown className="w-4 h-4" />
                  </div>
                  <span className="text-xs mt-1">{dislikes}</span>
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">Total Plays: {totalPlays}</p>
            </div>
          </>
        )}

        <style jsx>{`
          .iframe-container {
            max-width: 150%;
            margin: 0 auto;
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }

          /* For mobile devices */
          @media (max-width: 640px) {
            .iframe-container {
              margin-top: 20px;
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
