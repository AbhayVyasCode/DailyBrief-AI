import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import type { Marker } from 'cobe';
import { cn } from '../lib/utils';

interface PremiumGlobeProps {
  className?: string;
  markers?: Marker[];
  onRegionChange?: (regionId: string) => void;
  onPhiChange?: (phi: number) => void;
  targetPhi?: number;
}

const PremiumGlobe = ({ className, markers = [], onRegionChange, onPhiChange, targetPhi }: PremiumGlobeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Keep markers in a Ref to avoid React stale closure bugs inside the requestAnimationFrame loop
  const markersRef = useRef(markers);
  markersRef.current = markers;

  // Keep rotation variables in Refs to avoid React closure stale states
  const phiRef = useRef(0.2618);
  const targetPhiRef = useRef(0.2618);
  const isTransitioningRef = useRef(false);
  const lastRegionRef = useRef('americas');

  // Trigger smooth rotation transition when targetPhi prop changes (e.g. on manual pill click)
  useEffect(() => {
    if (targetPhi !== undefined) {
      // Find shortest path from current phi to targetPhi
      const diff = targetPhi - phiRef.current;
      const adjustedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
      
      targetPhiRef.current = phiRef.current + adjustedDiff;
      isTransitioningRef.current = true;

      // Map targetPhi back to a region so we don't trigger intermediate auto-switches
      const targetDeg = (targetPhi * 180) / Math.PI - 90;
      let targetLon = targetDeg % 360;
      if (targetLon < -180) targetLon += 360;
      if (targetLon > 180) targetLon -= 360;

      let targetRegion = 'europe';
      if (targetLon >= -120 && targetLon < -20) {
        targetRegion = 'americas';
      } else if (targetLon >= -20 && targetLon < 30) {
        targetRegion = 'europe';
      } else if (targetLon >= 30 && targetLon < 80) {
        targetRegion = 'mea';
      } else {
        targetRegion = 'asiapacific';
      }
      lastRegionRef.current = targetRegion;
    }
  }, [targetPhi]);

  useEffect(() => {
    if (!canvasRef.current) return;

    let width = canvasRef.current.offsetWidth || 400;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1); // Capped to 1.5 to guarantee high performance on Retina screens

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: dpr,
      width: width,
      height: width,
      phi: phiRef.current,
      theta: 0.15,
      dark: 0,
      scale: 1.1,
      diffuse: 1.2,
      mapSamples: 8500, // Optimized to 8500 for lightweight vertex processing on standard GPUs
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.26, 0.33, 0.83],
      glowColor: [0.85, 0.9, 1],
      opacity: 1,
      offset: [0, 0],
      markers: [], // Initialize with empty markers; they will be fed dynamically in the loop
    });
    globeRef.current = globe;

    const onResize = () => {
      if (canvasRef.current && globeRef.current) {
        width = canvasRef.current.offsetWidth || 400;
        const currentDpr = Math.min(1.5, window.devicePixelRatio || 1);
        globeRef.current.update({ 
          width: width, 
          height: width,
          devicePixelRatio: currentDpr
        });
      }
    };
    window.addEventListener('resize', onResize);

    let animationFrameId: number;
    let frameCount = 0;

    const animate = () => {
      if (isTransitioningRef.current) {
        // Smoothly interpolate to the selected region center
        const diff = targetPhiRef.current - phiRef.current;
        if (Math.abs(diff) < 0.005) {
          phiRef.current = targetPhiRef.current;
          isTransitioningRef.current = false;
        } else {
          phiRef.current += diff * 0.08; // Lerp easing
        }
      } else {
        // Continuous slow rotation when not in manual transition
        phiRef.current += 0.008;
      }

      const phi = phiRef.current;

      // Project the current camera center longitude in degrees
      const deg = (phi * 180) / Math.PI;
      let facingLon = (-90 + deg) % 360;
      if (facingLon < -180) facingLon += 360;
      if (facingLon > 180) facingLon -= 360;

      // Calculate dynamic marker sizes based strictly on horizontal longitude distance.
      // This prevents high-latitude regions (e.g., London, New York, Tokyo) from being vertically clipped.
      const updatedMarkers = markersRef.current.map(marker => {
        const [, lon] = marker.location;
        
        const dLon = Math.abs(lon - facingLon);
        const normalizedDLon = dLon > 180 ? 360 - dLon : dLon;
        
        const maxDistance = 60; // Max longitude difference in degrees (approx. 1/3 of the visible hemisphere)
        let size = 0;
        
        if (normalizedDLon < maxDistance) {
          // Smooth quadratic easing for a premium fade-in/out effect as dots cross the center
          const t = 1 - normalizedDLon / maxDistance;
          size = 0.065 * (t * t); // Max size 0.065 at dead center
        }
        
        return {
          ...marker,
          size
        };
      });
      
      if (globeRef.current) {
        // Update both rotation (phi) and dynamic markers
        globeRef.current.update({ phi, markers: updatedMarkers });
      }
      
      if (onPhiChange) onPhiChange(phi);

      // Only check and trigger automatic region switching if we are NOT transitioning
      if (!isTransitioningRef.current) {
        frameCount++;
        if (frameCount % 10 === 0) {
          let region = 'europe';
          if (facingLon >= -120 && facingLon < -20) {
            region = 'americas'; // Americas centered at -75
          } else if (facingLon >= -20 && facingLon < 30) {
            region = 'europe'; // Europe centered at 15
          } else if (facingLon >= 30 && facingLon < 80) {
            region = 'mea'; // MEA centered at 40
          } else {
            region = 'asiapacific'; // Asia-Pacific centered at 120
          }

          if (region !== lastRegionRef.current && onRegionChange) {
            lastRegionRef.current = region;
            onRegionChange(region);
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    setIsReady(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
    };
  }, [onRegionChange, onPhiChange]);

  return (
    <div className={cn('flex items-center justify-center z-10 w-full h-full', className)}>
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
          }}
        />
      </div>
    </div>
  );
};

export default PremiumGlobe;
