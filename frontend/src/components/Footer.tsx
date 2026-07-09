import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Feed', href: '/feed' },
    { label: 'Trends', href: '/trends' },
    { label: 'Videos', href: '/videos' },
    { label: 'AI Tools', href: '/tools' },
    { label: 'Search', href: '/search' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Status', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:hello@dailybrief.ai', label: 'Email' },
];

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  return (
    <footer ref={containerRef} className="relative z-10 border-t border-gray-200/50 bg-[#f8f9fa]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4255d4]/30 to-transparent" />

      <motion.div
        style={{ opacity, y }}
        className="max-w-[1200px] mx-auto px-5 md:px-8"
      >
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-black/10 group-hover:shadow-lg transition-shadow">
                <img src="/features/DailyBrief AI icon.jpg" alt="DailyBrief AI" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-xl text-[#0b132b] tracking-tight">DailyBrief AI</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[280px]">
              AI-powered news intelligence. Summarize, translate, and listen to news from 500+ sources worldwide.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#4255d4] hover:text-white flex items-center justify-center text-gray-400 transition-colors duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1 md:col-span-2">
              <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-[#4255d4] transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-gray-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} DailyBrief AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>All systems operational</span>
          </div>
        </div>

        {/* Giant brand watermark */}
        <div className="overflow-hidden pt-2 pb-2 flex justify-center">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group cursor-pointer inline-flex items-center gap-4 md:gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-4 md:gap-6"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-black/10 group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300">
                <img src="/features/DailyBrief AI icon.jpg" alt="DailyBrief AI" className="w-full h-full object-cover" />
              </div>
              <span className="text-5xl md:text-8xl font-black tracking-tighter text-[#0f172a] select-none group-hover:text-blue-600 transition-colors duration-300">
                DailyBrief AI
              </span>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
