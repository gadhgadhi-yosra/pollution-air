import { motion } from "framer-motion";
import { Brain, Target, Activity, Award, TrendingUp, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { modelResults, featureImportance, crossValidationScores } from "@/data/airQualityDataset";

const ModelingSection = () => {
  const cvData = crossValidationScores.map((score, i) => ({
    fold: `Fold ${i + 1}`,
    score: score,
  }));

  return (
    <section id="modeling" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Étape 4</span>
          </div>
          <h2 className="section-title">Modélisation & MLflow</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Entraînement du modèle XGBoost Classifier avec suivi des expériences
          </p>
        </motion.div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50 text-center gradient-border">
              <Target className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">{(modelResults.accuracy * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50 text-center">
              <Activity className="w-8 h-8 text-success mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">{(modelResults.precision * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Precision</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50 text-center">
              <Award className="w-8 h-8 text-info mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">{(modelResults.recall * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">Recall</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50 text-center">
              <TrendingUp className="w-8 h-8 text-warning mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground">{(modelResults.f1_score * 100).toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">F1 Score</p>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feature Importance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Importance des Features</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis dataKey="feature" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={100} />
                    <Tooltip
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="importance" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Cross Validation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Cross-Validation (5-Fold)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cvData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="fold" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis domain={[0.8, 1]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Score']}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Score moyen: {(crossValidationScores.reduce((a, b) => a + b, 0) / crossValidationScores.length * 100).toFixed(1)}%
              </p>
            </Card>
          </motion.div>
        </div>

        {/* Hyperparamètres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="p-6 bg-card border-border/50">
            <h3 className="font-semibold text-foreground mb-4">Hyperparamètres du Modèle</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(modelResults.hyperparameters).map(([key, value]) => (
                <div key={key} className="p-4 rounded-lg bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{key.replace('_', ' ')}</p>
                  <p className="text-xl font-mono font-bold text-primary mt-1">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ModelingSection;
