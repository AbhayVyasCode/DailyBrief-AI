import React from 'react';

const partners = [
  {
    name: 'Reuters',
    svg: (
      <svg viewBox="0 0 200 40" className="h-6 md:h-7" fill="none">
        <circle cx="16" cy="20" r="14" fill="#FF7F00"/>
        <circle cx="16" cy="8" r="3.5" fill="white"/>
        <circle cx="16" cy="20" r="3.5" fill="white"/>
        <circle cx="16" cy="32" r="3.5" fill="white"/>
        <circle cx="28" cy="14" r="3.5" fill="white"/>
        <circle cx="28" cy="26" r="3.5" fill="white"/>
        <text x="38" y="26" fontFamily="Georgia, serif" fontWeight="700" fontSize="22" fill="#1A1A1A">Reuters</text>
      </svg>
    ),
  },
  {
    name: 'BBC',
    svg: (
      <svg viewBox="0 0 120 40" className="h-7 md:h-8">
        <rect x="0" y="4" width="28" height="32" rx="5" fill="#1A1A1A"/>
        <text x="14" y="27" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="white">B</text>
        <rect x="32" y="4" width="28" height="32" rx="5" fill="#1A1A1A"/>
        <text x="46" y="27" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="white">B</text>
        <rect x="64" y="4" width="28" height="32" rx="5" fill="#1A1A1A"/>
        <text x="78" y="27" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="white">C</text>
      </svg>
    ),
  },
  {
    name: 'Bloomberg',
    svg: (
      <svg viewBox="0 0 300 60" className="h-5 md:h-6">
        <text x="0" y="42" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="44" fill="#1A1A1A" letterSpacing="1">BLOOMBERG</text>
        <line x1="0" y1="52" x2="300" y2="52" stroke="#1A1A1A" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    name: 'The Verge',
    svg: (
      <svg viewBox="0 0 180 40" className="h-6 md:h-7">
        <text x="0" y="30" fontFamily="Georgia, serif" fontWeight="700" fontStyle="italic" fontSize="30" fill="#1A1A1A">The Verge</text>
      </svg>
    ),
  },
  {
    name: 'TechCrunch',
    svg: (
      <svg viewBox="0 0 240 90" className="h-6 md:h-7">
        <polygon fill="#0A9E01" points="90,0 90,30 60,30 60,90 30,90 30,30 0,30 0,0"/>
        <rect x="120" y="0" fill="#0A9E01" width="60" height="30"/>
        <polygon fill="#0A9E01" points="180,60 180,90 90,90 90,30 120,30 120,60"/>
      </svg>
    ),
  },
  {
    name: 'CNN',
    img: 'https://cdn.brandfetch.io/idhidc5593/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1721816108390',
  },
  {
    name: 'Al Jazeera',
    svg: (
      <svg viewBox="0 0 240 40" className="h-7 md:h-8">
        <text x="0" y="30" fontFamily="Georgia, serif" fontWeight="700" fontSize="26" fill="#D4A017" letterSpacing="2">AL JAZEERA</text>
      </svg>
    ),
  },
  {
    name: 'NDTV',
    img: 'https://cdn.brandfetch.io/idCIBdadOR/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1774321079668',
  },
  {
    name: 'The New York Times',
    img: 'https://cdn.brandfetch.io/ida5pjO05F/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667566812797',
  },
  {
    name: 'The Guardian',
    svg: (
      <svg viewBox="0 0 220 40" className="h-6 md:h-7">
        <text x="0" y="30" fontFamily="Georgia, serif" fontWeight="700" fontSize="26" fill="#052962">The Guardian</text>
      </svg>
    ),
  },
  {
    name: 'France24',
    img: 'https://cdn.brandfetch.io/id922ipZxd/w/550/h/234/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1777278534110',
  },
  {
    name: 'Times of India',
    svg: (
      <svg viewBox="0 0 280 40" className="h-6 md:h-7">
        <text x="0" y="28" fontFamily="Georgia, serif" fontWeight="700" fontSize="24" fill="#1A1A1A">The Times of India</text>
      </svg>
    ),
  },
  {
    name: 'Hindustan Times',
    svg: (
      <svg viewBox="0 0 280 40" className="h-6 md:h-7">
        <text x="0" y="28" fontFamily="Georgia, serif" fontWeight="700" fontSize="24" fill="#1A1A1A">Hindustan Times</text>
      </svg>
    ),
  },
  {
    name: 'Dainik Bhaskar',
    svg: (
      <svg viewBox="0 0 260 40" className="h-6 md:h-7">
        <text x="0" y="28" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="24" fill="#E31E24">Dainik Bhaskar</text>
      </svg>
    ),
  },
  {
    name: 'Zee News',
    img: 'https://cdn.brandfetch.io/idRiu-t0oX/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1781745745337',
  },
  {
    name: 'Aaj Tak',
    img: 'https://cdn.brandfetch.io/idinaukSDf/w/498/h/309/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1781381264814',
  },
];

const LogoWall = () => {
  const renderLogo = (partner: typeof partners[0]) => {
    if ('img' in partner && partner.img) {
      return (
        <img
          src={partner.img}
          alt={partner.name}
          className="h-7 md:h-8 w-auto object-contain"
          loading="lazy"
          decoding="async"
        />
      );
    }
    return 'svg' in partner ? partner.svg : null;
  };

  return (
    <section className="border-y border-gray-200/60 py-14 bg-white/40 relative z-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 text-center mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">
          Synthesizing content from trusted global desks
        </p>
      </div>

      {/* Marquee row 1 */}
      <div className="relative mb-5 group/marquee">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex w-fit items-center marquee-track-1">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex-shrink-0 mx-8 md:mx-14 flex items-center justify-center"
              title={partner.name}
            >
              {renderLogo(partner)}
            </div>
          ))}
        </div>
      </div>

      {/* Marquee row 2 — reversed */}
      <div className="relative mb-8 group/marquee">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex w-fit items-center marquee-track-2">
          {[...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, i) => (
            <div
              key={`rev-${partner.name}-${i}`}
              className="flex-shrink-0 mx-8 md:mx-14 flex items-center justify-center"
              title={partner.name}
            >
              {renderLogo(partner)}
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-8 border-t border-gray-200/40">
          {[
            { value: '500+', label: 'Sources Indexed' },
            { value: '30', label: 'Categories' },
            { value: '24/7', label: 'Real-Time Sync' },
            { value: '<1s', label: 'AI Latency' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2.5">
              <span className="text-xl font-black text-[#0f172a]">{stat.value}</span>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track-1 {
          animation: marquee-left 50s linear infinite;
        }
        .marquee-track-2 {
          animation: marquee-right 55s linear infinite;
        }
        .group\\/marquee:hover .marquee-track-1,
        .group\\/marquee:hover .marquee-track-2 {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default LogoWall;
