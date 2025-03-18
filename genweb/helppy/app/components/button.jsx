'use client'; // Ensures it works as a Client Component in Next.js

export default function Button({ buttonText, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="px-4 py-2 bg-white text-gray-700 font-medium border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 active:bg-gray-200 transition duration-200"
    >
      {buttonText}
    </button>
  );
}