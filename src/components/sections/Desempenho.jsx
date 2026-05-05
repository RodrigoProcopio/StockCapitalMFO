import LazyVisible from "../LazyVisible.jsx";
import ChartsSection from "../charts/ChartsSection.jsx";

export default function Desempenho() {
  return (
    <section id="desempenho" className="scroll-mt-24 relative py-24 overflow-hidden">


      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <LazyVisible>
          <ChartsSection />
        </LazyVisible>
      </div>
    </section>
  );
}