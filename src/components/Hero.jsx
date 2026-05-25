import { Icon } from "./Icon";

export function Hero({ data }) {
  if (!data) return null;
  const current = data.current;
  
  return (
    <div className="relative text-readable">
      <div className="flex items-center gap-2 text-white/80 text-[11px] font-semibold uppercase tracking-wider">
        <Icon name="location" size={13} />
        <span>Mein Standort</span>
        <span className="text-white/50">·</span>
        <span className="live-dot inline-block"></span>
        <span className="text-white/65">Live aktualisiert</span>
      </div>
      <h1 className="font-serif text-[58px] leading-[1] mt-1.5 tracking-tight">{data.city}</h1>
      <div className="text-white/70 text-[14px] mt-0.5">{data.country} · {data.region} · {data.lat.toFixed(2)}°N, {data.lon.toFixed(2)}°E</div>

      <div className="flex items-end gap-8 mt-1">
        <div className="relative flex items-start">
          <span className="temp-display">{current.temp}</span>
          <span className="font-serif text-[80px] leading-[1] mt-4 ml-2 opacity-90">°</span>
        </div>
        <div className="pb-12">
          <div className="font-serif italic text-[44px] leading-none">{current.condition}</div>
          <div className="text-white/80 text-[14px] mt-2.5">
            Höchst {current.high}° · Tief {current.low}° · {current.sub}
          </div>
        </div>
      </div>
    </div>
  );
}
