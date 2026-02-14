# Air Quality Risk Prediction

Projet personnel inspiré de l'architecture (scraping → pipeline ML → FastAPI → React → Docker).

## Démarrage rapide
1. Créer un environnement Python 3.11.
2. `pip install -r requirements.txt`
3. Copier `.env.example` en `.env` et renseigner les clés :
   - `OPENAQ_API_KEY` (obligatoire pour l'API v3, gratuite sur platform.openaq.org)
   - `AIRNOW_API_KEY` si vous collectez aux USA.
4. Récupérer des données OpenAQ : `python -m src.scraping.save_openaq_latest` (par défaut pays FR).  
   Note : l’API v3 nécessite une clé et la récupération passe par les capteurs trouvés pour la ville/pays/paramètre.
5. Construire les features : `python -m src.features.build_features openaq_<timestamp>.parquet`.
6. Entraîner un modèle : `python -m src.models.train` → notez le `MODEL_URI` MLflow.
7. Lancer l'API : `MODEL_URI="runs:/.../model" uvicorn src.api.main:app --reload`.

### Entraîner plusieurs modèles (RF, XGBoost, LightGBM)
```bash
python -m src.models.train_multi  # autodétecte les features (lags dispo, temps, météo si présentes)
# ou sur le dataset externe :
python -m src.models.train_multi --file data/features/features_air_quality.parquet
```
Chaque modèle est loggué dans MLflow avec son `MODEL_URI` (affiché en sortie).

### Tester l'API
- Health check : `curl http://127.0.0.1:8000/health`
- Prédiction (POST) :
  ```bash
  curl -X POST http://127.0.0.1:8000/predict \
    -H "Content-Type: application/json" \
    -d '{"hour":12,"dayofweek":4,"month":2,"value_lag_1":12.3,"value_lag_3":11.8,"value_lag_24":15.0}'
  ```

## Structure
- `src/scraping/`: clients OpenAQ v3 & AirNow, script de collecte.
- `src/features/`: nettoyage, features temporelles, lags.
- `src/features/build_features_air_quality.py`: features pour `data/raw/air_quality_clean.csv` (PM2.5 + météo/gaz, lags 1/3/7 par ville).
- `src/models/`: entraînement + tracking MLflow.
- `src/api/`: FastAPI exposant `/predict`.
- `docker/`: Dockerfile de l'API.
- `docker-compose.yml`: lance l'API en conteneur (monte data/models).
- `data/`: sous-dossiers raw/processed/features.
- `notebooks/`: EDA rapide (`python -m notebooks.eda` génère quelques graphiques dans notebooks/).

## Scénario dataset externe (air_quality_clean.csv)
1. Copier le CSV dans `data/raw/` (déjà placé : `data/raw/air_quality_clean.csv`).
2. Construire les features :  
   `python -m src.features.build_features_air_quality`  
   → écrit `data/features/features_air_quality.parquet`
3. Entraîner plusieurs modèles dessus :  
   `python -m src.models.train_multi --file data/features/features_air_quality.parquet`
4. Tester EDA sur ce dataset :  
   `python -m notebooks.eda --raw "data/raw/air_quality_clean.csv" --features data/features/features_air_quality.parquet`

## Prochaines étapes
- Ajouter météo (Open-Meteo) aux features.
- Calculer `hour_sin/hour_cos` à la volée dans l'API.
- Créer le frontend React dans `src/frontend` et l'ajouter au docker-compose.
- Mettre en place des jobs planifiés (cron/Prefect) pour collecter en continu.
# projet-python
