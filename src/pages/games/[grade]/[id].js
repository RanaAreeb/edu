// pages/game/[id].js

import { games } from "../../../data/games";
import { useRouter } from "next/router";

export default function GamePage() {
  const router = useRouter();
  const { id } = router.query;

  // Find the game by ID
  const game = games.find((game) => game.id === parseInt(id));

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold">{game.title}</h1>
      <p className="text-lg">{game.description}</p>
      <div className="mt-4">
        <p>Grade: {game.grade}</p>
        <p>Total Plays: {game.totalPlays}</p>
        {/* Add other game interaction components like comments or ratings here */}
      </div>
    </div>
  );
}
