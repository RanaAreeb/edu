import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Function to check if user is logged in
  const checkLoginStatus = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  };

  // Set up effect to run on mount and listen for auth changes
  useEffect(() => {
    setMounted(true);
    checkLoginStatus();

    // Listen for auth state changes
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkLoginStatus();
      }
    };

    // Listen for custom auth event
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountType");
    setIsLoggedIn(false);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new Event('authChange'));
    
    // Redirect to home page
    router.push('/');
  };

  // Don't render anything until after mount to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

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