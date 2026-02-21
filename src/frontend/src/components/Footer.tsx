import { Github, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border/50 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              Projet Python for Data Science 2 — Prédiction des Prix Immobiliers
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              © 2025-2026 • Tuteur: Haythem Ghazouani
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/haythemghz/Python-for-Data-Science-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground/50 flex items-center justify-center gap-1">
            Fait avec <Heart className="w-3 h-3 text-destructive" /> en React + FastAPI + XGBoost
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
