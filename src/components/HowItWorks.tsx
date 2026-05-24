import { motion } from 'framer-motion';
import { Search, Brain, Share2 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Enter a username',
    desc: 'Paste any LeetCode username or profile URL.',
  },
  {
    icon: Brain,
    title: 'AI analyzes',
    desc: 'We crunch consistency, complexity, and authenticity.',
  },
  {
    icon: Share2,
    title: 'Showcase your talent',
    desc: 'Download a report card or share your profile link.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          How it <span className="gradient-text">works</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          From username to shareable proof of skill in under a minute.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 relative overflow-hidden group"
          >
            <div className="absolute top-3 right-4 text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
              {i + 1}
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
