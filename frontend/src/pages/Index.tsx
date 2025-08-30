import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section when navigating from other pages
    if (location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <div className="min-h-screen">
      <main>
        <Hero />
        <Features />
        <UseCases />
      </main>
    </div>
  );
};

export default Index;
