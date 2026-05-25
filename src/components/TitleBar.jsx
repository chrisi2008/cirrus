import { Icon } from "./Icon";

export function TitleBar({ city, activeTab, onTabChange }) {
  const handleMinimize = () => {
    if (window.electronAPI) window.electronAPI.minimize();
  };

  const handleMaximize = () => {
    if (window.electronAPI) window.electronAPI.maximize();
  };

  const handleClose = () => {
    if (window.electronAPI) window.electronAPI.close();
  };

  return (
    <div className="absolute top-0 left-0 right-0 h-10 flex items-center z-50 select-none px-3"
         style={{ WebkitAppRegion: "drag", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
      {/* Brand & City */}
      <div className="flex items-center gap-2 text-white/90 text-[12px] font-medium w-64">
        <div className="w-4 h-4 rounded-sm grid place-items-center"
             style={{ background: "linear-gradient(135deg, #ff7a18, #ffb347)", boxShadow: "0 0 6px rgba(255,154,68,0.6)" }}>
          <span style={{ fontSize: 9 }}>☀</span>
        </div>
        <span>Cirrus</span>
        {city && <span className="text-white/45 truncate">— {city}</span>}
      </div>

      <div className="flex-1" />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg shadow-sm" style={{ WebkitAppRegion: "no-drag" }}>
        <div className={`px-4 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${activeTab === 'home' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
             onClick={() => onTabChange('home')}>
          <Icon name="home" size={13} />
          <span className="text-[11px] font-medium tracking-wide">Heute</span>
        </div>
        <div className={`px-4 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 ${activeTab === 'cal' ? 'bg-white/20 text-white shadow-sm' : 'text-white/60 hover:text-white'}`}
             onClick={() => onTabChange('cal')}>
          <Icon name="cal" size={13} />
          <span className="text-[11px] font-medium tracking-wide">Wochenplan</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Window Controls */}
      <div className="flex w-64 justify-end gap-1" style={{ WebkitAppRegion: "no-drag" }}>
        <div className="win-btn" onClick={handleMinimize}><Icon name="minus" size={14} /></div>
        <div className="win-btn" onClick={handleMaximize}><Icon name="square" size={12} /></div>
        <div className="win-btn close" onClick={handleClose}><Icon name="close" size={14} /></div>
      </div>
    </div>
  );
}
