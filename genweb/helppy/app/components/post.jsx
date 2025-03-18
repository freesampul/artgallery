//Takes in an individual post object, rendering the text and snap count to screen
//The componenet can handle real-time rerenders, instantly showing when a user snaps a post
//The list of post is mapped over in the componenet outside of this 

import { useRef } from "react";

export default function Post({ post, onSnap }) {
  const audioRef = useRef(null);

  const handleSnap = () => {
    onSnap(post.id);
    if (audioRef.current) {
      audioRef.current.play(); // Play snap sound on click
    }
  };

  return (
    <div className="flex flex-row justify-between items-center w-[500px] p-6 bg-white shadow-lg rounded-lg">
      {/* Post Text Section */}
      <p className="flex-grow text-lg text-gray-800">{post.text}</p>

      {/* Snap Button Section */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleSnap}
          className="text-3xl transition-transform duration-200 hover:rotate-12 active:scale-90"
        >
          🤌 {/* Snap hand emoji */}
        </button>
        <p className="text-sm text-gray-500">{post.snaps}</p>
      </div>

      {/* Hidden Audio for Snap Sound */}
      <audio ref={audioRef}>
        <source src="/snap.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}