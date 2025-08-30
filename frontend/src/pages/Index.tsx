import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UseCases from "@/components/UseCases";

const Index = () => {
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
