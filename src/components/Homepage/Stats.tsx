import { motion } from "motion/react";

const stats = [
  { label: "Total Users", value: "15,000+" },
  { label: "InterViews Conducted", value: "48,000+" },
  { label: "Expert Mentors", value: "500+" },
  { label: "Success Rate", value: "94%" },
];

export default function Stats() {
  return (
    <section className="bg-brand-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-4xl font-extrabold text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-brand-300 font-medium uppercase tracking-widest text-xs">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
