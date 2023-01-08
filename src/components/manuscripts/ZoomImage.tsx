import { Box } from '@mui/material';
import React, { useRef, useMemo, useEffect, useState } from 'react';

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const DRAG_FACTOR = 3;

const ZoomImage = ({ image }) => {
  const [offset, setOffset] = useState({ x: 0, y: 300 });
  const [zoom, setZoom] = useState(0.3);
  const [dragging, setDragging] = useState(false);

  const touch = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);
  const background = useMemo(() => new Image(), [image]);

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const handleWheel = (event) => {
    const { deltaY } = event;
    if (!dragging) {
      setZoom((zoom) => {
        return clamp(zoom + deltaY * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM);
      });
    }
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const { x, y } = touch.current;
      const { clientX, clientY } = event;
      setOffset({
        x: offset.x + (x - clientX) * DRAG_FACTOR,
        y: offset.y + (y - clientY) * DRAG_FACTOR,
      });
      touch.current = { x: clientX, y: clientY };
    }
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    touch.current = { x: clientX, y: clientY };
    setDragging(true);
  };

  const handleMouseUp = () => setDragging(false);

  const draw = () => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      const context = canvasRef.current.getContext('2d');

      // Set canvas dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Clear canvas and scale it
      context.translate(-offset.x, -offset.y);
      context.scale(zoom, zoom);
      context.clearRect(0, 0, width, height);

      // Make sure we're zooming to the center
      const x = (context.canvas.width / zoom - background.width) / 2;
      const y = (context.canvas.height / zoom - background.height) / 2;

      // Draw image
      context.drawImage(background, x, y);
    }
  };

  useEffect(() => {
    observer.current = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        const { width, height } = background;
        // If width of the container is smaller than image, scale image down
        if (target.clientWidth < width && canvasRef.current) {
          // Calculate scale
          const scale = target.clientWidth / width;

          // Redraw image
          canvasRef.current.width = width * scale;
          canvasRef.current.height = height * scale;
          canvasRef.current.getContext('2d').drawImage(background, 0, 0, width * scale, height * scale);
        }
      });
    });
    if (observer.current && containerRef.current) {
      observer.current.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.current!.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!image) return;
    background.src = image;

    if (canvasRef.current) {
      background.onload = () => {
       setTimeout(()=>{ draw()}, 100)
      };
    }
  }, [background]);

  useEffect(() => {
    draw();
  }, [zoom, offset]);

  return (
    <Box
      sx={{
        height: 'auto',
        width: '100%',
        overflow: 'hidden',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      ref={containerRef}>
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
      />
    </Box>
  );
};

export default ZoomImage;