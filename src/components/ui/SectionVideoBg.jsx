import { useEffect, useRef, useState } from "react";

/**
 * SectionVideoBg
 * Arquivo de vídeo em /public/bg-video.webm
 *
 * Props:
 *   videoScale  — escala do vídeo (default: 1.0 = cover total)
 *   videoSpeed  — velocidade de reprodução (default: 0.50 = câmera lenta)
 *   opacity     — opacidade do vídeo, 0–1 (default: 0.40)
 *   overlay     — opacidade do overlay branco, 0–1 (default: 0.50)
 */
export default function SectionVideoBg({
  children,
  videoScale = 1.0,
  videoSpeed = 0.50,
  opacity    = 0.15,
  overlay    = 0.80,
}) {
  const videoRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoSpeed;
    }
  }, [videoSpeed]);

  const videoStyle =
    videoScale === 1.0
      ? { opacity, width: "100%", height: "100%", objectFit: "cover" }
      : {
          opacity,
          width:  `${videoScale * 100}%`,
          height: `${videoScale * 100}%`,
          objectFit: "cover",
          position: "absolute",
          top:  "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {!reducedMotion ? (
          <video
  ref={videoRef}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster="/bg-video-poster.webp"
  style={videoStyle}
>
  <source src="/bg-video.webm" type="video/webm" />
</video>
        ) : (
          <div style={{ ...videoStyle, background: "#e8ecf2" }} />
        )}

        <div
          className="absolute inset-0"
          style={{ background: `rgba(255,255,255,${overlay})` }}
        />
      </div>

      <div className="relative z-10 divide-y divide-[#d6d6d6]">
        {children}
      </div>
    </div>
  );
}