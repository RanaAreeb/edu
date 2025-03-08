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

  const [startTime, setStartTime] = useState(null);
  const [gameSession, setGameSession] = useState(null);

  const [isProcessingRating, setIsProcessingRating] = useState(false);

  // Update the style objects at the top of the component
  const ratingButtonStyles = {
    button: `flex flex-col items-center justify-center p-2 rounded-lg ${isProcessingRating ? 'opacity-50 cursor-not-allowed' : ''}`,
    iconContainer: (isActive, type) => `
      p-2 rounded-lg transition-all duration-300 transform
      ${isActive 
        ? `${type === 'like' 
            ? "bg-green-500 text-white shadow-lg scale-110" 
            : "bg-red-500 text-white shadow-lg scale-110"}`
        : `bg-gray-100 text-gray-700 ${type === 'like' 
            ? "hover:bg-green-100 hover:text-green-500" 
            : "hover:bg-red-100 hover:text-red-500"}`
      }
      ${isProcessingRating ? 'cursor-not-allowed' : ''}
    `,
    count: `text-sm mt-1`
  };

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

  // Load user's previous rating from localStorage
  useEffect(() => {
    if (router.isReady && grade && id) {
      const storedRating = localStorage.getItem(`game-rating-${grade}-${id}`);
      if (storedRating) {
        setRating(storedRating);
      }
    }
  }, [router.isReady, grade, id]);

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
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;

      // Clear any existing rating from localStorage when fetching new data
      localStorage.removeItem(`game-rating-${grade}-${id}`);
      setRating(null);

      const response = await fetch(`/api/games/${grade}/${id}${userId ? `?userId=${userId}` : ''}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      console.log('Fetched game data:', data); // Debug log

      if (data.game) {
        setGame(prevGame => ({
          ...prevGame,
          ...data.game
        }));
        setLikes(data.game.likes || 0);
        setDislikes(data.game.dislikes || 0);
        
        // Set total plays from the game data
        setTotalPlays(data.game.totalPlays || 0);
        
        // Only set rating if we have both a user and a rating from the database
        if (userId && data.userRating) {
          setRating(data.userRating);
          localStorage.setItem(`game-rating-${grade}-${id}`, data.userRating);
        }
      }
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

      console.log('Play count response:', data); // Debug log

      // Update both game data and total plays
      if (data.game) {
        setGame(prevGame => ({
          ...prevGame,
          ...data.game
        }));
      }
      
      // Explicitly update total plays from the response
      if (typeof data.totalPlays === 'number') {
        console.log('Updating total plays to:', data.totalPlays); // Debug log
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
            console.log('Triggering play count increment'); // Debug log
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
  }, [isGamePlaying, hasIncrementedPlay, grade, id]); // Added grade and id to dependencies

  // Handle rating update
  const handleRating = async (action) => {
    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        alert('Please log in to rate the game');
        return;
      }

      // Don't do anything if we're already processing a rating
      if (isProcessingRating) return;
      setIsProcessingRating(true);

      const response = await fetch(`/api/games/${grade}/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: rating === action ? 'remove' : action,
          userId: user._id
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update rating');
      }

      const data = await response.json();
      
      // Update the state with the server response
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setRating(data.userRating);

      // Update localStorage with the new rating
      if (data.userRating) {
        localStorage.setItem(`game-rating-${grade}-${id}`, data.userRating);
      } else {
        localStorage.removeItem(`game-rating-${grade}-${id}`);
      }

    } catch (error) {
      console.error('Error updating rating:', error);
      alert('Failed to update rating. Please try again.');
    } finally {
      setIsProcessingRating(false);
    }
  };

  // Add new function to validate user's current rating
  const validateUserRating = async (userId) => {
    try {
      const response = await fetch(`/api/games/${grade}/${id}/rating?userId=${userId}`);
      const data = await response.json();
      return data.rating || null;
    } catch (error) {
      console.error('Error validating user rating:', error);
      return null;
    }
  };

  // Add effect to clear rating when user changes
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        // Clear rating when user logs out
        setRating(null);
        localStorage.removeItem(`game-rating-${grade}-${id}`);
      } else {
        // Refresh game data when user logs in
        fetchGameData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [grade, id]);

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
      setStartTime(new Date());
      setPlayTime(0);
      setHasIncrementedPlay(false);
    } else {
      // Quitting the game
      if (playTimer) {
        clearInterval(playTimer);
        setPlayTimer(null);
      }
      // Track the game session when quitting
      if (startTime) {
        trackGameSession().catch(error => {
          console.error('Failed to track game session:', error);
          // Don't show error to user, just log it
        });
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

  // Update the trackGameSession function with better error handling
  const trackGameSession = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        console.log('No user found, skipping session tracking');
        return;
      }

      if (!startTime) {
        console.log('No start time recorded, skipping session tracking');
        return;
      }

      const endTime = new Date();
      const sessionData = {
        studentId: user._id,
        gameId: game.id,
        gameTitle: game.title,
        gameType: game.type || 'educational',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        score: 0,
        skillsGained: ['problem-solving']
      };

      const response = await fetch('/api/students/track-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to track game session');
      }

      const data = await response.json();
      console.log('Game session tracked:', data);
      setGameSession(data.session);
    } catch (error) {
      console.error('Error tracking game session:', error);
      // Don't throw the error, just log it
      // This prevents the unhandled runtime error from appearing to the user
    }
  };

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
                className={ratingButtonStyles.button}
              >
                <div className={ratingButtonStyles.iconContainer(rating === 'like', 'like')}>
                  <FaThumbsUp className="w-6 h-6" />
                </div>
                <span className={ratingButtonStyles.count}>{likes}</span>
              </button>
              <button
                onClick={() => handleRating('dislike')}
                className={ratingButtonStyles.button}
              >
                <div className={ratingButtonStyles.iconContainer(rating === 'dislike', 'dislike')}>
                  <FaThumbsDown className="w-6 h-6" />
                </div>
                <span className={ratingButtonStyles.count}>{dislikes}</span>
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
                  className={ratingButtonStyles.button}
                >
                  <div className={ratingButtonStyles.iconContainer(rating === 'like', 'like')}>
                    <FaThumbsUp className="w-4 h-4" />
                  </div>
                  <span className={ratingButtonStyles.count}>{likes}</span>
                </button>
                <button
                  onClick={() => handleRating('dislike')}
                  className={ratingButtonStyles.button}
                >
                  <div className={ratingButtonStyles.iconContainer(rating === 'dislike', 'dislike')}>
                    <FaThumbsDown className="w-4 h-4" />
                  </div>
                  <span className={ratingButtonStyles.count}>{dislikes}</span>
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
<footer className="bg-darkGreen text-white py-4">
  <div className="container mx-auto px-4">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
      {/* Left Section - Logo and Social Media */}
      <div className="flex flex-col items-center md:items-start">
        <Image
          src="/EFG_Games.jpg"
          alt="EFG Games Logo"
          width={120}
          height={120}
          className="rounded-full mb-4"
        />
        {/* Social Media Icons */}
        <div className="flex space-x-12">
          <a href="https://www.facebook.com/profile.php?id=61559394101077&sk=about" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
          <a href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
        </div>
      </div>

      {/* Right Section - Legal Links */}
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-2 gap-y-2 text-3xs">
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
          <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
            Partnership
          </a>
        </Link>
      </div>
    </div>

    {/* Copyright Text - At the very bottom */}
    <div className="border-t border-gray-600 mt-4 pt-4">
      <p className="text-[14px] text-center text-gray-400">
        © Copyright 2025 EFG Games, a division of Konduct Coach Learning. All Rights Reserved
      </p>
    </div>
  </div>
</footer>
    </>
  );
}
