import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Globe, FileSpreadsheet, Trash2, Bug, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Summary = {
  shape: [number, number];
  nulls: Record<string, number>;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

const ScrapingSection = () => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<Summary | null>(null);

  const scrapingSteps = useMemo(
    () => [
      { status: "complete", label: "Connexion API ATMO France", time: "OK" },
      { status: "complete", label: "Récupération des stations", time: "OK" },
      { status: "complete", label: "Scraping des mesures de polluants", time: "OK" },
      { status: "complete", label: "Enrichissement météo (Open Weather)", time: "OK" },
      { status: "complete", label: "Parsing et validation", time: "OK" },
      { status: "complete", label: "Sauvegarde parquet", time: "OK" },
    ],
    []
  );

  useEffect(() => {
    (async () => {
      try {
        const s = await fetch(`${API_URL}/eda/summary`).then((r) => r.json());
        setSummary(s);
      } catch (e) {
        toast({ title: "Scraping", description: "Statistiques indisponibles", variant: "destructive" });
      }
    })();
  }, [toast]);

  const stats = useMemo(() => {
    if (!summary) return null;
    const total = summary.shape[0];
    const cols = summary.shape[1];
    const missing = Object.values(summary.nulls || {}).reduce((a, b) => a + b, 0);
    return {
      totalScraped: total,
      duplicatesRemoved: 0,
      validRecords: total,
      errorRate: total && cols ? ((missing / (total * cols)) * 100).toFixed(1) + "%" : "0%",
    };
  }, [summary]);

  return (
    <section id="scraping" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Étape 1</span>
          </div>
          <h2 className="section-title">Web Scraping</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Collecte automatisée des données de qualité de l'air depuis les APIs officielles
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Terminal de scraping */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">scraping_air_quality.py</span>
              </div>
              <div className="p-4 font-mono text-sm space-y-2 bg-background/50">
                <p><span className="text-primary">import</span> requests</p>
                <p><span className="text-primary">import</span> pandas <span className="text-primary">as</span> pd</p>
                <p className="mt-4"></p>
                <p><span className="text-success">def</span> <span className="text-warning">scrape_atmo_data</span>(city):</p>
                <p className="pl-4">url = <span className="text-orange-400">f"https://atmo.fr/api/{'{city}'}"</span></p>
                <p className="pl-4">response = requests.get(url)</p>
                <p className="pl-4">data = response.json()</p>
                <p className="pl-4"><span className="text-primary">return</span> parse_pollutants(data)</p>
              </div>
            </Card>
          </motion.div>

          {/* Progression du scraping */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Progression du Scraping
              </h3>
              <div className="space-y-3">
                {scrapingSteps.map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-sm text-foreground">{step.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{step.time}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Statistiques */}
            {stats && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-card border-border/50 text-center">
                  <FileSpreadsheet className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.totalScraped}</p>
                  <p className="text-xs text-muted-foreground">Mesures collectées</p>
                </Card>
                <Card className="p-4 bg-card border-border/50 text-center">
                  <Trash2 className="w-8 h-8 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.duplicatesRemoved}</p>
                  <p className="text-xs text-muted-foreground">Doublons retirés</p>
                </Card>
                <Card className="p-4 bg-card border-border/50 text-center">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.validRecords}</p>
                  <p className="text-xs text-muted-foreground">Valides</p>
                </Card>
                <Card className="p-4 bg-card border-border/50 text-center">
                  <Bug className="w-8 h-8 text-destructive mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.errorRate}</p>
                  <p className="text-xs text-muted-foreground">Taux d'erreur estimé</p>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScrapingSection;
