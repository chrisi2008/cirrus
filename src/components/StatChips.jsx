import { Icon } from "./Icon";

export function StatChips({ data }) {
  if (!data) return null;
  const current = data.current;
  
  const chips = [
    { label: "Gefühlt",     value: `${current.feels}°`,     icon: "thermometer", sub: current.feels >= current.temp ? "Wärmer als real" : "Kühler als real" },
    { label: "Wind",        value: `${current.wind}`,       icon: "wind",        sub: `km/h · ${current.windDir}` },
    { label: "Luftfeuchte", value: `${current.humidity}%`,  icon: "drop",        sub: current.humidity > 70 ? "Schwül" : "Komfortabel" },
    { label: "UV-Index",    value: `${current.uv}`,         icon: "uv",          sub: current.uv <= 2 ? "Niedrig" : current.uv <= 5 ? "Mäßig" : current.uv <= 7 ? "Hoch" : "Sehr hoch" },
  ];
  
  return (
    <div className="grid grid-cols-4 gap-3 text-readable">
      {chips.map(c => (
        <div key={c.label} className="glass-chip rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <Icon name={c.icon} size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-white/65 text-[10px] uppercase tracking-wider font-semibold">{c.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-[24px] font-medium leading-tight">{c.value}</span>
            </div>
            <div className="text-white/65 text-[10.5px]">{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
