import { motion } from "framer-motion";
import { Cpu, ArrowRight, Check, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const preprocessingSteps = [
  {
    title: "Gestion des valeurs manquantes",
    description: "Imputation par interpolation temporelle pour les polluants",
    code: "df.interpolate(method='time')",
    status: "complete",
  },
  {
    title: "Normalisation des polluants",
    description: "Min-Max Scaling pour PM2.5, PM10, NO2, O3, CO, SO2",
    code: "MinMaxScaler().fit_transform(pollutants)",
    status: "complete",
  },
  {
    title: "Encodage des variables catégorielles",
    description: "One-Hot Encoding pour ville et Label Encoding pour zone industrielle",
    code: "pd.get_dummies(df, columns=['ville'])",
    status: "complete",
  },
  {
    title: "Feature Engineering",
    description: "Création de l'indice AQI et ratio polluants/météo",
    code: "df['aqi'] = calculate_aqi(pm25, pm10, o3)",
    status: "complete",
  },
  {
    title: "Équilibrage des classes",
    description: "SMOTE pour gérer le déséquilibre des niveaux de risque",
    code: "SMOTE().fit_resample(X, y)",
    status: "complete",
  },
  {
    title: "Split Train/Test",
    description: "80% entraînement, 20% test avec stratification",
    code: "train_test_split(X, y, stratify=y)",
    status: "complete",
  },
];

const PreprocessingSection = () => {
  return (
    <section id="preprocessing" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Étape 3</span>
          </div>
          <h2 className="section-title">Prétraitement & Feature Engineering</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Préparation des données de pollution pour l'entraînement du modèle
          </p>
        </motion.div>

        <div className="relative">
          {/* Ligne de connexion */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent hidden md:block" />

          <div className="space-y-6">
            {preprocessingSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-card border-border/50 ml-0 md:ml-16 relative">
                  {/* Point de connexion */}
                  <div className="absolute -left-[4.5rem] top-1/2 -translate-y-1/2 hidden md:flex items-center">
                    <div className="w-4 h-4 rounded-full bg-primary glow-primary" />
                    <div className="w-8 h-0.5 bg-primary" />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Settings2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1" />
                    
                    <div className="flex items-center gap-4">
                      <code className="text-xs bg-muted/50 px-3 py-2 rounded font-mono text-primary">
                        {step.code}
                      </code>
                      <div className="p-1 rounded-full bg-success/20">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Schéma de transformation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="p-8 bg-card border-border/50">
            <h3 className="font-semibold text-foreground mb-6 text-center">Pipeline de Transformation</h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: "Données Brutes", count: "2,450 mesures" },
                { label: "Nettoyage", count: "2,380 valides" },
                { label: "Encoding", count: "30 × 18 features" },
                { label: "SMOTE", count: "Classes équilibrées" },
                { label: "Prêt pour ML", count: "X_train, X_test" },
              ].map((stage, index) => (
                <div key={stage.label} className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="px-4 py-3 rounded-lg bg-muted/50 border border-border/50">
                      <p className="text-sm font-medium text-foreground">{stage.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stage.count}</p>
                    </div>
                  </div>
                  {index < 4 && (
                    <ArrowRight className="w-5 h-5 text-primary hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PreprocessingSection;
