import { useState } from "react";

export default function CommentSection({ gameId }) {
  const [comments, setComments] = useState([]); // Should fetch comments from DB
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    // Here you would send the comment to the backend
    const newCommentsList = [...comments, { user: "Anonymous", text: newComment }];
    setComments(newCommentsList);
    setNewComment("");
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold">Comments</h3>
      <div>
        {comments.map((comment, index) => (
          <div key={index} className="border-b py-2">
            <p className="font-semibold">{comment.user}</p>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded-md"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
}
