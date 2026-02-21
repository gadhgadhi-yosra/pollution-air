// Dataset qualité de l'air pour le projet ML
export interface AirQualityData {
  id: number;
  pm25: number; // Particules fines (µg/m³)
  pm10: number; // Particules (µg/m³)
  no2: number; // Dioxyde d'azote (µg/m³)
  o3: number; // Ozone (µg/m³)
  co: number; // Monoxyde de carbone (mg/m³)
  so2: number; // Dioxyde de soufre (µg/m³)
  temperature: number; // Température (°C)
  humidity: number; // Humidité (%)
  wind_speed: number; // Vitesse du vent (km/h)
  traffic_density: number; // Densité du trafic (0-100)
  industrial_zone: boolean; // Zone industrielle
  green_spaces: number; // Espaces verts proches (%)
  ville: string;
  station: string;
  risk_level: number; // 0: Bon, 1: Modéré, 2: Mauvais pour sensibles, 3: Mauvais, 4: Très mauvais, 5: Dangereux
}

export const airQualityDataset: AirQualityData[] = [
  { id: 1, pm25: 12, pm10: 25, no2: 35, o3: 45, co: 0.4, so2: 8, temperature: 18, humidity: 65, wind_speed: 12, traffic_density: 45, industrial_zone: false, green_spaces: 35, ville: "Paris", station: "Tour Eiffel", risk_level: 1 },
  { id: 2, pm25: 35, pm10: 55, no2: 68, o3: 32, co: 0.9, so2: 18, temperature: 22, humidity: 55, wind_speed: 5, traffic_density: 85, industrial_zone: true, green_spaces: 10, ville: "Paris", station: "Périphérique Nord", risk_level: 3 },
  { id: 3, pm25: 8, pm10: 18, no2: 22, o3: 58, co: 0.3, so2: 5, temperature: 16, humidity: 70, wind_speed: 18, traffic_density: 25, industrial_zone: false, green_spaces: 55, ville: "Lyon", station: "Parc Tête d'Or", risk_level: 0 },
  { id: 4, pm25: 28, pm10: 42, no2: 52, o3: 38, co: 0.7, so2: 15, temperature: 20, humidity: 58, wind_speed: 8, traffic_density: 70, industrial_zone: true, green_spaces: 15, ville: "Lyon", station: "Part-Dieu", risk_level: 2 },
  { id: 5, pm25: 45, pm10: 72, no2: 78, o3: 28, co: 1.2, so2: 25, temperature: 25, humidity: 48, wind_speed: 4, traffic_density: 92, industrial_zone: true, green_spaces: 5, ville: "Marseille", station: "Port Autonome", risk_level: 4 },
  { id: 6, pm25: 15, pm10: 28, no2: 38, o3: 52, co: 0.5, so2: 10, temperature: 23, humidity: 62, wind_speed: 15, traffic_density: 40, industrial_zone: false, green_spaces: 40, ville: "Marseille", station: "Prado", risk_level: 1 },
  { id: 7, pm25: 10, pm10: 22, no2: 28, o3: 55, co: 0.4, so2: 7, temperature: 17, humidity: 68, wind_speed: 20, traffic_density: 30, industrial_zone: false, green_spaces: 50, ville: "Toulouse", station: "Jardin des Plantes", risk_level: 0 },
  { id: 8, pm25: 32, pm10: 48, no2: 58, o3: 35, co: 0.8, so2: 16, temperature: 21, humidity: 52, wind_speed: 6, traffic_density: 78, industrial_zone: true, green_spaces: 12, ville: "Toulouse", station: "Rocade", risk_level: 3 },
  { id: 9, pm25: 18, pm10: 32, no2: 42, o3: 48, co: 0.5, so2: 11, temperature: 19, humidity: 64, wind_speed: 14, traffic_density: 55, industrial_zone: false, green_spaces: 30, ville: "Bordeaux", station: "Centre-ville", risk_level: 1 },
  { id: 10, pm25: 22, pm10: 38, no2: 48, o3: 42, co: 0.6, so2: 13, temperature: 20, humidity: 60, wind_speed: 10, traffic_density: 62, industrial_zone: false, green_spaces: 25, ville: "Bordeaux", station: "Gare Saint-Jean", risk_level: 2 },
  { id: 11, pm25: 55, pm10: 85, no2: 92, o3: 22, co: 1.5, so2: 32, temperature: 28, humidity: 42, wind_speed: 3, traffic_density: 95, industrial_zone: true, green_spaces: 3, ville: "Paris", station: "A86 Croisement", risk_level: 5 },
  { id: 12, pm25: 6, pm10: 14, no2: 18, o3: 62, co: 0.2, so2: 4, temperature: 14, humidity: 75, wind_speed: 22, traffic_density: 15, industrial_zone: false, green_spaces: 65, ville: "Lyon", station: "Mont d'Or", risk_level: 0 },
  { id: 13, pm25: 25, pm10: 40, no2: 50, o3: 40, co: 0.6, so2: 14, temperature: 21, humidity: 56, wind_speed: 9, traffic_density: 68, industrial_zone: false, green_spaces: 20, ville: "Marseille", station: "La Canebière", risk_level: 2 },
  { id: 14, pm25: 38, pm10: 58, no2: 65, o3: 30, co: 1.0, so2: 20, temperature: 24, humidity: 50, wind_speed: 5, traffic_density: 82, industrial_zone: true, green_spaces: 8, ville: "Toulouse", station: "Zone Industrielle", risk_level: 3 },
  { id: 15, pm25: 14, pm10: 26, no2: 34, o3: 50, co: 0.4, so2: 9, temperature: 18, humidity: 66, wind_speed: 16, traffic_density: 42, industrial_zone: false, green_spaces: 38, ville: "Bordeaux", station: "Lac", risk_level: 1 },
  { id: 16, pm25: 20, pm10: 35, no2: 45, o3: 45, co: 0.5, so2: 12, temperature: 19, humidity: 62, wind_speed: 11, traffic_density: 58, industrial_zone: false, green_spaces: 28, ville: "Paris", station: "Bastille", risk_level: 2 },
  { id: 17, pm25: 42, pm10: 65, no2: 72, o3: 26, co: 1.1, so2: 22, temperature: 26, humidity: 45, wind_speed: 4, traffic_density: 88, industrial_zone: true, green_spaces: 6, ville: "Lyon", station: "Vénissieux", risk_level: 4 },
  { id: 18, pm25: 9, pm10: 20, no2: 25, o3: 56, co: 0.3, so2: 6, temperature: 15, humidity: 72, wind_speed: 19, traffic_density: 22, industrial_zone: false, green_spaces: 52, ville: "Marseille", station: "Calanques", risk_level: 0 },
  { id: 19, pm25: 30, pm10: 45, no2: 55, o3: 36, co: 0.8, so2: 17, temperature: 22, humidity: 54, wind_speed: 7, traffic_density: 75, industrial_zone: true, green_spaces: 14, ville: "Toulouse", station: "Blagnac", risk_level: 3 },
  { id: 20, pm25: 16, pm10: 30, no2: 40, o3: 48, co: 0.5, so2: 10, temperature: 18, humidity: 64, wind_speed: 13, traffic_density: 48, industrial_zone: false, green_spaces: 32, ville: "Bordeaux", station: "Chartrons", risk_level: 1 },
  { id: 21, pm25: 48, pm10: 75, no2: 82, o3: 24, co: 1.3, so2: 28, temperature: 27, humidity: 44, wind_speed: 3, traffic_density: 90, industrial_zone: true, green_spaces: 4, ville: "Paris", station: "Gennevilliers", risk_level: 4 },
  { id: 22, pm25: 11, pm10: 24, no2: 30, o3: 54, co: 0.4, so2: 8, temperature: 16, humidity: 68, wind_speed: 17, traffic_density: 35, industrial_zone: false, green_spaces: 45, ville: "Lyon", station: "Fourvière", risk_level: 1 },
  { id: 23, pm25: 36, pm10: 54, no2: 62, o3: 32, co: 0.9, so2: 19, temperature: 23, humidity: 52, wind_speed: 6, traffic_density: 80, industrial_zone: true, green_spaces: 10, ville: "Marseille", station: "Fos-sur-Mer", risk_level: 3 },
  { id: 24, pm25: 7, pm10: 16, no2: 20, o3: 60, co: 0.3, so2: 5, temperature: 14, humidity: 74, wind_speed: 21, traffic_density: 18, industrial_zone: false, green_spaces: 60, ville: "Toulouse", station: "Cité de l'Espace", risk_level: 0 },
  { id: 25, pm25: 24, pm10: 38, no2: 46, o3: 44, co: 0.6, so2: 13, temperature: 20, humidity: 58, wind_speed: 10, traffic_density: 64, industrial_zone: false, green_spaces: 22, ville: "Bordeaux", station: "Mériadeck", risk_level: 2 },
  { id: 26, pm25: 52, pm10: 80, no2: 88, o3: 20, co: 1.4, so2: 30, temperature: 29, humidity: 40, wind_speed: 2, traffic_density: 94, industrial_zone: true, green_spaces: 2, ville: "Paris", station: "Porte de Vincennes", risk_level: 5 },
  { id: 27, pm25: 13, pm10: 27, no2: 36, o3: 52, co: 0.4, so2: 9, temperature: 17, humidity: 66, wind_speed: 15, traffic_density: 38, industrial_zone: false, green_spaces: 42, ville: "Lyon", station: "Presqu'île", risk_level: 1 },
  { id: 28, pm25: 40, pm10: 62, no2: 70, o3: 28, co: 1.0, so2: 21, temperature: 25, humidity: 48, wind_speed: 5, traffic_density: 84, industrial_zone: true, green_spaces: 7, ville: "Marseille", station: "L'Estaque", risk_level: 4 },
  { id: 29, pm25: 19, pm10: 33, no2: 43, o3: 46, co: 0.5, so2: 11, temperature: 19, humidity: 63, wind_speed: 12, traffic_density: 52, industrial_zone: false, green_spaces: 30, ville: "Toulouse", station: "Capitole", risk_level: 2 },
  { id: 30, pm25: 5, pm10: 12, no2: 15, o3: 65, co: 0.2, so2: 3, temperature: 13, humidity: 78, wind_speed: 24, traffic_density: 10, industrial_zone: false, green_spaces: 70, ville: "Bordeaux", station: "Forêt des Landes", risk_level: 0 },
];

// Labels des niveaux de risque
export const riskLabels = [
  { level: 0, label: "Bon", color: "success" },
  { level: 1, label: "Modéré", color: "info" },
  { level: 2, label: "Mauvais pour sensibles", color: "warning" },
  { level: 3, label: "Mauvais", color: "destructive" },
  { level: 4, label: "Très mauvais", color: "destructive" },
  { level: 5, label: "Dangereux", color: "destructive" },
];

// Statistiques du dataset
export const datasetStats = {
  totalRecords: 30,
  features: 13,
  targetVariable: "risk_level",
  numericalFeatures: ["pm25", "pm10", "no2", "o3", "co", "so2", "temperature", "humidity", "wind_speed", "traffic_density", "green_spaces"],
  categoricalFeatures: ["industrial_zone", "ville", "station"],
  missingValues: 0,
  pm25Range: { min: 5, max: 55 },
  riskDistribution: { bon: 5, modere: 7, sensibles: 6, mauvais: 6, tresMauvais: 4, dangereux: 2 },
};

// Données pour les graphiques EDA
export const riskDistribution = [
  { range: "Bon (0)", count: 5 },
  { range: "Modéré (1)", count: 7 },
  { range: "Sensibles (2)", count: 6 },
  { range: "Mauvais (3)", count: 6 },
  { range: "Très Mauvais (4)", count: 4 },
  { range: "Dangereux (5)", count: 2 },
];

export const avgPollutionByCity = [
  { ville: "Paris", avgPM25: 29.2, avgRisk: 2.8 },
  { ville: "Lyon", avgPM25: 18.5, avgRisk: 1.5 },
  { ville: "Marseille", avgPM25: 27.8, avgRisk: 2.3 },
  { ville: "Toulouse", avgPM25: 22.3, avgRisk: 1.8 },
  { ville: "Bordeaux", avgPM25: 16.8, avgRisk: 1.4 },
];

export const pm25VsRisk = airQualityDataset.map(d => ({
  pm25: d.pm25,
  risk_level: d.risk_level,
  ville: d.ville,
}));

export const featureCorrelations = [
  { feature: "PM2.5", correlation: 0.95 },
  { feature: "PM10", correlation: 0.92 },
  { feature: "NO2", correlation: 0.88 },
  { feature: "Trafic", correlation: 0.85 },
  { feature: "Zone industrielle", correlation: 0.78 },
  { feature: "Espaces verts", correlation: -0.72 },
  { feature: "Vitesse vent", correlation: -0.65 },
];

// Résultats du modèle
export const modelResults = {
  model: "XGBoost Classifier",
  trainScore: 0.96,
  testScore: 0.89,
  accuracy: 0.89,
  precision: 0.87,
  recall: 0.85,
  f1_score: 0.86,
  hyperparameters: {
    n_estimators: 150,
    max_depth: 8,
    learning_rate: 0.05,
    subsample: 0.9,
  },
};

export const featureImportance = [
  { feature: "PM2.5", importance: 0.28 },
  { feature: "PM10", importance: 0.18 },
  { feature: "NO2", importance: 0.15 },
  { feature: "Trafic", importance: 0.12 },
  { feature: "Zone industrielle", importance: 0.10 },
  { feature: "Espaces verts", importance: 0.08 },
  { feature: "Vitesse vent", importance: 0.05 },
  { feature: "Température", importance: 0.04 },
];

export const crossValidationScores = [0.87, 0.91, 0.88, 0.90, 0.89];

// Matrice de confusion
export const confusionMatrix = [
  [4, 1, 0, 0, 0, 0],
  [1, 5, 1, 0, 0, 0],
  [0, 1, 4, 1, 0, 0],
  [0, 0, 1, 5, 0, 0],
  [0, 0, 0, 1, 3, 0],
  [0, 0, 0, 0, 0, 2],
];

// Données de web scraping simulées
export const scrapingStats = {
  source: "ATMO France & Open Weather API",
  totalScraped: 2450,
  validRecords: 2380,
  duplicatesRemoved: 52,
  errorRate: "1.8%",
  scrapingTime: "6m 18s",
  lastUpdate: "2026-02-03",
};
