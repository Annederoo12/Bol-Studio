/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";
import { ChevronsLeftRightIcon } from "../icons";
 
interface CompareProps {
  firstImage: string;
  secondImage: string;
  className?: string;
}

export const Compare = ({
  firstImage,
  secondImage,
  className,
}: CompareProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const afterImageContainerRef = useRef<HTMLDivElement>(null);
  const afterImageRef = useRef<HTMLImageElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // This function moves the slider to a specific horizontal coordinate
  const moveSlider = useCallback((x: number) => {
    const container = containerRef.current;
    if (!container || !afterImageContainerRef.current || !handleRef.current) return;

    const rect = container.getBoundingClientRect();
    let newX = x - rect.left;

    // Clamp the value between 0 and container width
    if (newX < 0) newX = 0;
    if (newX > rect.width) newX = rect.width;

    const percent = (newX / rect.width) * 100;
    
    afterImageContainerRef.current.style.width = `${percent}%`;
    handleRef.current.style.left = `${percent}%`;
    handleRef.current.setAttribute('aria-valuenow', String(Math.round(percent)));
  }, []);
  
  // Effect for all event listeners (drag, touch, keyboard)
  useEffect(() => {
    const container = containerRef.current;
    const handle = handleRef.current;
    if (!container || !handle) return;
    
    // Set initial position to 50%
    const initialX = container.offsetWidth * 0.5;
    moveSlider(container.getBoundingClientRect().left + initialX);

    let isDragging = false;

    const onDragStart = (clientX: number) => {
        isDragging = true;
        moveSlider(clientX); // Move on initial click/touch
    };

    const onDragMove = (clientX: number) => {
        if (isDragging) {
            moveSlider(clientX);
        }
    };

    const onDragEnd = () => {
        isDragging = false;
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        onDragStart(e.clientX);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };
    const handleMouseMove = (e: MouseEvent) => onDragMove(e.clientX);
    const handleMouseUp = () => {
        onDragEnd();
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
            onDragStart(e.touches[0].clientX);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleTouchEnd);
        }
    };
    const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) onDragMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
        onDragEnd();
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    };

    // Keyboard accessibility
    const handleKeyDown = (e: KeyboardEvent) => {
        const afterImageContainer = afterImageContainerRef.current;
        if (!afterImageContainer) return;

        const currentWidthPercent = parseFloat(afterImageContainer.style.width || '50');
        let newWidthPercent = currentWidthPercent;
        
        if (e.key === 'ArrowLeft') {
            newWidthPercent = Math.max(0, currentWidthPercent - 2); // Move left by 2%
        } else if (e.key === 'ArrowRight') {
            newWidthPercent = Math.min(100, currentWidthPercent + 2); // Move right by 2%
        }

        if (newWidthPercent !== currentWidthPercent) {
            e.preventDefault();
            const containerRect = container.getBoundingClientRect();
            const newX = (containerRect.width * newWidthPercent) / 100;
            moveSlider(containerRect.left + newX);
        }
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    handle.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      handle.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [moveSlider]);
  
  // This effect uses a ResizeObserver to ensure the "after" image, which sits inside
  // a clipped container, is always sized correctly relative to the main container.
  // This is key to preventing misalignment when the window is resized.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new ResizeObserver(() => {
        if (containerRef.current && afterImageRef.current) {
            afterImageRef.current.style.width = `${containerRef.current.offsetWidth}px`;
        }
    });
    observer.observe(container);
    
    return () => observer.disconnect();
}, []);

  return (
    <div
      ref={containerRef}
      id="image-comparison-container"
      className={cn("relative w-full aspect-square overflow-hidden select-none group cursor-ew-resize", className)}
      style={{ WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}}
    >
      {/* "Before" Image (bottom layer) */}
      <img
        src={secondImage}
        alt="Generated lifestyle scene of product"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      
      {/* "After" Image Container (clipped by width) */}
      <div ref={afterImageContainerRef} className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none">
        {/* The actual "After" image, sized to the main container */}
        <img
          ref={afterImageRef}
          src={firstImage}
          alt="Original product on plain background"
          className="absolute top-0 left-0 h-full object-cover pointer-events-none max-w-none"
          draggable={false}
        />
      </div>
      
      {/* Draggable Handle */}
      <div
        ref={handleRef}
        className="absolute top-0 h-full w-1 bg-white/70 cursor-ew-resize transform -translate-x-1/2 flex items-center justify-center shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50} // This will be updated by JS
        aria-label="Image comparison slider"
        aria-controls="image-comparison-container"
      >
        <div className="w-11 h-11 rounded-full bg-white/80 border-2 border-white/90 shadow-lg flex items-center justify-center">
            <ChevronsLeftRightIcon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );
};