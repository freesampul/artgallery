import { useState } from "react";
import { motion } from "framer-motion";

export default function Card({ imgSrc, title, description }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-[300px] h-[400px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full rounded-lg shadow-lg"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full bg-white rounded-lg shadow-lg backface-hidden">
          <img src={imgSrc} alt={title} className="w-full h-full object-cover rounded-lg" />
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full bg-white rounded-lg shadow-lg flex flex-col justify-center items-center p-4 rotate-y-180"
          style={{ backfaceVisibility: "hidden" }}
        >
          <h2 className="text-xl text-black font-semibold">{title}</h2>
          <p className="text-sm text-gray-500 text-center">{description}</p>
        </div>
      </motion.div>
    </div>
  );
}