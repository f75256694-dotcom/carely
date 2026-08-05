"use client";

import { motion } from "framer-motion";
import { ChefHat, Heart, Monitor, ShoppingBag, Users, Wifi } from "lucide-react";

const FEATURES = [
  { icon: ShoppingBag, title: "Einkaufen & Erledigungen", description: "Herzliche Unterstützung bei Lebensmitteln, Apotheken und kleinen Besorgungen." },
  { icon: ChefHat, title: "Kochen & Mahlzeiten", description: "Gemeinsam warme Mahlzeiten zubereiten, mit Respekt für persönliche Vorlieben." },
  { icon: Heart, title: "Gemeinsam durch den Alltag", description: "Zeit für Gespräche, Spaziergänge und liebevolle Momente in vertrauter Gesellschaft." },
  { icon: Monitor, title: "Technik mit Geduld", description: "Ruhevolle Hilfe bei Handy, Tablet, Videoanrufen und digitalen Fragen." },
  { icon: Users, title: "Familie verbunden halten", description: "Fotos, Updates und Nähe für alle, die einander wichtig sind." },
  { icon: Wifi, title: "Sicher informiert", description: "Echtzeit-Updates, damit Sie sich jederzeit gut aufgehoben fühlen." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-sage-600 uppercase tracking-wider mb-4">Was wir bieten</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Alltagshilfe mit Herz<br />
            <span className="text-gradient-sage">für ein gutes Miteinander</span>
          </h2>
          <p className="text-warm-500 text-lg">
            Carely bietet ausschließlich nicht-medizinische Unterstützung. Unsere geprüften Helfer:innen begleiten den Alltag mit Wärme und Verlässlichkeit.
          </p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants} className="group p-8 rounded-2xl bg-warm-50 border border-warm-200 hover:border-sage-200 hover:shadow-soft transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center mb-5 group-hover:bg-sage-200 transition-colors">
                <feature.icon className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-warm-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
