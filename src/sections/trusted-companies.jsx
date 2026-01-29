import SectionTitle from '../components/section-title';
import { motion } from 'framer-motion';
import Team from '../components/Team';
export default function TrustedCompanies() {
  return (
    <section className="flex flex-col items-center">
      <SectionTitle
        title="Our Team"
        description="People behind this tech community."
      />
      <Team/>
    </section>
  );
}
