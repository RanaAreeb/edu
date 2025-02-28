import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check if user is logged in (by checking localStorage)
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  };

  // Set up effect to run on mount and listen for localStorage changes
  useEffect(() => {
    checkLoginStatus(); // Check login status on component mount

    // Listen for changes in localStorage (for dynamic updates across tabs)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener when the component is unmounted
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update logged-in state
    window.dispatchEvent(new Event("storage")); // Trigger storage event to sync across tabs
  };

  return (
    <header className="bg-darkGreen text-white p-4 shadow-md flex items-center justify-between">
      {/* Centered Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image src="/EFG_Games.jpg" alt="EFG Games Logo" width={100} height={100} />
        </Link>
      </div>

      {/* Right Section with Navigation */}
      <nav className="flex items-center space-x-4">
        {/* Show Sign In and Sign Up only if user is not logged in */}
        {!isLoggedIn ? (
          <>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition duration-300"
            >
              Sign Up
            </Link>
          </>
        ) : (
          // Show Logout if user is logged in
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition duration-300"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}