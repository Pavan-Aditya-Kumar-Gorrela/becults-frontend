import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TiltedImage from '../components/tilt-image';
import LightRays from '../components/Plasma';
import TrueFocus from '../components/TrueFocus';
import Particles from '../components/PixelSnow';
export default function HeroSection() {
  return (
    <section className="flex flex-col items-center -mt-18 relative">

      
    
      <div
        style={{ width: '100%', height: '600px', position: 'relative' }}
        className="mt-10 mx-0 px-0 flex items-center justify-center z-10"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen' }}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={1}
              rayLength={2}
              pulsating={false}
              fadeDistance={1.0}
              saturation={1.0}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.0}
              distortion={0.0}
            />
          </div>
          <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', opacity: 0.8 }}>
            <Particles
              particleColors={["#ffffff"]}
              particleCount={250}
              particleSpread={15}
              speed={0.15}
              particleBaseSize={80}
              moveParticlesOnHover={true}
              alphaParticles={true}
              disableRotation={false}
              pixelRatio={1}
              cameraDistance={20}
            />
          </div>
        </div>
        <div className="relative z-20 flex flex-col items-center px-4">
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
              sentence="LEARN FLEX INSPIRE BUILD"
              manualMode={false}
              blurAmount={5}
              borderColor="#5227FF"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
            />
          </motion.div>
        </div>
      </div>
      <div class="text-center space-y-2 mt-10">
        <p class="font-bold text-lg md:text-xl text-gray-300">
          Great engineers are not shaped in isolation.
        </p>

        <p class="font-bold text-2xl md:text-4xl text-indigo-600 tracking-wide transition-transform hover:scale-105">
            MINDS COLLABORATE, INNOVATION ACCELERATES.
        </p>

        <p class="font-bold text-lg md:text-xl text-gray-300">
          Together, we learn, build, and grow beyond limits.
        </p>
      </div>

      <TiltedImage />
    </section>
  );
}