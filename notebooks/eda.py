"""
Quick EDA for the Air Quality project.

Usage (depuis la racine du projet) :
    python -m notebooks.eda --raw data/raw/openaq_pm25_*.parquet --features data/features/features.parquet
"""
from __future__ import annotations

import argparse
from pathlib import Path
import glob

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


def load_first(pattern: str) -> pd.DataFrame:
    paths = sorted(glob.glob(pattern))
    if not paths:
        raise FileNotFoundError(f"Aucun fichier pour le pattern : {pattern}")
    return pd.read_parquet(paths[0]) if paths[0].endswith(".parquet") else pd.read_csv(paths[0])


def main(raw_pattern: str, features_path: str):
    sns.set(style="whitegrid")

    raw_df = load_first(raw_pattern)
    print(f"[RAW] shape={raw_df.shape}, cols={list(raw_df.columns)}")
    print(raw_df.describe(include="all"))

    # plot distribution de la valeur
    plt.figure(figsize=(8, 4))
    sns.histplot(raw_df["value"], bins=30, kde=True)
    plt.title("Distribution valeur brute")
    plt.tight_layout()
    plt.savefig("notebooks/eda_raw_value.png")

    # features
    feat_df = pd.read_parquet(features_path)
    print(f"[FEATURES] shape={feat_df.shape}, cols={list(feat_df.columns)}")
    print(feat_df.describe())

    # ne garder que les colonnes numériques pour corrélation
    num_cols = feat_df.select_dtypes(include=["number"]).columns
    corr_df = feat_df[num_cols]

    # corrélation features
    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_df.corr(), cmap="coolwarm", annot=False)
    plt.title("Corrélation des features")
    plt.tight_layout()
    plt.savefig("notebooks/eda_corr.png")

    # séries temporelles simples
    plt.figure(figsize=(10, 4))
    sns.lineplot(x="datetime", y="value", data=feat_df.sort_values("datetime"))
    plt.title("Série temporelle (value)")
    plt.tight_layout()
    plt.savefig("notebooks/eda_timeseries.png")

    print("EDA plots saved in notebooks/: eda_raw_value.png, eda_corr.png, eda_timeseries.png")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw", default="data/raw/openaq_*.parquet", help="Pattern pour les fichiers raw")
    parser.add_argument("--features", default="data/features/features.parquet", help="Fichier de features")
    args = parser.parse_args()
    main(args.raw, args.features)
