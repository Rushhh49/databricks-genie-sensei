'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MouseFollower() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    if (isClient) {
        window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
        if (isClient) {
            window.removeEventListener('mousemove', handleMouseMove);
        }
    };
  }, [isClient, mouseX, mouseY]);

  if (!isClient) {
    return null;
  }

  return (
    <motion.div
      style={{
        translateX: smoothMouseX,
        translateY: smoothMouseY,
      }}
      className="pointer-events-none fixed -left-32 -top-32 h-64 w-64 rounded-full bg-primary/30 opacity-50 blur-3xl"
    />
  );
}
