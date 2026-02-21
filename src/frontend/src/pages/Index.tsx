import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PipelineVisualization from "@/components/PipelineVisualization";
import ScrapingSection from "@/components/ScrapingSection";
import EDASection from "@/components/EDASection";
import PreprocessingSection from "@/components/PreprocessingSection";
import ModelingSection from "@/components/ModelingSection";
import PredictionSection from "@/components/PredictionSection";
import DatasetSection from "@/components/DatasetSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        
        <section id="pipeline" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="section-title mb-4">Architecture du Projet</h2>
            <p className="section-subtitle max-w-2xl mx-auto mb-8">
              Pipeline complet de Machine Learning : de la collecte à la prédiction
            </p>
            <PipelineVisualization />
          </div>
        </section>
        
        <ScrapingSection />
        <EDASection />
        <PreprocessingSection />
        <ModelingSection />
        <PredictionSection />
        <DatasetSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
