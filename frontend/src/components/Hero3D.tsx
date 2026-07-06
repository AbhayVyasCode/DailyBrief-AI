const Hero3D = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {/* Morphing Liquid Sphere */}
      <div className="relative w-72 h-72 lg:w-80 lg:h-80">
        {/* Outer glowing halo */}
        <div 
          className="absolute inset-[-20px] bg-primary/25 dark:bg-primary/10 rounded-full blur-3xl animate-pulse" 
          style={{ animationDuration: '4s' }} 
        />
        
        {/* Hardware accelerated CSS morphing shape */}
        <div 
          className="w-full h-full bg-gradient-to-tr from-primary via-indigo-500 to-purple-600 opacity-80 dark:opacity-75 shadow-2xl"
          style={{
            willChange: 'border-radius, transform',
            animation: 'morph 12s ease-in-out infinite, spin 20s linear infinite',
          }}
        />
      </div>
      
      {/* Morphing Keyframe Styles injected directly */}
      <style>{`
        @keyframes morph {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.05);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Hero3D;
