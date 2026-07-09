import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ChatWidget from './ChatWidget';
import ThreeBackground from './ThreeBackground';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div id="app-root" className="bg-background text-foreground font-sans selection:bg-primary/20">
      {!isHomePage && <ThreeBackground />}
      {!isHomePage && <Navbar />}
      <main className={isHomePage ? "w-full relative z-10" : "container mx-auto px-4 pb-24 pt-20 md:pt-24 md:pb-8 relative z-10"}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className=""
        >
          {children}
        </motion.div>
      </main>
      <ChatWidget />
    </div>
  );
};

export default Layout;
