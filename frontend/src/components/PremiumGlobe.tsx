import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import type { Marker } from 'cobe';
import { cn } from '../lib/utils';

interface PremiumGlobeProps {
  className?: string;
  markers?: Marker[];
  onRegionChange?: (regionId: string) => void;
  onPhiChange?: (phi: number) => void;
}

const PremiumGlobe = ({ className, markers = [], onRegionChange, onPhiChange }: PremiumGlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const markersRef = useRef(markers);
  markersRef.current = markers;

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();

    let phi = 0;
    let lastRegion = 'americas';

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1.5,
      width: width * 1.5,
      height: width * 1.5,
      phi: 0,
      theta: 0.15,
      dark: 0,
      scale: 1.1,
      diffuse: 1.2,
      mapSamples: 15000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.26, 0.33, 0.83],
      glowColor: [0.85, 0.9, 1],
      opacity: 1,
      offset: [0, 0],
      markers: markersRef.current,
    });

    let animationFrameId: number;
    const animate = () => {
      phi += 0.002;
      globe.update({ phi, markers: markersRef.current });
      if (onPhiChange) onPhiChange(phi);

      const facingLon = ((-phi * 180) / Math.PI) % 360;
      const normalizedLon = facingLon > 180 ? facingLon - 360 : facingLon;

      let region = 'americas';
      if (normalizedLon >= -170 && normalizedLon < -30) region = 'americas';
      else if (normalizedLon >= -30 && normalizedLon < 25) region = 'europe';
      else if (normalizedLon >= 25 && normalizedLon < 65) region = 'mea';
      else region = 'asiapacific';

      if (region !== lastRegion && onRegionChange) {
        lastRegion = region;
        onRegionChange(region);
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    setIsReady(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      globe.destroy();
    };
  }, [onRegionChange, onPhiChange]);

  return (
    <div
      className={cn(
        'flex items-center justify-center z-10 w-full h-full',
        className
      )}
    >
      <div className="relative w-full max-w-[460px] aspect-square">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] h-[300px] rounded-full bg-[#4255d4]/10 blur-[60px]" />
        </div>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            aspectRatio: '1',
            opacity: isReady ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
};

export default PremiumGlobe;
