import { useState } from "react";

export default function GameRating({ gameId, initialLikes, initialDislikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);

  const handleLike = () => {
    setLikes(likes + 1);
    // Call API to update rating in the database
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
    // Call API to update rating in the database
  };

  return (
    <div className="mt-4 flex items-center">
      <button onClick={handleLike} className="mr-4 text-green-500">
        👍🏾 Like {likes}
      </button>
      <button onClick={handleDislike} className="text-red-500">
        👎🏾 Dislike {dislikes}
      </button>
    </div>
  );
}
