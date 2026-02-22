import { ArrowDown, Database, Brain, Sparkles, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden circuit-pattern">
      {/* Gradient de fond */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Cercles lumineux décoratifs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-info/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Python for Data Science 2</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-foreground">Prédiction du</span>
            <br />
            <span className="gradient-text text-glow">Risque de Pollution</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Projet complet de Machine Learning : Web Scraping, EDA, Preprocessing,
            Modélisation XGBoost et déploiement avec React & FastAPI
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => scrollToSection("prediction")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 glow-primary"
            >
              <Brain className="w-5 h-5 mr-2" />
              Tester le Modèle
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("dataset")}
              className="border-border hover:bg-muted"
            >
              <Database className="w-5 h-5 mr-2" />
              Voir le Dataset
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { label: "Mesures", value: "2,450" },
              { label: "Accuracy", value: "89%" },
              { label: "Features", value: "13" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={() => scrollToSection("pipeline")}
            className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
