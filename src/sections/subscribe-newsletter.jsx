import SectionTitle from '../components/section-title';
import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';
export default function SubscribeNewsletter() {
  return (
    <section className="flex flex-col items-center">
      <SectionTitle
        title="Common FAQ"
        description="A visual collection of our most recent works - each piece crafted with intention, emotion, and style."
      />
      <br />
      <FAQ />
    </section>
  );
}
