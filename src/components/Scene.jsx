import { useMemo } from "react";

// ---- color helpers ----
const lerp = (a, b, t) => a + (b - a) * t;
const hsl = (h, s, l, a = 1) => `hsla(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%, ${a})`;

function sunnyGradient(intensity) {
  const t = Math.max(0, Math.min(1, intensity / 100));
  const cTL = hsl(lerp(48, 32, t), lerp(75, 95, t), lerp(80, 65, t));
  const cBR = hsl(lerp(195, 8, t), lerp(55, 92, t), lerp(60, 48, t));
  const s1 = hsl(lerp(205, 12, t), lerp(45, 88, t), lerp(72, 48, t));
  const s2 = hsl(lerp(40, 22, t), lerp(60, 92, t), lerp(75, 58, t));
  const s3 = hsl(lerp(45, 32, t), lerp(65, 90, t), lerp(78, 65, t));
  const s4 = hsl(lerp(50, 42, t), lerp(70, 85, t), lerp(85, 75, t));
  return `
    radial-gradient(ellipse 70% 50% at 80% 100%, ${cBR} 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 0% 0%, ${cTL} 0%, transparent 55%),
    linear-gradient(160deg, ${s1} 0%, ${s2} 35%, ${s3} 70%, ${s4} 100%)
  `;
}
function sunCoreStyle(intensity) {
  const t = Math.max(0, Math.min(1, intensity / 100));
  const c1 = hsl(lerp(55, 50, t), lerp(85, 100, t), lerp(95, 88, t));
  const c2 = hsl(lerp(48, 38, t), lerp(85, 100, t), lerp(80, 68, t));
  const c3 = hsl(lerp(40, 18, t), lerp(80, 95, t), lerp(65, 52, t));
  const size = lerp(420, 620, t);
  return { width: size, height: size,
    background: `radial-gradient(circle at 50% 50%, ${c1} 0%, ${c2} 25%, ${c3} 55%, transparent 75%)` };
}
function blobColors(intensity) {
  const t = Math.max(0, Math.min(1, intensity / 100));
  return {
    a: hsl(lerp(40, 8, t), lerp(70, 95, t), lerp(60, 50, t)),
    b: hsl(lerp(48, 32, t), lerp(80, 95, t), lerp(80, 70, t)),
    c: hsl(lerp(55, 45, t), lerp(85, 95, t), lerp(88, 78, t)),
  };
}

export function Scene({ mood, data }) {
  const showBlobs = true;
  const showRain = true;

  // Calculate dynamic intensities based on real data
  const temp = data?.current?.temp || 15;
  const uv = data?.current?.uv || 0;
  const precip = data?.current?.precip || 0;

  // Sun Intensity: temperature (-10 to 40 -> 0 to 50) + UV (0 to 10 -> 0 to 50)
  const sunIntensity = Math.max(0, Math.min(100, (temp + 10) * 1.5 + (uv * 3)));
  // Rain/Storm Intensity: based on precipitation mm/h
  const rainIntensity = Math.max(0, Math.min(100, precip * 15));
  const stormIntensity = Math.max(0, Math.min(100, precip * 10));
  const snowIntensity = Math.max(0, Math.min(100, precip * 20));

  const sunnyStyle = mood === "sunny" ? { background: sunnyGradient(sunIntensity) } : null;
  const sunStyle = mood === "sunny" ? sunCoreStyle(sunIntensity) : null;
  const bc = mood === "sunny" ? blobColors(sunIntensity) : null;

  const rainDropCount = Math.round(40 + (rainIntensity / 100) * 160);
  const stormDropCount = Math.round(80 + (stormIntensity / 100) * 200);
  const drops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 320; i++) {
      arr.push({
        left: Math.random() * 110 - 5,
        height: 40 + Math.random() * 90,
        duration: 0.3 + Math.random() * 0.6,
        delay: -Math.random() * 1.2,
        opacity: 0.35 + Math.random() * 0.55,
        width: Math.random() < 0.25 ? 1.5 : 1,
      });
    }
    return arr;
  }, []);

  const flakeCount = Math.round(30 + (snowIntensity / 100) * 140);
  const flakes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 200; i++) {
      const size = 2 + Math.random() * 5;
      arr.push({
        left: Math.random() * 110 - 5,
        size,
        duration: 6 + Math.random() * 10,
        delay: -Math.random() * 10,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
    return arr;
  }, []);

  const flashCycle = `${Math.max(2, 12 - (stormIntensity/100) * 9.5).toFixed(1)}s`;

  const bgClasses = {
    sunny: "bg-sunny",
    rainy: "bg-rainy",
    night: "bg-night",
    cloudy: "bg-cloudy",
    storm: "bg-storm",
    snow: "bg-snow"
  };

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {mood === "sunny"
        ? <div className="bg-layer" style={sunnyStyle} />
        : <div className={`bg-layer ${bgClasses[mood]}`} />}
      {mood === "sunny" && showBlobs && (
        <>
          <div className="sun-core" style={sunStyle} />
          <div className="blob" style={{ width: 360, height: 360, background: bc.a, top: "55%", left: "-100px" }} />
          <div className="blob" style={{ width: 440, height: 440, background: bc.b, top: "65%", right: "-120px", animation: "drift-slow 24s ease-in-out infinite alternate" }} />
          <div className="blob" style={{ width: 240, height: 240, background: bc.c, top: "20%", left: "35%" }} />
        </>
      )}
      {mood === "rainy" && (
        <>
          {showBlobs && <>
            <div className="blob" style={{ width: 360, height: 360, background: "#2a4068", top: "15%", left: "-80px", opacity: 0.55 }} />
            <div className="blob" style={{ width: 460, height: 460, background: "#4a6890", top: "55%", right: "-120px", opacity: 0.5, animation: "drift-slow 24s ease-in-out infinite alternate" }} />
            <div className="blob" style={{ width: 280, height: 280, background: "#1a2840", top: "50%", left: "30%", opacity: 0.45 }} />
          </>}
          {showRain && (
            <>
              <div className="rain-vignette" />
              <div className="rain-layer">
                {drops.slice(0, rainDropCount).map((d, i) => (
                  <div key={i} className="drop"
                    style={{
                      left: `${d.left}%`,
                      height: `${d.height}px`,
                      width: `${d.width}px`,
                      opacity: d.opacity,
                      animationDuration: `${d.duration}s`,
                      animationDelay: `${d.delay}s`,
                    }}
                  />
                ))}
              </div>
              <div className="rain-fog" />
              <div className="rain-puddle" />
            </>
          )}
        </>
      )}
      {mood === "storm" && (
        <>
          {showBlobs && <>
            <div className="blob" style={{ width: 380, height: 380, background: "#0d1230", top: "10%", left: "-80px", opacity: 0.65 }} />
            <div className="blob" style={{ width: 460, height: 460, background: "#1a1f3a", top: "50%", right: "-120px", opacity: 0.6, animation: "drift-slow 24s ease-in-out infinite alternate" }} />
            <div className="blob" style={{ width: 280, height: 280, background: "#06080f", top: "55%", left: "25%", opacity: 0.55 }} />
          </>}
          <div className="rain-vignette" />
          <div className="rain-layer">
            {drops.slice(0, stormDropCount).map((d, i) => (
              <div key={i} className="drop"
                style={{
                  left: `${d.left}%`,
                  height: `${d.height * 1.1}px`,
                  width: `${d.width}px`,
                  opacity: d.opacity,
                  animationDuration: `${d.duration * 0.85}s`,
                  animationDelay: `${d.delay}s`,
                }}
              />
            ))}
          </div>
          <svg className="bolt b1" width="90" height="260" viewBox="0 0 90 260" style={{ "--flash-cycle": flashCycle }}>
            <path d="M50 0 L18 130 L40 130 L8 260 L62 110 L36 110 L80 0 Z" fill="rgba(255,255,255,0.95)" stroke="#ffffff" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <svg className="bolt b2" width="70" height="220" viewBox="0 0 70 220" style={{ "--flash-cycle": flashCycle }}>
            <path d="M40 0 L14 110 L34 110 L6 220 L52 95 L28 95 L62 0 Z" fill="rgba(220,235,255,0.95)" stroke="#ffffff" strokeWidth="1" strokeLinejoin="round"/>
          </svg>
          <div className="storm-flash" style={{ "--flash-cycle": flashCycle }} />
          <div className="rain-fog" />
        </>
      )}
      {mood === "snow" && (
        <>
          {showBlobs && <>
            <div className="blob" style={{ width: 420, height: 420, background: "#e8eef6", top: "10%", left: "-100px", opacity: 0.65 }} />
            <div className="blob" style={{ width: 380, height: 380, background: "#cdd8e6", top: "55%", right: "-80px", opacity: 0.55, animation: "drift-slow 24s ease-in-out infinite alternate" }} />
            <div className="blob" style={{ width: 240, height: 240, background: "#a7b8d0", top: "30%", right: "25%", opacity: 0.4 }} />
          </>}
          <div className="snow-layer">
            {flakes.slice(0, flakeCount).map((f, i) => (
              <div key={i} className="snowflake"
                style={{
                  left: `${f.left}%`,
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                  opacity: f.opacity,
                  animationDuration: `${f.duration}s`,
                  animationDelay: `${f.delay}s`,
                }}
              />
            ))}
          </div>
          <div className="snow-floor" />
        </>
      )}
      {mood === "night" && (
        <>
          <div className="stars" />
          {showBlobs && <>
            <div className="blob" style={{ width: 360, height: 360, background: "#6b3aa8", top: "10%", right: "-80px", opacity: 0.7 }} />
            <div className="blob" style={{ width: 280, height: 280, background: "#a855f7", bottom: "20%", left: "-60px", opacity: 0.55 }} />
            <div className="blob" style={{ width: 200, height: 200, background: "#fde68a", top: "12%", right: "20%", opacity: 0.5, filter: "blur(20px)" }} />
          </>}
        </>
      )}
      {mood === "cloudy" && showBlobs && (
        <>
          <div className="blob" style={{ width: 400, height: 400, background: "#e2e8f0", top: "10%", left: "-100px", opacity: 0.7 }} />
          <div className="blob" style={{ width: 380, height: 380, background: "#cbd5e1", top: "55%", right: "-80px", opacity: 0.65, animation: "drift-slow 24s ease-in-out infinite alternate" }} />
          <div className="blob" style={{ width: 260, height: 260, background: "#fef3c7", top: "30%", right: "25%", opacity: 0.4 }} />
        </>
      )}
    </div>
  );
}
