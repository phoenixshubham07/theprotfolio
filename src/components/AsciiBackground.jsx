import { useEffect, useRef } from 'react';

export default function AsciiBackground() {
  const canvasRef = useRef(null);
  const mediaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const sourceMedia = mediaRef.current;
    const container = containerRef.current;
    if (!sourceMedia || !container) return;

    const config = {
      mouseRadius: 50,
      intensity: 1,
      fontSize: 12,
      charSpacing: 0.6,
      lineHeight: 1,
      mousePersistence: 0.97,
      returnSpeed: 0.1,
      returnWhenStill: false,
      enableJiggle: false,
      jiggleIntensity: 0,
      detailFactor: 50,
      contrast: 105,
      brightness: 95,
      saturation: 140,
      useTransparentBackground: true,
      backgroundColor: "#000000"
    };

    const charSet = " .`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    const colorScheme = (r, g, b, brightness, saturation) => {
      const sat = saturation / 100;
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
      const rSat = Math.max(0, Math.min(255, gray + sat * (r - gray)));
      const gSat = Math.max(0, Math.min(255, gray + sat * (g - gray)));
      const bSat = Math.max(0, Math.min(255, gray + sat * (b - gray)));
      return `rgb(${Math.round(rSat)},${Math.round(gSat)},${Math.round(bSat)})`;
    };

    let mouseX = -1000;
    let mouseY = -1000;
    let lastMouseMoveTime = 0;
    let isAnimating = false;
    let chars = [];
    let particles = [];
    let velocities = [];
    let originalPositions = [];
    const isVideo = true; // eslint-disable-line no-unused-vars

    function updateCanvasSize() {
      const containerWidth = container.clientWidth || 300;
      const containerHeight = container.clientHeight || 150;
      const videoWidth = sourceMedia.videoWidth || 640;
      const videoHeight = sourceMedia.videoHeight || 360;
      const mediaRatio = videoHeight / videoWidth;
      
      let width, height;
      if (containerWidth * mediaRatio <= containerHeight) {
        width = containerWidth;
        height = width * mediaRatio;
      } else {
        height = containerHeight;
        width = height / mediaRatio;
      }
      canvas.width = width;
      canvas.height = height;
      return { width, height };
    }

    function applyContrastAndBrightness(imageData) {
      const contrastPercent = config.contrast;
      const brightnessPercent = config.brightness;
      const data = imageData.data;
      if (contrastPercent === 100 && brightnessPercent === 100) return imageData;

      let contrastFactor = contrastPercent < 100 
        ? contrastPercent / 100 
        : 1 + (contrastPercent - 100) / 100 * 0.8;

      let brightnessFactor = brightnessPercent < 100 
        ? (brightnessPercent / 100) * 1.2 
        : 1 + (brightnessPercent - 100) / 100 * 0.8;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (brightnessPercent !== 100) {
          if (brightnessPercent < 100) {
            r *= brightnessFactor;
            g *= brightnessFactor;
            b *= brightnessFactor;
          } else {
            r = r + (255 - r) * (brightnessFactor - 1);
            g = g + (255 - g) * (brightnessFactor - 1);
            b = b + (255 - b) * (brightnessFactor - 1);
          }
        }

        if (contrastPercent !== 100) {
          r = 128 + contrastFactor * (r - 128);
          g = 128 + contrastFactor * (g - 128);
          b = 128 + contrastFactor * (b - 128);
        }

        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }
      return imageData;
    }

    function generateAsciiArt() {
      const dimensions = updateCanvasSize();
      if (!dimensions.width || !dimensions.height || isNaN(dimensions.width) || isNaN(dimensions.height)) {
        return;
      }
      const columns = Math.round(Math.max(20, (dimensions.width / 1200) * config.detailFactor * 3));
      const videoWidth = sourceMedia.videoWidth || 640;
      const videoHeight = sourceMedia.videoHeight || 360;
      const aspectRatio = videoHeight / videoWidth;
      const rows = Math.ceil(columns * aspectRatio);
      
      if (!columns || !rows || isNaN(columns) || isNaN(rows)) {
        return;
      }
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = columns;
      tempCanvas.height = rows;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(sourceMedia, 0, 0, columns, rows);
      
      let imageData = tempCtx.getImageData(0, 0, columns, rows);
      imageData = applyContrastAndBrightness(imageData);
      tempCtx.putImageData(imageData, 0, 0);
      
      const fontSizeX = dimensions.width / columns;
      const fontSizeY = fontSizeX * config.lineHeight;

      if (chars.length === 0) {
        chars = [];
        particles = [];
        velocities = [];
        originalPositions = [];
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
            const posX = x * fontSizeX;
            const posY = y * fontSizeY;
            chars.push({ char: ' ', x: posX, y: posY, color: 'black' });
            particles.push({ x: posX, y: posY });
            velocities.push({ x: 0, y: 0 });
            originalPositions.push({ x: posX, y: posY });
          }
        }
      }

      const pixels = imageData.data;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const index = (y * columns + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          const charIndex = Math.floor(brightness / 266 * charSet.length);
          const char = charSet[Math.min(charIndex, charSet.length - 1)];
          const color = colorScheme(r, g, b, brightness, config.saturation);
          const charIdx = y * columns + x;
          if (charIdx < chars.length) {
            chars[charIdx].char = char;
            chars[charIdx].color = color;
          }
        }
      }
    }

    function animate() {
      if (!isAnimating) return;
      generateAsciiArt();
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!config.useTransparentBackground) {
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.font = `${config.fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const mouseStillTime = Date.now() - lastMouseMoveTime;
      const mouseIsStill = mouseStillTime > 500;

      for (let i = 0; i < particles.length && i < chars.length; i++) {
        const particle = particles[i];
        const velocity = velocities[i];
        const targetX = originalPositions[i].x;
        const targetY = originalPositions[i].y;
        
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRadius && (!mouseIsStill || !config.returnWhenStill)) {
          const force = (1 - distance / config.mouseRadius) * config.intensity;
          const angle = Math.atan2(dy, dx);
          velocity.x += Math.cos(angle) * force * 0.2;
          velocity.y += Math.sin(angle) * force * 0.2;
        }

        if (config.enableJiggle) {
          velocity.x += (Math.random() - 0.5) * config.jiggleIntensity;
          velocity.y += (Math.random() - 0.5) * config.jiggleIntensity;
        }

        velocity.x *= config.mousePersistence;
        velocity.y *= config.mousePersistence;
        particle.x += velocity.x;
        particle.y += velocity.y;

        const springX = targetX - particle.x;
        const springY = targetY - particle.y;
        particle.x += springX * config.returnSpeed;
        particle.y += springY * config.returnSpeed;

        const charInfo = chars[i];
        const lightDist = Math.sqrt((particle.x - mouseX) ** 2 + (particle.y - mouseY) ** 2);
        const radius = 250;

        if (lightDist < radius) {
          ctx.fillStyle = charInfo.color;
        } else {
          const rgb = charInfo.color.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            const brightness = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
            ctx.fillStyle = `rgb(255, ${brightness}, ${brightness})`;
          } else {
            ctx.fillStyle = '#ff0000';
          }
        }
        ctx.fillText(charInfo.char, particle.x, particle.y);
      }
      
      requestAnimationFrame(animate);
    }

    const mouseMoveHandler = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      lastMouseMoveTime = Date.now();
    };

    const mouseLeaveHandler = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const touchMoveHandler = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouseX = touch.clientX - rect.left;
        mouseY = touch.clientY - rect.top;
        lastMouseMoveTime = Date.now();
      }
    };

    const touchEndHandler = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    container.addEventListener("mousemove", mouseMoveHandler);
    container.addEventListener("mouseleave", mouseLeaveHandler);
    container.addEventListener("touchstart", touchMoveHandler, { passive: true });
    container.addEventListener("touchmove", touchMoveHandler, { passive: true });
    container.addEventListener("touchend", touchEndHandler, { passive: true });
    container.addEventListener("touchcancel", touchEndHandler, { passive: true });

    function initializeAscii() {
      if (sourceMedia.readyState >= 2) {
        updateCanvasSize();
        generateAsciiArt();
        isAnimating = true;
        animate();
        sourceMedia.play().catch(err => console.log("Video autoPlay prevented:", err));
      } else {
        sourceMedia.onloadeddata = () => {
          updateCanvasSize();
          generateAsciiArt();
          isAnimating = true;
          animate();
          sourceMedia.play().catch(err => console.log("Video autoPlay prevented:", err));
        };
      }
    }

    initializeAscii();

    // Resize handling
    const resizeHandler = () => {
      chars = [];
      generateAsciiArt();
    };
    window.addEventListener('resize', resizeHandler);

    // Performance Optimization: Pause loop when off-screen
    const pauseAnimation = () => {
      if (isAnimating) {
        isAnimating = false;
        sourceMedia.pause();
      }
    };

    const resumeAnimation = () => {
      if (!isAnimating) {
        isAnimating = true;
        animate();
        sourceMedia.play().catch(err => console.log("Video resume prevented:", err));
      }
    };

    const handleContentVisibility = (e) => {
      if (e.skipped) {
        pauseAnimation();
      } else {
        resumeAnimation();
      }
    };

    let observer;
    const isSupported = 'contentVisibility' in document.documentElement.style;

    if (isSupported) {
      container.addEventListener('contentvisibilityautostatechange', handleContentVisibility);
    } else {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            resumeAnimation();
          } else {
            pauseAnimation();
          }
        });
      }, { rootMargin: '200px' });
      observer.observe(container);
    }

    return () => {
      window.removeEventListener('resize', resizeHandler);
      container.removeEventListener("mousemove", mouseMoveHandler);
      container.removeEventListener("mouseleave", mouseLeaveHandler);
      container.removeEventListener("touchstart", touchMoveHandler);
      container.removeEventListener("touchmove", touchMoveHandler);
      container.removeEventListener("touchend", touchEndHandler);
      container.removeEventListener("touchcancel", touchEndHandler);
      if (isSupported) {
        container.removeEventListener('contentvisibilityautostatechange', handleContentVisibility);
      } else if (observer) {
        observer.disconnect();
      }
      isAnimating = false;
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', margin: '0 auto', overflow: 'hidden', position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ display: 'block', minWidth: '100%', minHeight: '100%', objectFit: 'cover' }}></canvas>
      <video ref={mediaRef} src="/creationofadam.mp4" loop muted playsInline autoPlay style={{ display: 'none' }} />
    </div>
  );
}
