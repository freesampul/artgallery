'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Palette, Eraser, Download, RotateCcw, Paintbrush } from 'lucide-react';

interface PixelArtEditorProps {
  onArtworkChange?: (imageData: string) => void;
}

const GRID_SIZE = 32;
const PIXEL_SIZE = 16; // Increased for higher resolution output

const DEFAULT_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
  '#808080', '#C0C0C0', '#800000', '#008000'
];

export default function PixelArtEditor({ onArtworkChange }: PixelArtEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'bucket'>('brush');
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#FFFFFF'))
  );

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pixels
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        ctx.fillStyle = grid[row][col];
        ctx.fillRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        
        // Draw grid lines
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }, [grid]);

  useEffect(() => {
    drawGrid();
    
    // Generate clean image data without grid lines for parent component
    if (onArtworkChange) {
      // Create a temporary canvas without grid lines for clean artwork data
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = GRID_SIZE * PIXEL_SIZE;
      tempCanvas.height = GRID_SIZE * PIXEL_SIZE;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx) {
        // Enable image smoothing for better quality
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';

        // Clear canvas (transparent background)
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw only the pixels (no grid lines)
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const color = grid[row][col];
            // Only draw non-white pixels (white = transparent)
            if (color !== '#FFFFFF') {
              tempCtx.fillStyle = color;
              tempCtx.fillRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
            }
          }
        }

        const cleanImageData = tempCanvas.toDataURL('image/png');
        onArtworkChange(cleanImageData);
      }
    }
  }, [grid, drawGrid, onArtworkChange]);

  const getPixelPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Account for canvas scaling - convert from display coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    const col = Math.floor(canvasX / PIXEL_SIZE);
    const row = Math.floor(canvasY / PIXEL_SIZE);
    
    if (col >= 0 && col < GRID_SIZE && row >= 0 && row < GRID_SIZE) {
      return { row, col };
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'bucket') {
      handleDraw(e);
      return;
    }
    setIsDrawing(true);
    handleDraw(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    handleDraw(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const floodFill = (startRow: number, startCol: number, newColor: string) => {
    const targetColor = grid[startRow][startCol];
    if (targetColor === newColor) return;
    
    const newGrid = grid.map(row => [...row]);
    const stack = [[startRow, startCol]];
    
    while (stack.length > 0) {
      const [row, col] = stack.pop()!;
      
      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) continue;
      if (newGrid[row][col] !== targetColor) continue;
      
      newGrid[row][col] = newColor;
      
      // Add adjacent cells to stack
      stack.push([row + 1, col], [row - 1, col], [row, col + 1], [row, col - 1]);
    }
    
    setGrid(newGrid);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPixelPosition(e);
    if (!pos) return;

    if (tool === 'bucket') {
      const color = currentColor;
      floodFill(pos.row, pos.col, color);
      return;
    }

    const newGrid = [...grid];
    const color = tool === 'eraser' ? '#FFFFFF' : currentColor;
    
    if (newGrid[pos.row][pos.col] !== color) {
      newGrid[pos.row][pos.col] = color;
      setGrid(newGrid);
    }
  };

  const clearCanvas = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#FFFFFF')));
  };

  const downloadArtwork = () => {
    // Create a temporary canvas without grid lines for clean download
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = GRID_SIZE * PIXEL_SIZE;
    tempCanvas.height = GRID_SIZE * PIXEL_SIZE;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return;

    // Enable image smoothing for better quality when scaled
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';

    // Clear canvas (transparent background)
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw only the pixels (no grid lines)
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const color = grid[row][col];
        // Only draw non-white pixels (white = transparent)
        if (color !== '#FFFFFF') {
          tempCtx.fillStyle = color;
          tempCtx.fillRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
      }
    }

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Tools */}
      <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-pixel-200/30">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center justify-center sm:justify-start">
            🛠️ Tools
          </h3>
          
          <div className="grid grid-cols-3 gap-2 sm:flex sm:space-x-3">
            <button
              onClick={() => setTool('brush')}
              className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm ${
                tool === 'brush' 
                  ? 'bg-gradient-to-r from-pixel-500 to-museum-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">Brush</span>
            </button>
            
            <button
              onClick={() => setTool('bucket')}
              className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm ${
                tool === 'bucket' 
                  ? 'bg-gradient-to-r from-pixel-500 to-museum-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Paintbrush className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">Bucket</span>
            </button>
            
            <button
              onClick={() => setTool('eraser')}
              className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm ${
                tool === 'eraser' 
                  ? 'bg-gradient-to-r from-pixel-500 to-museum-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eraser className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">Eraser</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:space-x-3">
            <button
              onClick={clearCanvas}
              className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg sm:rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">Clear All</span>
            </button>
            
            <button
              onClick={downloadArtwork}
              className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium">Save PNG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-pixel-200/30">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
          🎨 Color Picker
        </h3>
        
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Current:</span>
              <div 
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-2 sm:border-3 border-white shadow-lg ring-1 sm:ring-2 ring-pixel-300"
                style={{ backgroundColor: currentColor }}
              />
              <span className="text-xs sm:text-sm font-mono bg-gray-200 px-1 sm:px-2 py-1 rounded text-gray-700">{currentColor}</span>
            </div>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-0 cursor-pointer shadow-lg"
              title="Pick color"
            />
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-pixel-200/30">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-center sm:justify-start mb-3 sm:mb-4">
          🖼️ Pixel Canvas
        </h3>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <canvas
                ref={canvasRef}
                width={GRID_SIZE * PIXEL_SIZE}
                height={GRID_SIZE * PIXEL_SIZE}
                className="border-2 border-pixel-300 cursor-crosshair rounded-lg shadow-lg w-full h-full object-contain"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  handleMouseDown(mouseEvent as any);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  handleMouseMove(mouseEvent as any);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleMouseUp();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 