import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Database, PieChart, Wind, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
} from "recharts";
import {
  datasetStats,
  riskDistribution,
  avgPollutionByCity,
  pm25VsRisk,
  featureCorrelations,
} from "@/data/airQualityDataset";

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#f97316", "#ef4444", "#dc2626"];

const EDASection = () => {
  return (
    <section id="eda" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Étape 2</span>
          </div>
          <h2 className="section-title">Analyse Exploratoire (EDA)</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Exploration et visualisation des données de pollution atmosphérique
          </p>
        </motion.div>

        {/* Stats du dataset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 bg-card border-border/50 text-center">
            <Database className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{datasetStats.totalRecords}</p>
            <p className="text-xs text-muted-foreground">Stations mesurées</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <BarChart3 className="w-6 h-6 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{datasetStats.features}</p>
            <p className="text-xs text-muted-foreground">Features</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <Wind className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{datasetStats.pm25Range.max} µg/m³</p>
            <p className="text-xs text-muted-foreground">PM2.5 max</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <AlertTriangle className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{datasetStats.missingValues}</p>
            <p className="text-xs text-muted-foreground">Valeurs manquantes</p>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Distribution des niveaux de risque */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Distribution des Niveaux de Risque</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {riskDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* PM2.5 moyen par ville */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">PM2.5 Moyen par Ville</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={avgPollutionByCity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} unit=" µg/m³" />
                    <YAxis dataKey="ville" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={80} />
                    <Tooltip
                      formatter={(value: number) => [`${value.toFixed(1)} µg/m³`, 'PM2.5 moyen']}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="avgPM25" radius={[0, 4, 4, 0]}>
                      {avgPollutionByCity.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.avgPM25 > 25 ? "#ef4444" : entry.avgPM25 > 15 ? "#eab308" : "#22c55e"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* PM2.5 vs Niveau de risque */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Corrélation PM2.5 / Risque</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="pm25" name="PM2.5" unit=" µg/m³" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis dataKey="risk_level" name="Risque" tick={{ fill: '#9ca3af', fontSize: 12 }} domain={[0, 5]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Scatter name="Mesures" data={pm25VsRisk} fill="#06b6d4" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Corrélations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Corrélation avec le Risque</h3>
              <div className="space-y-4">
                {featureCorrelations.map((feat, index) => (
                  <div key={feat.feature}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{feat.feature}</span>
                      <span className={`font-mono ${feat.correlation < 0 ? 'text-success' : 'text-primary'}`}>
                        {feat.correlation > 0 ? '+' : ''}{feat.correlation.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.abs(feat.correlation) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-full rounded-full ${feat.correlation < 0 ? 'bg-success' : 'bg-primary'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EDASection;
