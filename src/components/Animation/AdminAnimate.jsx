import React, { useRef, useEffect } from "react";

const AdminAnimate = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Detect theme dynamically
    const getTheme = () => {
      const attrTheme = document.documentElement.getAttribute("data-theme");
      if (attrTheme) return attrTheme;
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    };

    const getColors = (theme) => ({
      particle: theme === "light" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
      line: theme === "light" ? "rgba(0,0,0," : "rgba(255,255,255,",
      bg: theme === "light" ? "#f9f9f9" : "#0a0a0a",
    });

    let theme = getTheme();
    let colors = getColors(theme);

    // Observe for theme changes
    const observer = new MutationObserver(() => {
      theme = getTheme();
      colors = getColors(theme);
      canvas.style.background = colors.bg;
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Mouse tracking
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.speedY = Math.random() * 1.5 - 0.75;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x <= 0 || this.x >= canvas.width) this.speedX = -this.speedX;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY = -this.speedY;
      }
      draw() {
        ctx.fillStyle = colors.particle;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles = [];
    const particleCount = 75;
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    // Connect particles
    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.strokeStyle = `${colors.line}${1 - distance / 150})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Mouse connections
        if (mouse.x && mouse.y) {
          const dxMouse = particles[a].x - mouse.x;
          const dyMouse = particles[a].y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 150) {
            ctx.strokeStyle = `${colors.line}${1 - distMouse / 150})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };

    // Animate
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      observer.disconnect();
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
        zIndex: -99,
        background: "#0a0a0a",
        transition: "background 0.5s ease",
      }}
    />
  );
};

export default AdminAnimate;
