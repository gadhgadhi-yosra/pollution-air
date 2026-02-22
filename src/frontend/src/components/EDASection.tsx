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
  LineChart,
  Line,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Summary = {
  shape: [number, number];
  columns: string[];
  describe: Record<string, Record<string, number>>;
  nulls: Record<string, number>;
};

type TS = { datetime: string[]; value: number[] };

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

const COLORS = ["#22c55e", "#3b82f6", "#eab308", "#f97316", "#ef4444", "#dc2626"];

const EDASection = () => {
  const { toast } = useToast();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [timeseries, setTimeseries] = useState<TS | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await fetch(`${API_URL}/eda/summary`).then((r) => r.json());
        const ts = await fetch(`${API_URL}/eda/timeseries?limit=300`).then((r) => r.json());
        setSummary(s);
        setTimeseries(ts);
      } catch (e) {
        toast({ title: "EDA indisponible", description: "Impossible de charger les stats", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  // distribution approximative en 6 bins sur la série "value"
  const riskDistribution =
    timeseries?.value?.length
      ? (() => {
          const bins = [0, 1, 2, 3, 4, 5].map((b) => ({ range: `${b}`, count: 0 }));
          timeseries.value.forEach((v) => {
            const level = Math.max(0, Math.min(5, Math.round(v / 20)));
            bins[level].count += 1;
          });
          return bins;
        })()
      : [];

  const datasetStats = summary
    ? {
        totalRecords: summary.shape[0],
        features: summary.shape[1],
        pm25Range: { max: summary.describe?.pm25?.max ?? 0 },
        missingValues: Object.values(summary.nulls || {}).reduce((a, b) => a + b, 0),
      }
    : null;

  if (loading) return null;
  if (!summary || !timeseries) return null;
  return (
    <section id="eda" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Étape 2</span>
          </div>
          <h2 className="section-title">Analyse Exploratoire (EDA)</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Exploration et visualisation des données de pollution atmosphérique
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Distribution des Niveaux (bins)</h3>
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
          </div>

          <div>
            <Card className="p-6 bg-card border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Série temporelle (value)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeseries.datetime.map((d, i) => ({ datetime: d, value: timeseries.value[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="datetime" tick={{ fill: '#9ca3af', fontSize: 10 }} hide />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EDASection;
