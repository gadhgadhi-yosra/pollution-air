import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Download, Eye, Table, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

type SampleRow = Record<string, any> & { risk_level?: number };
type Summary = {
  shape: [number, number];
  columns: string[];
  nulls: Record<string, number>;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

const DatasetSection = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<SampleRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, sample] = await Promise.all([
          fetch(`${API_URL}/eda/summary`).then((r) => r.json()),
          fetch(`${API_URL}/eda/sample?limit=80`).then((r) => r.json()),
        ]);
        setSummary(s);
        setRows(sample.rows || []);
      } catch (e) {
        toast({ title: "Dataset indisponible", description: "Impossible de charger les données", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const datasetStats = useMemo(() => {
    if (!summary) return null;
    return {
      totalRecords: summary.shape[0],
      numerical: summary.columns.length,
      missingValues: Object.values(summary.nulls || {}).reduce((a, b) => a + b, 0),
    };
  }, [summary]);

  const displayData = rows.slice(0, 10);

  const headers = useMemo(() => {
    if (displayData.length === 0) return [];
    // ordre lisible
    const preferred = ["pm25", "pm10", "no2", "temperature", "traffic_density", "ville", "city", "station", "datetime", "risk_level"];
    const available = Object.keys(displayData[0]);
    const ordered = preferred.filter((c) => available.includes(c));
    const rest = available.filter((c) => !ordered.includes(c));
    return [...ordered, ...rest];
  }, [displayData]);

  const downloadCSV = () => {
    if (!rows.length) return;
    const cols = headers.length ? headers : Object.keys(rows[0]);
    const csvRows = rows.map((row) => cols.map((c) => row[c] ?? "").join(","));
    const csv = [cols.join(","), ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "features_sample.csv";
    a.click();
  };

  const riskLegend: { level: number; label: string; classes: string }[] = [
    { level: 0, label: "Bon", classes: "bg-green-500/20 text-green-500 border-green-500/30" },
    { level: 1, label: "Modéré", classes: "bg-blue-500/20 text-blue-500 border-blue-500/30" },
    { level: 2, label: "Élevé", classes: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
    { level: 3, label: "Mauvais", classes: "bg-orange-500/20 text-orange-500 border-orange-500/30" },
    { level: 4, label: "Très mauvais", classes: "bg-red-500/20 text-red-500 border-red-500/30" },
    { level: 5, label: "Critique", classes: "bg-rose-500/20 text-rose-500 border-rose-500/30" },
  ];

  const getRiskBadge = (level: number = 0) => {
    const risk = riskLegend.find((r) => r.level === level) ?? riskLegend[0];
    return (
      <Badge variant="outline" className={risk.classes}>
        {risk.label}
      </Badge>
    );
  };

  if (loading) return null;
  if (!datasetStats || !rows.length) return null;

  return (
    <section id="dataset" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <FileSpreadsheet className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Dataset</span>
          </div>
          <h2 className="section-title">Jeu de Données</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Aperçu des données de qualité de l'air collectées et nettoyées
          </p>
        </motion.div>

        {/* Infos dataset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="p-4 bg-card border-border/50 text-center">
            <p className="text-2xl font-bold text-foreground">{datasetStats.totalRecords}</p>
            <p className="text-xs text-muted-foreground">Lignes</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <p className="text-2xl font-bold text-foreground">{datasetStats.numerical}</p>
            <p className="text-xs text-muted-foreground">Colonnes</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <p className="text-2xl font-bold text-foreground">
              {Object.keys(summary?.nulls || {}).length}
            </p>
            <p className="text-xs text-muted-foreground">Champs suivis</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <p className="text-2xl font-bold text-foreground">{datasetStats.missingValues}</p>
            <p className="text-xs text-muted-foreground">Valeurs manquantes</p>
          </Card>
        </motion.div>

        {/* Table des données */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 bg-card border-border/50 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Table className="w-5 h-5 text-primary" />
                Aperçu du Dataset
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger CSV
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <UITable>
                <TableHeader>
                  <TableRow className="border-border/50">
                    {headers.map((h) => (
                      <TableHead key={h} className="text-muted-foreground">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((row, idx) => (
                    <TableRow key={idx} className="border-border/50 hover:bg-muted/30">
                      {headers.map((h) => (
                        <TableCell key={h} className="text-sm">
                          {h === "risk_level" ? getRiskBadge(row[h] ?? 0) : String(row[h] ?? "")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </UITable>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Affichage de 8 sur {datasetStats.totalRecords} stations</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Légende des niveaux de risque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="p-6 bg-card border-border/50">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wind className="w-5 h-5 text-primary" />
              Échelle des Niveaux de Risque (AQI)
            </h3>
            <div className="flex flex-wrap gap-3">
              {riskLegend.map((risk) => (
                <div key={risk.level} className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">{risk.level}:</span>
                  <Badge variant="outline" className={risk.classes}>
                    {risk.label}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default DatasetSection;
