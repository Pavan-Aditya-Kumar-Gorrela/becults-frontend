import SectionTitle from '../components/section-title';
import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';
export default function SubscribeNewsletter() {
  return (
    <section className="flex flex-col items-center">
      <SectionTitle
        title="Common FAQ"
        description="A bunch of questions commonly asked by many people"
      />
      <br />
      <FAQ />
    </section>
  );
}
