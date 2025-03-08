import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState(null);

  // Check auth state on mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      const storedAccountType = localStorage.getItem('accountType');
      setIsAuthenticated(!!user);
      setAccountType(storedAccountType);
    };

    // Check immediately
    checkAuth();

    // Listen for route changes
    router.events.on('routeChangeComplete', checkAuth);

    // Listen for storage changes (in case of sign out in another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      router.events.off('routeChangeComplete', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accountType');
    setIsAuthenticated(false);
    setAccountType(null);
    router.push('/');
  };

  // Don't show navigation on dashboard
  if (router.pathname === '/dashboard') {
    return null;
  }

  return (
    <header className="bg-darkGreen text-white p-4 shadow-md flex items-center justify-between">
      {/* Centered Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image src="/EFG_Games.jpg" alt="EFG Games Logo" width={100} height={100} className="rounded-full" />
        </Link>
      </div>

      {/* Right Section with Navigation */}
      <nav className="flex items-center space-x-4">
        {!isAuthenticated ? (
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
          <div className="flex items-center space-x-4">
            {(accountType === 'parent' || accountType === 'institution') && (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-white hover:text-accent transition duration-300"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}