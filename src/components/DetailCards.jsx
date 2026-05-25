import { Icon } from "./Icon";

export function UVCard({ data }) {
  if (!data) return null;
  const current = data.current;
  return (
    <div className="glass rounded-2xl p-4 text-readable">
      <div className="flex items-center gap-2 text-white/65 text-[10px] uppercase tracking-wider font-semibold mb-2">
        <Icon name="uv" size={12}/> <span>UV-Index</span>
      </div>
      <div className="text-white text-[44px] font-serif leading-none">{current.uv}</div>
      <div className="text-white/85 text-[13px] mt-1">{current.uv <= 2 ? "Niedrig" : current.uv <= 5 ? "Mäßig" : current.uv <= 7 ? "Hoch" : "Sehr hoch"}</div>
      <div className="mt-3 h-1.5 rounded-full" style={{background: "linear-gradient(90deg, #4ade80, #facc15, #f97316, #ef4444, #a855f7)"}}>
        <div className="relative h-full">
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
               style={{ left: `calc(${Math.min(100,(current.uv/11)*100)}% - 6px)`, boxShadow: "0 0 8px rgba(255,255,255,0.9)" }} />
        </div>
      </div>
      <div className="text-white/55 text-[10.5px] mt-2">Sonnenschutz {current.uv >= 3 ? "empfohlen" : "nicht nötig"}.</div>
    </div>
  );
}

export function SunCard({ data }) {
  if (!data) return null;
  const current = data.current;
  
  // Calculate sun position based on current time vs sunrise/sunset
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const parseTime = (timeStr) => {
    if (!timeStr) return 60 * 6; // default 6 AM
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };
  
  const start = parseTime(current.sunrise);
  const end = parseTime(current.sunset);
  
  let progress = 0;
  if (currentMinutes > start && currentMinutes < end) {
    progress = (currentMinutes - start) / (end - start);
  } else if (currentMinutes >= end) {
    progress = 1;
  }
  
  const isNight = progress === 0 || progress === 1;

  return (
    <div className="glass rounded-2xl p-4 text-readable">
      <div className="flex items-center gap-2 text-white/65 text-[10px] uppercase tracking-wider font-semibold mb-2">
        <Icon name="sunrise" size={12}/> <span>Sonne</span>
      </div>
      <div className="relative h-24 mt-2">
        <svg viewBox="0 0 220 96" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Background Arc */}
          <path d="M 20 86 A 90 70 0 0 1 200 86" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"/>
          {/* Horizon Line */}
          <line x1="10" y1="86" x2="210" y2="86" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
          
          {(() => {
            const t = progress; // 0 to 1
            // calculate point on the ellipse
            const cx = 110 - 90 * Math.cos(Math.PI * t);
            const cy = 86 - 70 * Math.sin(Math.PI * t);
            return (
              <>
                {/* Sun Glow */}
                <circle cx={cx} cy={cy} r="8" fill={isNight ? "#c4b5fd" : "#fde047"} style={{ filter: `drop-shadow(0 0 12px ${isNight ? "#a78bfa" : "#fde047"})` }}/>
                {/* Sun Core */}
                <circle cx={cx} cy={cy} r="3" fill="#fff"/>
              </>
            );
          })()}
        </svg>
      </div>
      <div className="flex justify-between text-[12px] mt-2">
        <div>
          <div className="text-white/55 text-[10px] uppercase tracking-wider font-semibold">Aufgang</div>
          <div className="text-white font-medium">{current.sunrise}</div>
        </div>
        <div className="text-right">
          <div className="text-white/55 text-[10px] uppercase tracking-wider font-semibold">Untergang</div>
          <div className="text-white font-medium">{current.sunset}</div>
        </div>
      </div>
    </div>
  );
}

export function WindCard({ data }) {
  if (!data) return null;
  const current = data.current;
  const dirs = { N: 0, NO: 45, O: 90, SO: 135, S: 180, SW: 225, W: 270, NW: 315 };
  const angle = dirs[current.windDir] || 0;
  
  return (
    <div className="glass rounded-2xl p-4 text-readable">
      <div className="flex items-center gap-2 text-white/65 text-[10px] uppercase tracking-wider font-semibold mb-2">
        <Icon name="wind" size={12}/> <span>Wind & Richtung</span>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="relative w-24 h-24 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-white/20"></div>
          <div className="absolute inset-2 rounded-full border border-white/10"></div>
          {["N","O","S","W"].map((l,i) => (
            <div key={l} className="absolute text-white/55 text-[10px] font-semibold"
                 style={{
                   top: ["2px","50%","calc(100% - 14px)","50%"][i],
                   left: ["50%","calc(100% - 12px)","50%","2px"][i],
                   transform: "translate(-50%, -50%)"
                 }}>{l}</div>
          ))}
          <div className="absolute inset-0 grid place-items-center">
            <div style={{ transform: `rotate(${angle}deg)` }}>
              <svg width="48" height="48" viewBox="0 0 48 48">
                <path d="M 24 6 L 30 30 L 24 26 L 18 30 Z" fill="#fff" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.6))" }}/>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <div className="font-serif text-[40px] leading-none">{current.wind}</div>
          <div className="text-white/65 text-[11px]">km/h aus {current.windDir}</div>
          <div className="text-white/55 text-[10.5px] mt-2">Böen bis {current.wind + 8} km/h</div>
        </div>
      </div>
    </div>
  );
}

export function AirCard({ data }) {
  if (!data) return null;
  const current = data.current;
  const level = current.aqi <= 25 ? "Sehr gut" : current.aqi <= 50 ? "Gut" : current.aqi <= 100 ? "Mäßig" : "Schlecht";
  return (
    <div className="glass rounded-2xl p-4 text-readable">
      <div className="flex items-center gap-2 text-white/65 text-[10px] uppercase tracking-wider font-semibold mb-2">
        <Icon name="aqi" size={12}/> <span>Luftqualität</span>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="font-serif text-[44px] leading-none">{current.aqi}</div>
        <div className="text-white/80 text-[13px]">AQI</div>
      </div>
      <div className="text-white/85 text-[13px] mt-1">{level}</div>
      <div className="mt-3 h-1.5 rounded-full" style={{background: "linear-gradient(90deg, #4ade80 0%, #facc15 35%, #f97316 60%, #ef4444 85%, #a855f7 100%)"}}>
        <div className="relative h-full">
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white"
               style={{ left: `calc(${Math.min(100,(current.aqi/200)*100)}% - 6px)`, boxShadow: "0 0 8px rgba(255,255,255,0.9)" }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div><div className="text-white/55 text-[9px] uppercase tracking-wider">PM2.5</div><div className="text-[12px] font-medium">12</div></div>
        <div><div className="text-white/55 text-[9px] uppercase tracking-wider">PM10</div><div className="text-[12px] font-medium">22</div></div>
        <div><div className="text-white/55 text-[9px] uppercase tracking-wider">O₃</div><div className="text-[12px] font-medium">58</div></div>
      </div>
    </div>
  );
}

export function MiniStat({ icon, label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-4 text-readable">
      <div className="flex items-center gap-2 text-white/65 text-[10px] uppercase tracking-wider font-semibold mb-2">
        <Icon name={icon} size={12}/> <span>{label}</span>
      </div>
      <div className="font-serif text-[36px] leading-none">{value}</div>
      <div className="text-white/65 text-[11px] mt-1">{sub}</div>
    </div>
  );
}
