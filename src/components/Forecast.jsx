import { useState, useEffect, useRef } from "react";
import { Icon } from "./Icon";

function DailyHourlyChart({ hourly }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setDims({ 
          w: entries[0].contentRect.width, 
          h: entries[0].contentRect.height 
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!hourly || hourly.length === 0) return null;
  
  const max = Math.max(...hourly.map(d=>d.t));
  const min = Math.min(...hourly.map(d=>d.t));
  const range = Math.max(1, max - min);
  
  const W = dims.w;
  const H = dims.h;
  
  const paddingLeft = 32; 
  const paddingRight = 32;
  const padY = 50; 

  const pts = hourly.map((d,i) => {
    const x = W === 0 ? 0 : paddingLeft + (i / 23) * (W - paddingLeft - paddingRight);
    const y = H === 0 ? 0 : padY + (H - padY*2) * (1 - (d.t - min)/range);
    return { x, y, ...d };
  });
  
  const pathD = pts.map((p,i) => `${i===0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length-1]?.x},${H} L${pts[0]?.x},${H} Z`;

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {W > 0 && H > 0 && (
        <>
          {/* Background grid lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between" style={{ padding: `${padY}px 0` }}>
            <div className="w-full border-t border-white/10" style={{ borderTopStyle: 'dashed' }}></div>
            <div className="w-full border-t border-white/10" style={{ borderTopStyle: 'dashed' }}></div>
            <div className="w-full border-t border-white/10" style={{ borderTopStyle: 'dashed' }}></div>
          </div>

          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 overflow-visible">
            <defs>
              <linearGradient id="areaG2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#areaG2)"/>
            <path d={pathD} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.4))" }}/>
          </svg>

          {/* Data Points HTML Overlay */}
          {pts.map((p, i) => (
            <div key={i} className="absolute flex flex-col items-center pointer-events-none" style={{ left: `${p.x}px`, top: 0, height: `${H}px`, transform: "translateX(-50%)", width: "40px" }}>
              
              {/* Temp text */}
              <div className="absolute" style={{ top: `${p.y}px`, transform: "translateY(-24px)" }}>
                <div className="text-white font-semibold text-[13px]">{p.t}°</div>
              </div>
              
              {/* Circle */}
              <div className="absolute w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" style={{ top: `${p.y}px`, transform: "translateY(-50%)" }}></div>

              {/* Icons & Hour at bottom */}
              <div className="absolute bottom-0 flex flex-col items-center justify-end pb-1">
                <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center text-[18px] mb-1">
                  {p.e}
                </div>
                <div className="text-white/65 text-[12px] font-medium">{p.h}</div>
              </div>
              
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function Forecast({ forecast, currentTemp }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!forecast || forecast.length === 0) return null;
  
  const gMax = Math.max(...forecast.map(d=>d.hi));
  const gMin = Math.min(...forecast.map(d=>d.lo));
  const span = Math.max(1, gMax - gMin);
  
  const selectedDay = forecast[selectedIdx];

  return (
    <div className="grid lg:grid-cols-[330px_1fr] gap-6 h-full text-readable">
      
      {/* Left Column: Forecast List */}
      <div className="glass rounded-2xl p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-2 mb-3 px-2">
          <Icon name="list" size={14} color="rgba(255,255,255,0.65)" />
          <span className="text-white/65 text-[10px] uppercase tracking-wider font-semibold">7-Tage Vorhersage</span>
        </div>
        
        <div className="flex flex-col gap-1 overflow-y-auto scrolly flex-1 pr-1">
          {forecast.map((d,i) => {
            const loPct = ((d.lo - gMin) / span) * 100;
            const hiPct = ((d.hi - gMin) / span) * 100;
            const isToday = i === 0;
            const nowPct = isToday ? ((currentTemp - gMin) / span) * 100 : null;
            const isSelected = selectedIdx === i;
            
            return (
              <div 
                key={i} 
                onClick={() => setSelectedIdx(i)}
                className={`grid items-center gap-1.5 px-3 py-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                style={{ gridTemplateColumns: "70px 24px 34px 1fr 64px" }}>
                
                <div className="flex flex-col">
                  <div className={`text-[12px] ${isToday ? "text-white font-semibold" : "text-white/85 font-medium"}`}>{d.day}</div>
                </div>
                
                <div className="text-[16px] text-center leading-none">{d.emoji}</div>
                
                <div className="flex items-center justify-center gap-0.5 text-white/65 text-[10px]">
                  <Icon name="drop" size={9} />
                  <span>{d.prec}%</span>
                </div>
                
                <div className="relative h-1.5 rounded-full bg-white/10 overflow-visible mx-1">
                  <div
                    className="absolute top-0 bottom-0 rounded-full"
                    style={{
                      left: `${loPct}%`,
                      width: `${hiPct - loPct}%`,
                      background: "linear-gradient(90deg, #5ec4ff 0%, #fffaa8 50%, #ff7a3a 100%)",
                      boxShadow: "0 0 8px rgba(255,255,255,0.2)"
                    }}
                  />
                  {isToday && nowPct != null && (
                    <div className="absolute -top-1 w-3 h-3 rounded-full bg-white"
                         style={{ left: `calc(${nowPct}% - 6px)`, boxShadow: "0 0 8px rgba(255,255,255,0.9)" }} />
                  )}
                </div>
                
                <div className="text-right text-[12px] tabular-nums">
                  <span className="text-white font-semibold">{d.hi}°</span>
                  <span className="text-white/55"> / {d.lo}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Detail Panel */}
      <div className="glass rounded-2xl p-6 pr-10 flex flex-col h-full min-h-[400px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[26px]">
            {selectedDay.emoji}
          </div>
          <div>
            <div className="text-white font-semibold text-[22px] leading-tight">{selectedDay.day}</div>
            <div className="text-white/60 text-[14px] font-medium tracking-wide mt-0.5">{selectedDay.date}</div>
          </div>
          
          <div className="ml-auto text-right">
            <div className="text-[32px] font-serif leading-none">{selectedDay.hi}° <span className="text-white/40 text-[22px]">/ {selectedDay.lo}°</span></div>
            <div className="text-white/50 text-[12px] mt-1.5 flex items-center gap-1.5 justify-end">
              <Icon name="drop" size={11} /> {selectedDay.prec}% Regenwahrscheinlichkeit
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full border-t border-white/5 pt-8 mt-2 relative">
          <DailyHourlyChart hourly={selectedDay.hourly} />
        </div>
      </div>
      
    </div>
  );
}
