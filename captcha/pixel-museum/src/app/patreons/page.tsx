'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import VisitorTracker from '@/components/VisitorTracker';

// Placeholder patron portrait slots
const patronSlots = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  isEmpty: true
}));

export default function PatreonsWing() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)' }}>
      <Navbar />
      
      {/* Intentionally terrible 2000s design */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with terrible styling */}
        <div className="text-center mb-8 p-6 border-8 border-dashed border-red-500" style={{ backgroundColor: '#ffff00' }}>
          <h1 className="text-6xl font-black mb-4 animate-bounce" style={{ 
            fontFamily: 'Comic Sans MS, cursive', 
            color: '#ff0080',
            textShadow: '4px 4px 0px #00ff00, 8px 8px 0px #0000ff',
            transform: 'rotate(-2deg)'
          }}>
            🗑️ PATREONS DUMPSTER 🗑️
          </h1>
          
          <div className="text-2xl font-bold mb-6 overflow-hidden whitespace-nowrap" style={{ color: '#8A2BE2' }}>
            <div className="animate-marquee inline-block">
              ✨ WELCOME TO OUR AMAZING TRASH PATRONS! ✨
            </div>
          </div>
          
          <div className="bg-lime-400 border-4 border-purple-600 p-4 mb-6 transform -rotate-1">
            <p className="text-2xl font-bold text-center" style={{ 
              fontFamily: 'Comic Sans MS, cursive',
              color: '#ff1493'
            }}>
              thanking all those who contribute with a handcrafted portrait.
            </p>
          </div>
        </div>

        {/* Terrible donation button */}
        <div className="text-center mb-8">
          <a 
            href="https://buymeacoffee.com/sampul" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="text-3xl font-black px-8 py-4 animate-pulse hover:animate-spin border-4 border-yellow-400 shadow-2xl transform hover:scale-110 transition-all duration-200" style={{
              background: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)',
              color: '#ffffff',
              fontFamily: 'Comic Sans MS, cursive',
              borderRadius: '20px',
              textShadow: '2px 2px 0px #000000'
            }}>
              💰 DONATE NOW!!! 💰
              <br />
              <span className="text-lg">Click here to give us money!</span>
            </button>
          </a>
        </div>

        {/* Terrible patron portraits grid */}
        <div className="bg-pink-300 border-8 border-orange-500 p-6" style={{ borderStyle: 'ridge' }}>
          <h2 className="text-4xl font-black text-center mb-6 animate-bounce" style={{
            fontFamily: 'Comic Sans MS, cursive',
            color: '#8B0000',
            textDecoration: 'underline',
            textShadow: '3px 3px 0px #FFFF00'
          }}>
            🌟 OUR AWESOME PATRONS! 🌟
          </h2>
          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {patronSlots.map((slot) => (
              <div 
                key={slot.id}
                className="aspect-square border-4 border-blue-600 bg-cyan-200 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300"
                style={{ borderStyle: 'dotted' }}
              >
                {slot.isEmpty ? (
                  <div className="text-center p-2">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-xs font-bold" style={{ 
                      fontFamily: 'Comic Sans MS, cursive',
                      color: '#800080'
                    }}>
                      YOUR PORTRAIT HERE!
                    </p>
                  </div>
                ) : (
                  <img 
                    src={`/patron-${slot.id}.jpg`} 
                    alt={`Patron ${slot.id}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Terrible footer text */}
          <div className="mt-8 text-center">
            <div className="text-xl font-bold mb-4 overflow-hidden whitespace-nowrap" style={{ color: '#FF4500' }}>
              <div className="animate-marquee-reverse inline-block">
                🎪 Thank you for supporting our digital junk pile! 🎪
              </div>
            </div>
            
            <div className="bg-yellow-300 border-4 border-red-600 p-4 inline-block transform rotate-1">
              <p className="text-lg font-black" style={{ 
                fontFamily: 'Comic Sans MS, cursive',
                color: '#4B0082'
              }}>
                Each donation gets you a CUSTOM HANDCRAFTED PORTRAIT! 
                <br />
                Made with LOVE and MS Paint! 💕
              </p>
            </div>
          </div>
        </div>

        {/* Web 1.0 visitor counter aesthetic */}
        <div className="mt-8 text-center">
          <div className="bg-black text-lime-400 p-2 inline-block border-2 border-lime-400 font-mono">
            <VisitorTracker 
              showCount={true}
              className=""
              style={{}}
            />
          </div>
        </div>
      </main>
    </div>
  );
} 