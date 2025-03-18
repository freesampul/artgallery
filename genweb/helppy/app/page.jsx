'use client';
import { useState, useEffect } from "react";
import Textbox from "./components/textbox";
import Button from "./components/button";
import { submitText, snapPost, db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [textboxValue, setTextboxValue] = useState("");
  const [posts, setPosts] = useState([]);

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "userTexts"));
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  // Handle uploading text
  const handleUpload = async () => {
    if (!textboxValue.trim()) {
      alert("Text cannot be empty!");
      return;
    }

    const postId = await submitText(textboxValue);
    if (postId) {
      alert("Text uploaded successfully!");
      setTextboxValue(""); // Clear input after upload
    }
  };

  // Handle snapping (liking)
  const handleSnap = async (postId) => {
    const success = await snapPost(postId);
    if (success) {
      alert("You snapped this post!");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <Textbox placeholderText="Enter your text..." onTextChange={setTextboxValue} />
      <Button buttonText="Upload" onClick={handleUpload} />

      <div className="w-full max-w-md mt-6 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg shadow-md bg-white">
            <p className="text-gray-800">{post.text}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500">Snaps: {post.snaps}</span>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => handleSnap(post.id)}
              >
                Snap 🔥
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}