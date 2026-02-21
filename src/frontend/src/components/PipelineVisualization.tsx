import { motion } from "framer-motion";
import { Database, Globe, Brain, BarChart3, Cpu, Rocket } from "lucide-react";

const steps = [
  {
    icon: Globe,
    title: "Web Scraping",
    description: "Collecte de données",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Database,
    title: "Data Sources",
    description: "Fichiers CSV",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: BarChart3,
    title: "EDA",
    description: "Analyse exploratoire",
    color: "from-indigo-400 to-purple-500",
  },
  {
    icon: Cpu,
    title: "Prétraitement",
    description: "Feature Engineering",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Brain,
    title: "ML Pipeline",
    description: "Entraînement modèle",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Rocket,
    title: "Déploiement",
    description: "API & Frontend",
    color: "from-rose-400 to-orange-500",
  },
];

const PipelineVisualization = () => {
  return (
    <div className="py-12">
      <div className="flex flex-wrap justify-center gap-4 md:gap-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-20 blur-xl rounded-2xl group-hover:opacity-40 transition-opacity`} />
              <div className="relative p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-sm">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 mx-auto`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-foreground text-center text-sm">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  {step.description}
                </p>
              </div>
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
                className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-primary/50 to-primary mx-2"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PipelineVisualization;
