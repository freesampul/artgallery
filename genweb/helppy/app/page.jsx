'use client';
import { useState, useEffect } from "react";
import Textbox from "./components/textbox";
import Button from "./components/button";
import { submitText, snapPost, db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Card from "./components/card"; 
import Post from "./components/post";

export default function Home() {
  const [textboxValue, setTextboxValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent"); // Default: Most Recent

  const postsPerPage = 10;

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "userTexts"));
      let postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sorting Logic
      if (sortBy === "recent") {
        postsData.sort((a, b) => b.timestamp - a.timestamp); // Most Recent First
      } else if (sortBy === "snaps") {
        postsData.sort((a, b) => b.snaps - a.snaps); // Most Snapped First
      }

      setPosts(postsData);
    };

    fetchPosts();
  }, [sortBy]); // Re-run when sorting changes

  // Handle uploading text
  const handleUpload = async () => {
    if (!textboxValue.trim()) {
      alert("Text cannot be empty!");
      return;
    }

    const postId = await submitText(textboxValue);
    if (postId) {
      alert("Text uploaded successfully!");
      setTextboxValue(""); 
    }
  };

  // Handle snapping (liking)
  const [isUpdating, setIsUpdating] = useState(false); // Prevent spamming

  const handleSnap = async (postId) => {
    if (isUpdating) return; // Prevent multiple rapid clicks
    setIsUpdating(true);
  
    const result = await snapPost(postId);
  
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              snaps: result === "snapped" ? post.snaps + 1 : Math.max(post.snaps - 1, 0),
            }
          : post
      )
    );
  
    setTimeout(() => setIsUpdating(false), 500); // Small delay to prevent spamming
  };
  // Pagination Logic
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <Card imgSrc="" title="Next.js" description="The React Framework for Production" />
      <Textbox placeholderText="Enter your text..." onTextChange={setTextboxValue} />
      <Button buttonText="Upload" onClick={handleUpload} />

      {/* Sorting Buttons */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setSortBy("recent")}
          className={`px-4 py-2 rounded-md ${sortBy === "recent" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          New
        </button>
        <button
          onClick={() => setSortBy("snaps")}
          className={`px-4 py-2 rounded-md ${sortBy === "snaps" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
        >
          Top
        </button>
      </div>

      {/* Posts List */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {currentPosts.map((post) => (
          <Post key={post.id} post={post} onSnap={handleSnap} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex space-x-4 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}