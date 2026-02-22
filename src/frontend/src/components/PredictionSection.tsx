import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Calculator, MapPin, Wind, Factory, TreePine, Car, Thermometer, Droplets } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { riskLabels } from "@/data/airQualityDataset";

const cities = ["Paris", "Lyon", "Marseille", "Toulouse", "Bordeaux"];
const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

const PredictionSection = () => {
  const { toast } = useToast();
  const [prediction, setPrediction] = useState<{ level: number; label: string; color: string; value?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pm25: 20,
    pm10: 35,
    no2: 40,
    o3: 45,
    co: 0.5,
    so2: 10,
    temperature: 18,
    humidity: 60,
    wind_speed: 12,
    traffic_density: 50,
    industrial_zone: false,
    green_spaces: 30,
    ville: "Paris",
  });

  const handlePredict = async () => {
    setIsLoading(true);
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    try {
      const now = new Date();
      const payload = {
        pm25: formData.pm25,
        pm10: formData.pm10,
        no2: formData.no2,
        o3: formData.o3,
        co: formData.co,
        so2: formData.so2,
        temperature: formData.temperature,
        humidity: formData.humidity,
        wind_speed: formData.wind_speed,
        traffic_density: formData.traffic_density,
        green_spaces: formData.green_spaces,
        industrial_zone: formData.industrial_zone,
        ville: formData.ville,
        hour: now.getHours(),
        dayofweek: now.getDay(),
        month: now.getMonth() + 1,
      };

      const res = await fetch(`${API_URL}/predict/full`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const predValue = Number(data.prediction);
      const riskLevel = clamp(Math.round(predValue / 20), 0, 5);
      const risk = riskLabels[riskLevel];

      setPrediction({
        level: riskLevel,
        label: risk.label,
        color: risk.color,
        value: predValue,
      });

      toast({
        title: "Prédiction du modèle",
        description: `Score: ${predValue.toFixed(2)} (niveau ${risk.label})`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir la prédiction (API). Vérifie que l'API tourne.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: number) => {
    const colors = [
      "from-green-500 to-green-400",
      "from-blue-500 to-blue-400", 
      "from-yellow-500 to-yellow-400",
      "from-orange-500 to-orange-400",
      "from-red-500 to-red-400",
      "from-red-700 to-red-600",
    ];
    return colors[level] || colors[0];
  };

  return (
    <section id="prediction" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Étape 5</span>
          </div>
          <h2 className="section-title">Prédiction du Risque</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Utilisez le modèle entraîné pour prédire le niveau de risque de pollution de l'air
          </p>
        </div>

        <div>
          <Card className="p-8 bg-card border-border/50 gradient-border">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Formulaire */}
              <div className="space-y-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Wind className="w-5 h-5 text-primary" />
                  Paramètres de mesure
                </h3>

                {/* Polluants */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pm25">PM2.5 (µg/m³)</Label>
                    <Input
                      id="pm25"
                      type="number"
                      value={formData.pm25}
                      onChange={(e) => setFormData({ ...formData, pm25: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pm10">PM10 (µg/m³)</Label>
                    <Input
                      id="pm10"
                      type="number"
                      value={formData.pm10}
                      onChange={(e) => setFormData({ ...formData, pm10: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="no2">NO2 (µg/m³)</Label>
                    <Input
                      id="no2"
                      type="number"
                      value={formData.no2}
                      onChange={(e) => setFormData({ ...formData, no2: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="o3">O3 (µg/m³)</Label>
                    <Input
                      id="o3"
                      type="number"
                      value={formData.o3}
                      onChange={(e) => setFormData({ ...formData, o3: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="co">CO (mg/m³)</Label>
                    <Input
                      id="co"
                      type="number"
                      step="0.1"
                      value={formData.co}
                      onChange={(e) => setFormData({ ...formData, co: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="so2">SO2 (µg/m³)</Label>
                    <Input
                      id="so2"
                      type="number"
                      value={formData.so2}
                      onChange={(e) => setFormData({ ...formData, so2: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>

                {/* Météo et environnement */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature" className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3" /> Température (°C)
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity" className="flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> Humidité (%)
                    </Label>
                    <Input
                      id="humidity"
                      type="number"
                      value={formData.humidity}
                      onChange={(e) => setFormData({ ...formData, humidity: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wind">Vent (km/h)</Label>
                    <Input
                      id="wind"
                      type="number"
                      value={formData.wind_speed}
                      onChange={(e) => setFormData({ ...formData, wind_speed: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ville</Label>
                    <Select value={formData.ville} onValueChange={(value) => setFormData({ ...formData, ville: value })}>
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="traffic" className="flex items-center gap-1">
                      <Car className="w-3 h-3" /> Densité trafic (0-100)
                    </Label>
                    <Input
                      id="traffic"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.traffic_density}
                      onChange={(e) => setFormData({ ...formData, traffic_density: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="green" className="flex items-center gap-1">
                      <TreePine className="w-3 h-3" /> Espaces verts (%)
                    </Label>
                    <Input
                      id="green"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.green_spaces}
                      onChange={(e) => setFormData({ ...formData, green_spaces: Number(e.target.value) })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.industrial_zone}
                    onCheckedChange={(checked) => setFormData({ ...formData, industrial_zone: checked })}
                  />
                  <Label className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-muted-foreground" />
                    Zone industrielle
                  </Label>
                </div>

                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Calculator className="w-4 h-4" />
                      </motion.div>
                      Analyse en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Prédire le risque
                    </span>
                  )}
                </Button>
              </div>

              {/* Résultat */}
              <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-muted/20 border border-border/50">
                {prediction ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center w-full"
                  >
                    <Wind className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Niveau de risque</p>
                    <div className={`inline-block px-6 py-3 rounded-xl bg-gradient-to-r ${getRiskColor(prediction.level)} mb-4`}>
                      <p className="text-3xl font-bold text-white">
                        {prediction.label}
                      </p>
                    </div>
                    <p className="text-5xl font-bold gradient-text mb-2">
                      {prediction.level}/5
                    </p>
                    {prediction.value !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        Valeur prédite : <span className="font-semibold text-foreground">{prediction.value.toFixed(2)}</span>
                      </p>
                    )}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.ville} • PM2.5: {formData.pm25} µg/m³</span>
                    </div>
                    
                    {/* Barre de risque */}
                    <div className="mt-6 w-full">
                      <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                        <div className="h-full bg-green-500 flex-1" />
                        <div className="h-full bg-blue-500 flex-1" />
                        <div className="h-full bg-yellow-500 flex-1" />
                        <div className="h-full bg-orange-500 flex-1" />
                        <div className="h-full bg-red-500 flex-1" />
                        <div className="h-full bg-red-700 flex-1" />
                      </div>
                      <div 
                        className="relative -mt-1"
                        style={{ marginLeft: `${(prediction.level / 5) * 100}%` }}
                      >
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white transform -translate-x-1/2" />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Wind className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Renseignez les paramètres</p>
                    <p className="text-sm mt-1">pour obtenir une prédiction</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PredictionSection;
