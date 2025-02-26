import { useRouter } from "next/router";
import { games } from "../../data/games"; // Import the games data
import GameCard from "../../components/GameCard";
import Link from "next/link";
import Image from "next/image";
export default function GradePage() {
  const router = useRouter();
  const { grade } = router.query;

  // Filter games based on the grade
  const filteredGames = games.filter((game) => game.grade === grade);

  console.log(filteredGames); // Log to check if games are being filtered correctly

  return (
    <div className="flex flex-col min-h-screen bg-lightGreen">
      {/* Header Section */}
      <header className="text-center p-6 md:p-10 bg-gradient-to-r  bg-lightGreen text-white">
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <Image
              src="/EFG_Games.jpg" // Logo path
              alt="EFG Games Logo"
              width={180}  // Adjust logo size
              height={180}
              className="rounded-full"
            />
          </Link>
          <p className="text-1xl font-bold ">Play and Learn Your Way</p>
        </div>
      </header>
      <header className="text-center p-6 md:p-10 bg-lightGreen text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{grade} Grade Games</h1>
        <p className="text-base md:text-xl">
          Explore all the {grade} games and have fun while learning!
        </p>
      </header>

      {/* Games Grid Section */}
      <div className="flex justify-center items-center p-4 md:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => <GameCard key={game.id} game={game} />)
          ) : (
            <p className="text-center text-lg  text-white">Comming Soon!</p>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-darkGreen text-white text-center py-4 mt-auto">
        <p className="text-sm md:text-lg">© 2025 EFG Games. All rights reserved.</p>
      </footer>
    </div>
  );
}