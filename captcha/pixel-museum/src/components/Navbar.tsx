'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Palette, ImageIcon, Trophy, Menu, X, Heart } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gallery-white/95 backdrop-blur-xl border-b border-gallery-light sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-4 hover:opacity-80 transition-all duration-300">
            <img 
              src="/logo.png" 
              alt="Digital Junk Logo" 
              className="h-8 w-8 sm:h-12 sm:w-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="gallery-title text-lg sm:text-2xl text-gallery-charcoal">
                Digital Junk
              </span>

            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2 gallery-body text-gallery-dark hover:text-gallery-charcoal px-3 lg:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gallery-light/50"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Gallery</span>
            </Link>
            <Link 
              href="/today" 
              className="flex items-center space-x-2 gallery-body text-gallery-dark hover:text-gallery-charcoal px-3 lg:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gallery-light/50"
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden lg:inline">Fresh Garbage</span>
              <span className="lg:hidden">Today</span>
            </Link>
            <Link 
              href="/patreons" 
              className="flex items-center space-x-2 gallery-body text-gallery-dark hover:text-gallery-charcoal px-3 lg:px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gallery-light/50"
            >
              <Heart className="h-4 w-4" />
              <span className="hidden lg:inline">Trash Patrons</span>
              <span className="lg:hidden">Patrons</span>
            </Link>
            <Link 
              href="/submission" 
              className="flex items-center space-x-2 bg-gallery-charcoal text-gallery-white px-3 lg:px-6 py-3 rounded-xl hover:bg-gallery-black transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                          >
                <Palette className="h-4 w-4" />
                <span>Dump Junk</span>
              </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gallery-dark hover:bg-gallery-light/50 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gallery-light bg-gallery-white/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="flex items-center space-x-3 gallery-body text-gallery-dark hover:text-gallery-charcoal hover:bg-gallery-light/50 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <ImageIcon className="h-5 w-5" />
                <span>Gallery</span>
              </Link>
              <Link 
                href="/today" 
                className="flex items-center space-x-3 gallery-body text-gallery-dark hover:text-gallery-charcoal hover:bg-gallery-light/50 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <Trophy className="h-5 w-5" />
                <span>Today's Competition</span>
              </Link>
              <Link 
                href="/patreons" 
                className="flex items-center space-x-3 gallery-body text-gallery-dark hover:text-gallery-charcoal hover:bg-gallery-light/50 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-5 w-5" />
                <span>Trash Patrons</span>
              </Link>
              <Link 
                href="/submission" 
                className="flex items-center space-x-3 bg-gallery-charcoal text-gallery-white hover:bg-gallery-black px-3 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 mt-2"
                onClick={() => setIsOpen(false)}
                              >
                  <Palette className="h-5 w-5" />
                  <span>Dump Junk</span>
                </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 