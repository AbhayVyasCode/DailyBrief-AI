import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Languages, Volume2, Play, Bot } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Zap,
    title: 'AI Summaries',
    desc: 'Gemini delivers structured briefings.',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-[#f0f4ff]',
    border: 'border-[#dce4f8]',
    image: '/features/feature-image-1.jpg',
  },
  {
    id: 2,
    icon: Languages,
    title: 'Translation',
    desc: 'Hindi-English preserving context.',
    color: 'from-purple-500 to-violet-500',
    bg: 'bg-[#faf5ff]',
    border: 'border-[#ede5f8]',
    image: '/features/feature-image-2.jpg',
  },
  {
    id: 3,
    icon: Volume2,
    title: 'Text-to-Speech',
    desc: 'Natural voice in multiple languages.',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-[#fff8f0]',
    border: 'border-[#f8e8d8]',
    image: '/features/feature-image-3.jpg',
  },
  {
    id: 4,
    icon: Play,
    title: 'Video Curation',
    desc: 'HD broadcasts sorted by trends.',
    color: 'from-red-500 to-rose-500',
    bg: 'bg-[#fef2f2]',
    border: 'border-[#f8e0e0]',
    image: '/features/feature-image-4.jpg',
  },
  {
    id: 5,
    icon: Bot,
    title: 'AI Chat',
    desc: 'Verified context in real-time.',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-[#f0fdf4]',
    border: 'border-[#d8f0dc]',
    image: '/features/feature-image-5.jpg',
  },
];

const FeatureShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={containerRef} className="relative z-10 h-[350vh] mt-16 md:mt-24 lg:mt-32">
      <div
        className="sticky w-full max-w-[1150px] mx-auto px-5 md:px-8 flex flex-col justify-center"
        style={{
          height: 'min(820px, 90vh)',
          top: 'calc((100vh - min(820px, 90vh)) / 2)'
        }}
      >
        {/* Section heading */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-[#0f172a] leading-tight mb-2">
            Powerful features, effortlessly simple.
          </h2>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg mt-2 max-w-xl mx-auto">
            Everything you need to stay informed — AI summaries, translation, speech, video, and chat.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center">

          {/* Left — compact nav */}
          <div className="space-y-1 order-2 md:order-1">

            {features.map((f, i) => (
              <NavItem key={f.id} feature={f} index={i} progress={scrollYProgress} total={features.length} />
            ))}
          </div>

          {/* Right — stacked card image panel */}
          <div className="relative aspect-[1264/848] order-1 md:order-2 w-full h-auto">
            {features.map((f, i) => (
              <StackedCard key={f.id} feature={f} index={i} progress={scrollYProgress} total={features.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const NavItem = ({
  feature,
  index,
  progress,
  total,
}: {
  feature: typeof features[0];
  index: number;
  progress: any;
  total: number;
}) => {
  const Icon = feature.icon;
  const seg = 1 / total;
  const s = index * seg;
  const e = (index + 1) * seg;

  const opacity = useTransform(progress, [Math.max(0, s - 0.01), s, e - 0.01, e], [0.3, 1, 1, 0.3]);
  const x = useTransform(progress, [Math.max(0, s - 0.01), s, e - 0.01, e], [-4, 0, 0, -4]);
  const barH = useTransform(progress, [s, e], ['0%', '100%']);

  return (
    <motion.div style={{ opacity, x }} className="relative py-3 md:py-4 pl-6 pr-3 rounded-xl cursor-default">
      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gray-100 overflow-hidden">
        <motion.div style={{ height: barH }} className={`w-full bg-gradient-to-b ${feature.color} rounded-full`} />
      </div>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon className="w-5 h-5 lg:w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base lg:text-lg xl:text-xl font-bold text-[#0f172a] leading-tight">{feature.title}</h3>
          <p className="text-gray-400 text-[13px] lg:text-sm xl:text-base leading-snug hidden md:block mt-1">{feature.desc}</p>
        </div>
      </div>
    </motion.div>
  );
};

const StackedCard = ({
  feature,
  index,
  progress,
  total,
}: {
  feature: typeof features[0];
  index: number;
  progress: any;
  total: number;
}) => {
  const seg = 1 / total;
  const s = index * seg;
  const e = (index + 1) * seg;

  // Card 0: visible at start, fades out as you scroll past
  // Cards 1+: hidden until their segment, fades out when next segment starts
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, e - 0.02, e]
      : [s - 0.02, s, e - 0.02, e],
    index === 0
      ? [1, 1, 0]
      : [0, 1, 1, index === total - 1 ? 1 : 0]
  );

  const scale = useTransform(
    progress,
    index === 0
      ? [0, e - 0.02, e]
      : [s - 0.02, s, e - 0.02, e],
    index === 0
      ? [1, 1, 0.92]
      : [0.92, 1, 1, 0.92]
  );

  const y = useTransform(
    progress,
    index === 0
      ? [0, e - 0.02, e]
      : [s - 0.02, s, e - 0.02, e],
    index === 0
      ? [0, 0, -20]
      : [40, 0, 0, -20]
  );

  const rotate = useTransform(
    progress,
    index === 0
      ? [0, e - 0.02, e]
      : [s - 0.02, s, e - 0.02, e],
    index === 0
      ? [0, 0, -2]
      : [3, 0, 0, -2]
  );

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y,
        rotateZ: rotate,
        zIndex: total - index,
      }}
      className="absolute inset-0"
    >
      <div
        className={`w-full h-full ${feature.bg} ${feature.border} border rounded-2xl overflow-hidden`}
        style={{ boxShadow: '0 8px 30px -5px rgba(0,0,0,0.08)' }}
      >
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.style.display = 'none';
            const p = t.parentElement;
            if (p && !p.querySelector('.ph')) {
              const d = document.createElement('div');
              d.className = 'ph absolute inset-0 flex flex-col items-center justify-center gap-2';
              d.innerHTML = '<div class="w-12 h-12 rounded-xl bg-gradient-to-br ' + feature.color + ' flex items-center justify-center shadow-lg"><svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div><p class="text-[10px] font-semibold text-gray-400">' + feature.image + '</p>';
              p.appendChild(d);
            }
          }}
        />
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <div className={'w-5 h-5 rounded-md bg-gradient-to-br ' + feature.color + ' flex items-center justify-center'}>
              <feature.icon className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-white text-[10px] font-bold tracking-wide">{feature.title}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureShowcase;
