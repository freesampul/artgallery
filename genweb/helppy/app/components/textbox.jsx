'use client'; // Needed for Next.js App Router
import { useState, useRef } from "react";

export default function Textbox({ placeholderText, maxChars = 400, onTextChange }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText); // Store text in state
    onTextChange(newText); // Send text to parent
    
    // Resize dynamically
    const textArea = textareaRef.current;
    textArea.style.height = "30px"; // Reset height to prevent overflow issues
    textArea.style.height = `${Math.min(textArea.scrollHeight, 450)}px`; // Expand but cap at 450px
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[200px] space-y-2">
      <textarea
        ref={textareaRef}
        placeholder={placeholderText}
        value={text} // Controlled input
        onChange={handleChange}
        maxLength={maxChars}
        className="w-[400px] min-h-[60px] max-h-[450px] text-lg p-4 border-2 border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-blue-500 transition-all duration-200 resize-none overflow-hidden"
      />
      <p className="text-sm text-gray-500">{text.length}/{maxChars} characters</p>
    </div>
  );
}