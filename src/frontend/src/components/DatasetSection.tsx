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
import { airQualityDataset, datasetStats, riskLabels } from "@/data/airQualityDataset";

const DatasetSection = () => {
  const displayData = airQualityDataset.slice(0, 8);

  const downloadCSV = () => {
    const headers = Object.keys(airQualityDataset[0]).join(",");
    const rows = airQualityDataset.map((row) =>
      Object.values(row).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dataset_air_quality.csv";
    a.click();
  };

  const getRiskBadge = (level: number) => {
    const risk = riskLabels[level];
    const colors: { [key: string]: string } = {
      success: "bg-green-500/20 text-green-500 border-green-500/30",
      info: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      warning: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      destructive: "bg-red-500/20 text-red-500 border-red-500/30",
    };
    return (
      <Badge variant="outline" className={colors[risk.color]}>
        {risk.label}
      </Badge>
    );
  };

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
            <p className="text-xs text-muted-foreground">Stations</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <p className="text-2xl font-bold text-foreground">{datasetStats.numericalFeatures.length}</p>
            <p className="text-xs text-muted-foreground">Variables numériques</p>
          </Card>
          <Card className="p-4 bg-card border-border/50 text-center">
            <p className="text-2xl font-bold text-foreground">{datasetStats.categoricalFeatures.length}</p>
            <p className="text-xs text-muted-foreground">Variables catégorielles</p>
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
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">PM2.5</TableHead>
                    <TableHead className="text-muted-foreground">PM10</TableHead>
                    <TableHead className="text-muted-foreground">NO2</TableHead>
                    <TableHead className="text-muted-foreground">Temp</TableHead>
                    <TableHead className="text-muted-foreground">Trafic</TableHead>
                    <TableHead className="text-muted-foreground">Ville</TableHead>
                    <TableHead className="text-muted-foreground">Station</TableHead>
                    <TableHead className="text-muted-foreground text-right">Risque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((row) => (
                    <TableRow key={row.id} className="border-border/50 hover:bg-muted/30">
                      <TableCell className="font-mono text-primary">{row.id}</TableCell>
                      <TableCell>{row.pm25} µg/m³</TableCell>
                      <TableCell>{row.pm10} µg/m³</TableCell>
                      <TableCell>{row.no2} µg/m³</TableCell>
                      <TableCell>{row.temperature}°C</TableCell>
                      <TableCell>{row.traffic_density}%</TableCell>
                      <TableCell>{row.ville}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{row.station}</TableCell>
                      <TableCell className="text-right">
                        {getRiskBadge(row.risk_level)}
                      </TableCell>
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
              {riskLabels.map((risk) => (
                <div key={risk.level} className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">{risk.level}:</span>
                  {getRiskBadge(risk.level)}
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
