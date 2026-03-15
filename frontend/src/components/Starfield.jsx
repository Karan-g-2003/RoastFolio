import React, { useEffect, useRef } from "react";

const STAR_COUNT = 180;
const LAYER_COUNTS = [90, 60, 30]; // Layer 1, Layer 2, Layer 3
const LAYER_SPEEDS = [0.15, 0.35, 0.7];
const LAYER_RADII = [0.4, 0.8, 1.4];
const LAYER_OPACITIES = [0.4, 0.6, 1.0];
const LAYER_PARALLAX = [0.02, 0.04, 0.06]; // 2%, 4%, 6%
const COLORS = [
  { p: 0.7, c: "#ffffff" }, // 70% white
  { p: 0.9, c: "#00ffff" }, // 20% cyan (up to 90%)
  { p: 1.0, c: "#00ff41" }  // 10% green (up to 100%)
];

// Data layout per star: [x, y, z/layerIndex, radius, speed, baseOpacity, colorIndex, phase]
const ATTRIBUTES_PER_STAR = 8;
const X_IDX = 0;
const Y_IDX = 1;
const Z_IDX = 2;
const RAD_IDX = 3;
const SPEED_IDX = 4;
const OPACITY_IDX = 5;
const COLOR_IDX = 6;
const PHASE_IDX = 7;

export default function Starfield() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Mouse position for parallax
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  // Target mouse position for smooth interpolation (optional, using direct offset here but clamped/smoothed if needed)
  const targetX = useRef(0);
  const targetY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // The flat array to hold star data
    const stars = new Float32Array(STAR_COUNT * ATTRIBUTES_PER_STAR);

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      let starIdx = 0;
      for (let layer = 0; layer < 3; layer++) {
        const count = LAYER_COUNTS[layer];
        for (let i = 0; i < count; i++) {
          const offset = starIdx * ATTRIBUTES_PER_STAR;
          stars[offset + X_IDX] = Math.random() * width;
          stars[offset + Y_IDX] = Math.random() * height;
          stars[offset + Z_IDX] = layer;
          stars[offset + RAD_IDX] = LAYER_RADII[layer];
          stars[offset + SPEED_IDX] = LAYER_SPEEDS[layer];
          stars[offset + OPACITY_IDX] = LAYER_OPACITIES[layer];
          
          // Determine color based on probability
          const randColor = Math.random();
          let colorIdx = 0;
          if (randColor > 0.9) colorIdx = 2; // Green
          else if (randColor > 0.7) colorIdx = 1; // Cyan
          stars[offset + COLOR_IDX] = colorIdx;
          
          stars[offset + PHASE_IDX] = Math.random() * Math.PI * 2;
          
          starIdx++;
        }
      }
    };

    initStars();

    const handleResize = () => {
      initStars();
    };

    const handleMouseMove = (e) => {
      // Calculate offset from center (-1 to 1)
      targetX.current = (e.clientX - width / 2);
      targetY.current = (e.clientY - height / 2);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      // Smooth mouse movement for parallax
      mouseX.current += (targetX.current - mouseX.current) * 0.1;
      mouseY.current += (targetY.current - mouseY.current) * 0.1;

      // Clear canvas with black
      ctx.fillStyle = "#0a0a0a"; // cyber-black
      ctx.fillRect(0, 0, width, height);

      const now = Date.now();

      // We group rendering by color to minimize context state changes
      // 0: white, 1: cyan, 2: green
      
      for (let c = 0; c < 3; c++) {
        const hexColor = c === 0 ? "255, 255, 255" : c === 1 ? "0, 255, 255" : "0, 255, 65";
        
        ctx.beginPath();
        for (let i = 0; i < STAR_COUNT; i++) {
          const offset = i * ATTRIBUTES_PER_STAR;
          if (stars[offset + COLOR_IDX] !== c) continue;

          const layer = stars[offset + Z_IDX];
          const speed = stars[offset + SPEED_IDX];
          const phase = stars[offset + PHASE_IDX];
          const baseOpacity = stars[offset + OPACITY_IDX];
          const radius = stars[offset + RAD_IDX];

          // Update position (move right to left)
          stars[offset + X_IDX] -= speed;
          
          // Wrap around
          if (stars[offset + X_IDX] < -radius * 2) {
            stars[offset + X_IDX] = width + radius * 2;
            stars[offset + Y_IDX] = Math.random() * height; // Random Y when wrapping
          }

          // Twinkle: opacity oscillates using Math.sin(Date.now() * speed + phase)
          // Adjust so twinkle effect doesn't completely hide the star unless desired.
          // Sine gives -1 to 1, we want mostly positive opacity, slightly diminished.
          const twinkle = Math.sin(now * 0.001 * speed * 10 + phase); // speed scaling
          // Map twinkle from [-1, 1] to [0.2, 1.0] modifier
          const twinkleMod = 0.6 + 0.4 * twinkle;
          const currentOpacity = baseOpacity * twinkleMod;

          // Parallax calculation
          const pFactor = LAYER_PARALLAX[layer];
          // Opposite direction of cursor:
          const px = stars[offset + X_IDX] - mouseX.current * pFactor;
          let py = stars[offset + Y_IDX] - mouseY.current * pFactor;
          
          // Handle vertical wrapping over parallax (if parallax pushes off screen)
          if (py < -radius * 2) py += height + radius * 4;
          if (py > height + radius * 2) py -= height + radius * 4;

          // Instead of drawing paths with fillStyle changes, 
          // unfortunately fillStyle is slow if changed per star.
          // But since opacity fluctuates per star, we can use globalAlpha, 
          // or fillRect with rgba. 
          // Actually, drawing circles via arc is slow. fillRect is faster for small dots.
          
          // Fill style per star (could be optimized, but with 180 stars it's fine)
          ctx.fillStyle = `rgba(${hexColor}, ${currentOpacity.toFixed(2)})`;
          
          if (radius <= 0.8) {
            // Very small stars, rect is way faster
            ctx.fillRect(px, py, radius * 2, radius * 2);
          } else {
            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        backgroundColor: "#0a0a0a"
      }}
    />
  );
}
