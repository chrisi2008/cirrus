import { Icon } from "./Icon";

export function HourlyChart({ hourly }) {
  if (!hourly || hourly.length === 0) return null;
  
  const W = 720, H = 140, padX = 28, padY = 18;
  const max = Math.max(...hourly.map(d=>d.t));
  const min = Math.min(...hourly.map(d=>d.t));
  const range = Math.max(1, max - min);
  const step = (W - padX*2) / (hourly.length - 1);
  
  const pts = hourly.map((d,i) => {
    const x = padX + i*step;
    const y = padY + (H - padY*2) * (1 - (d.t - min)/range);
    return { x, y, ...d };
  });
  
  const pathD = pts.map((p,i) => `${i===0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length-1].x},${H-padY} L${pts[0].x},${H-padY} Z`;

  return (
    <div className="glass rounded-2xl p-5 text-readable">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="sparkle" size={14} color="rgba(255,255,255,0.65)" />
        <span className="text-white/65 text-[10px] uppercase tracking-wider font-semibold">Stündlich · Nächste 12 Std.</span>
        <span className="ml-auto live-dot"></span>
        <span className="text-white/70 text-[11px] font-medium">Live</span>
      </div>
      <div className="relative">
        <svg width="100%" viewBox={`0 0 ${W} ${H+30}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* gridlines */}
          {[0, 0.5, 1].map((p, i) => (
            <line key={i} x1={padX} x2={W-padX} y1={padY + (H-padY*2)*p} y2={padY + (H-padY*2)*p}
                  stroke="rgba(255,255,255,0.1)" strokeDasharray="2 4"/>
          ))}
          <path d={areaD} fill="url(#areaG)"/>
          <path d={pathD} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.4))" }}/>
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill="#fff" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">{p.t}°</text>
              <text x={p.x} y={H + 4} textAnchor="middle" fontSize="14">{p.e}</text>
              <text x={p.x} y={H + 22} textAnchor="middle" fill="rgba(255,255,255,0.65)" fontSize="10" fontWeight="500">{p.h}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
