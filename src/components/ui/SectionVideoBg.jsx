import { useEffect, useRef, useState } from "react";

export default function SectionVideoBg({
  children,
  videoScale = 1.0,
  videoSpeed = 0.50,
  opacity    = 0.15,
  overlay    = 0.80,
}) {
  const videoRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const narrow = window.innerWidth < 768;
      const slowConn =
        navigator.connection?.effectiveType === "2g" ||
        navigator.connection?.effectiveType === "slow-2g" ||
        navigator.connection?.saveData === true;
      setIsMobile(narrow || slowConn);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = videoSpeed;
  }, [videoSpeed]);

  const showVideo = !reducedMotion && !isMobile;

  const videoStyle =
    videoScale === 1.0
      ? { opacity, width: "100%", height: "100%", objectFit: "cover" }
      : {
          opacity,
          width: `${videoScale * 100}%`,
          height: `${videoScale * 100}%`,
          objectFit: "cover",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        };

  return (
    <div className="relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {showVideo ? (
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
          // No mobile: fundo estático com a imagem do poster
          <img
            src="/bg-video-poster.webp"
            alt=""
            style={{ ...videoStyle, objectFit: "cover" }}
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="absolute inset-0" style={{ background: `rgba(255,255,255,${overlay})` }} />
      </div>
      <div className="relative z-10 divide-y divide-[#d6d6d6]">{children}</div>
    </div>
  );
}