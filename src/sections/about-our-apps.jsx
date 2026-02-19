import SectionTitle from '../components/section-title';
import { motion } from 'framer-motion';

export default function AboutOurApps() {
  const sectionData = [
    {
      title: 'Innovative Learning Approach',
      description: 'Built with speed — minimal load times and optimized.',
      image:
        'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png',
      className:
        'py-10 border-b border-slate-700 md:py-0 md:border-r md:border-b-0 md:px-10',
    },
    {
      title: 'Beautifully Designed Cohorts',
      description: 'Modern, beginner friendly suited cohorts following perfect roadmaps.',
      image:
        'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png',
      className:
        'py-10 border-b border-slate-700 md:py-0 lg:border-r md:border-b-0 md:px-10',
    },
    {
      title: '24/7 Service',
      description:
        'Continuous Support and Tech Sympnosium',
      image:
        'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png',
      className:
        'py-10 border-b border-slate-700 md:py-0 md:border-b-0 md:px-10',
    },
  ];
  return (
    <section className="flex flex-col items-center" id="about">
      <SectionTitle
        title="About Us"
        description="A ongoing student community that acts as bridge between college and companies"
      />

      <div className="max-w-3xl px-6 md:px-0 mt-6 text-center text-slate-300 leading-relaxed">
        <p>
          Becults is a dynamic student-driven organization committed to fostering innovation,
          collaboration, and continuous growth. We bring together passionate learners who aspire to
          develop their skills, expand their knowledge, and create meaningful impact. Through
          workshops, projects, events, and peer learning initiatives, Becults empowers students to
          transform ideas into action and ambition into achievement. Our mission is to build a
          supportive community where collective growth becomes the foundation for leadership,
          creativity, and excellence.
        </p>
      </div>
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8 md:px-0 mt-18">
        
        {sectionData.map((data, index) => (
          <motion.div
            key={data.title}
            className={data.className}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: `${index * 0.15}`,
              type: 'spring',
              stiffness: 320,
              damping: 70,
              mass: 1,
            }}
          >
            <div className="size-10 p-2 bg-indigo-600/20 border border-indigo-600/30 rounded">
              <img src={data.image} alt="" />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-base font-medium text-slate-200">
                {data.title}
              </h3>
              <p className="text-sm text-slate-400">{data.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
