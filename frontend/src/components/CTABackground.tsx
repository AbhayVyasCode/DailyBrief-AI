import { useEffect, useRef } from 'react';

const CTABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width * 1.5;
      canvas.height = height * 1.5;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // --- Particles ---
    const particles: {
      x: number; y: number; vx: number; vy: number;
      r: number; opacity: number; color: string;
      phase: number; speed: number;
    }[] = [];
    for (let i = 0; i < 50; i++) {
      const colors = ['59,130,246', '168,85,247', '236,72,153', '34,211,238'];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.35 - 0.05,
        r: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.35 + 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      });
    }

    // --- Light beams ---
    const beams: {
      x: number; angle: number; speed: number;
      opacity: number; width: number; hue: string;
    }[] = [];
    for (let i = 0; i < 6; i++) {
      beams.push({
        x: Math.random() * width,
        angle: -25 + Math.random() * 15,
        speed: 0.1 + Math.random() * 0.25,
        opacity: 0.012 + Math.random() * 0.018,
        width: 60 + Math.random() * 140,
        hue: i % 2 === 0 ? '59,130,246' : '168,85,247',
      });
    }

    // --- Wave points for mesh ---
    const wavePoints: { x: number; y: number; baseY: number; freq: number; amp: number; phase: number; speed: number }[] = [];
    const waveCount = 8;
    const waveSpacing = height / (waveCount + 1);
    for (let i = 0; i < waveCount; i++) {
      for (let j = 0; j < 12; j++) {
        wavePoints.push({
          x: (j / 11) * width,
          y: waveSpacing * (i + 1),
          baseY: waveSpacing * (i + 1),
          freq: 0.003 + Math.random() * 0.002,
          amp: 8 + Math.random() * 15,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
        });
      }
    }

    let time = 0;

    const draw = () => {
      time += 0.006;
      ctx.clearRect(0, 0, width, height);

      // === 1. Base gradient ===
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#0a0e1a');
      baseGrad.addColorStop(0.3, '#0f172a');
      baseGrad.addColorStop(0.6, '#111827');
      baseGrad.addColorStop(1, '#0a0e1a');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // === 2. Animated aurora blobs ===
      const auroras = [
        { cx: 0.25, cy: 0.3, r: 300, color: '59,130,246', speed: 0.4, drift: 0.12 },
        { cx: 0.7, cy: 0.5, r: 250, color: '168,85,247', speed: 0.35, drift: 0.1 },
        { cx: 0.5, cy: 0.7, r: 280, color: '236,72,153', speed: 0.3, drift: 0.08 },
        { cx: 0.8, cy: 0.2, r: 220, color: '34,211,238', speed: 0.45, drift: 0.15 },
      ];
      auroras.forEach((a) => {
        const ax = width * a.cx + Math.sin(time * a.speed) * width * a.drift;
        const ay = height * a.cy + Math.cos(time * a.speed * 0.7) * height * a.drift;
        const grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, a.r);
        grad.addColorStop(0, `rgba(${a.color},0.07)`);
        grad.addColorStop(0.5, `rgba(${a.color},0.03)`);
        grad.addColorStop(1, `rgba(${a.color},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // === 3. Wave mesh ===
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 0.5;
      wavePoints.forEach((p) => {
        p.y = p.baseY + Math.sin(time * p.speed + p.phase + p.x * p.freq) * p.amp;
      });
      for (let row = 0; row < waveCount; row++) {
        ctx.beginPath();
        const start = row * 12;
        for (let j = 0; j < 12; j++) {
          const pt = wavePoints[start + j];
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      // === 4. Light beams ===
      beams.forEach((b) => {
        b.x += b.speed;
        if (b.x > width + 300) b.x = -300;

        ctx.save();
        ctx.translate(b.x, height * 0.5);
        ctx.rotate((b.angle * Math.PI) / 180);

        const beamGrad = ctx.createLinearGradient(0, -b.width / 2, 0, b.width / 2);
        beamGrad.addColorStop(0, 'rgba(255,255,255,0)');
        beamGrad.addColorStop(0.3, `rgba(${b.hue},${b.opacity * 0.5})`);
        beamGrad.addColorStop(0.5, `rgba(255,255,255,${b.opacity})`);
        beamGrad.addColorStop(0.7, `rgba(${b.hue},${b.opacity * 0.5})`);
        beamGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(-3, -b.width / 2, 6, b.width);
        ctx.restore();
      });

      // === 5. Particles with connections ===
      particles.forEach((p) => {
        // Wave motion
        p.x += p.vx + Math.sin(time * p.speed + p.phase) * 0.15;
        p.y += p.vy;

        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const pulse = Math.sin(time * 2.5 + p.phase) * 0.2 + 0.8;

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        glow.addColorStop(0, `rgba(${p.color},${p.opacity * 0.3 * pulse})`);
        glow.addColorStop(1, `rgba(${p.color},0)`);
        ctx.fillStyle = glow;
        ctx.fillRect(p.x - p.r * 5, p.y - p.r * 5, p.r * 10, p.r * 10);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity * pulse})`;
        ctx.fill();
      });

      // Connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // === 6. Edge glow pulse ===
      const edgeGlow = Math.sin(time * 0.8) * 0.03 + 0.05;
      const edgeGrad = ctx.createLinearGradient(0, 0, 0, height);
      edgeGrad.addColorStop(0, `rgba(245,158,11,${edgeGlow})`);
      edgeGrad.addColorStop(0.15, 'rgba(245,158,11,0)');
      edgeGrad.addColorStop(0.85, 'rgba(245,158,11,0)');
      edgeGrad.addColorStop(1, `rgba(245,158,11,${edgeGlow})`);
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, width, height);

      // Side edge glow
      const sideGrad = ctx.createLinearGradient(0, 0, width, 0);
      sideGrad.addColorStop(0, `rgba(245,158,11,${edgeGlow * 0.8})`);
      sideGrad.addColorStop(0.1, 'rgba(245,158,11,0)');
      sideGrad.addColorStop(0.9, 'rgba(245,158,11,0)');
      sideGrad.addColorStop(1, `rgba(245,158,11,${edgeGlow * 0.8})`);
      ctx.fillStyle = sideGrad;
      ctx.fillRect(0, 0, width, height);

      // === 7. Subtle noise grain ===
      const imageData = ctx.getImageData(0, 0, 2, 2);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 6;
        imageData.data[i] += noise;
        imageData.data[i + 1] += noise;
        imageData.data[i + 2] += noise;
      }
      // Only apply noise to a small patch and tile it (performance)
      ctx.putImageData(imageData, 0, 0);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default CTABackground;
