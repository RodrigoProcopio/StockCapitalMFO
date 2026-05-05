import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ChartRenderer from "./ChartRenderer.jsx";
export default function ChartsCarousel({ charts = [] }) {
  // loop: true — carrossel infinito sem rebobinar
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const timer = useRef(null);
  const hovering = useRef(false);
  const pageHidden = useRef(false);

  const clear = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const play = useCallback(() => {
    clear();
    if (!emblaApi || !charts.length) return;
    const idx = emblaApi.selectedScrollSnap();
    const sec = Number(charts[idx]?.autoplay_seconds || 0);
    if (!sec || hovering.current || pageHidden.current) return;
    timer.current = setInterval(() => {
      if (!emblaApi) return;
      emblaApi.scrollNext(); // sempre avança — loop: true cuida do retorno infinito
    }, sec * 1000);
  }, [emblaApi, charts]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("settle", play);
    onSelect();
    play();
    return clear;
  }, [emblaApi, onSelect, play]);

  useEffect(() => {
    const onVis = () => { pageHidden.current = document.hidden; play(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [play]);

  return (
    <div
      className="w-full"
      onMouseEnter={() => { hovering.current = true; clear(); }}
      onMouseLeave={() => { hovering.current = false; play(); }}
    >
      <div ref={emblaRef} className="w-full overflow-hidden">
        <div className="flex touch-pan-y select-none">
          {charts.map((cfg, i) => (
            <div key={i} className="shrink-0 grow-0 basis-full">
              <div className="w-full">
                <ChartRenderer config={cfg} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bullets */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {charts.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selected ? "w-6 bg-[#1c2846]" : "w-2 bg-[#1c2846]/25"
            }`}
            aria-label={`Ir para o slide ${i + 1}`}
            aria-current={i === selected}
          />
        ))}
      </div>
    </div>
  );
}