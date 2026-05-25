export const Icon = ({ name, size = 18, stroke = 1.75, color = "currentColor" }) => {
  const c = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round"
  };
  const P = {
    search:    <><circle cx="10" cy="10" r="7"/><path d="m21 21-6-6"/></>,
    mic:       <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/></>,
    plus:      <><path d="M12 5v14M5 12h14"/></>,
    location:  <><path d="M12 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"/><path d="M12 21s-7-7.5-7-13a7 7 0 0 1 14 0c0 5.5-7 13-7 13z"/></>,
    list:      <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    thermometer:<><path d="M12 13.5V4a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0z"/></>,
    wind:      <><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h17a3 3 0 1 1-3 3"/><path d="M3 16h8a3 3 0 1 1-3 3"/></>,
    drop:      <><path d="M12 3s-6 7-6 12a6 6 0 0 0 12 0c0-5-6-12-6-12z"/></>,
    sun:       <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    uv:        <><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></>,
    eye:       <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
    sunrise:   <><path d="M12 2v6M5.6 9.6 7 11M2 16h2M20 16h2M17 11l1.4-1.4"/><path d="M3 20h18"/><path d="M16 20a4 4 0 0 0-8 0"/></>,
    sunset:    <><path d="M12 8V2M5.6 9.6 7 11M2 16h2M20 16h2M17 11l1.4-1.4"/><path d="M3 20h18"/><path d="M16 20a4 4 0 0 0-8 0"/></>,
    home:      <><path d="M3 12 12 3l9 9"/><path d="M5 10v10h14V10"/></>,
    map:       <><path d="m3 6 6-2 6 2 6-2v16l-6 2-6-2-6 2z"/><path d="M9 4v16M15 6v16"/></>,
    cal:       <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    radar:     <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    star:      <><path d="m12 2 3 7 7.5.6-5.7 4.9 1.8 7.4L12 17.8 5.4 21.9 7.2 14.5 1.5 9.6 9 9z"/></>,
    sparkle:   <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M5.6 18.4 7.7 16.3M16.3 7.7l2.1-2.1"/></>,
    aqi:       <><path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 8a4 4 0 1 0 4 4"/><circle cx="12" cy="12" r="1"/></>,
    bell:      <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    refresh:   <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
    minus:     <><path d="M5 12h14"/></>,
    square:    <><rect x="5" y="5" width="14" height="14" rx="1.5"/></>,
    close:     <><path d="M6 6l12 12M18 6 6 18"/></>,
    chevR:     <><path d="m9 6 6 6-6 6"/></>,
  };
  return <svg {...c}>{P[name]}</svg>;
};
