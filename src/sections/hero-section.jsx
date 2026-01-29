import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltedImage from '../components/tilt-image';
import LightRays from '../components/Plasma';
import TrueFocus from '../components/TrueFocus';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center -mt-18">
      <div
        style={{ width: '100%', height: '600px', position: 'relative' }}
        className="mt-10 mx-0 px-0 flex items-center justify-center"
      >
        <div className="absolute inset-0">
          <LightRays
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center px-4">
          <motion.a
            className="flex items-center gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2"
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            <div className="size-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span>BECULTS IS LIVE NOW</span>
          </motion.a>
          <motion.h1
            className="text-center text-5xl leading-[68px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-2xl"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 70,
              mass: 1,
            }}
          >
            Let's grow together
          </motion.h1>
          <motion.p
            className="text-center text-base max-w-lg mt-2"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              type: 'spring',
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            Our platform helps you build, grow, and excell faster — so you can
            focus on what matters.
          </motion.p>
          <motion.div
            className="flex items-center gap-4 mt-8"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            <TrueFocus
              sentence="Learn Grow Flex Excell"
              manualMode={false}
              blurAmount={5}
              borderColor="#5227FF"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
            />
          </motion.div>
        </div>
      </div>
      <TiltedImage />
    </section>
  );
}
