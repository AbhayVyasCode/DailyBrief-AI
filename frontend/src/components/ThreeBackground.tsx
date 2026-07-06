const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-background" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient gradient blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
    </div>
  );
};

export default ThreeBackground;
