// src/components/public/CyberBackground.tsx
import NetworkCanvas from "./NetworkCanvas";

// Fixed full-screen backdrop. The glass panels blur and refract this,
// so it needs lots of colour and detail behind the content.
export default function CyberBackground() {
  return (
    <div className="bg-stage" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-floor" />
      <div
        className="bg-orb"
        style={{ width: 460, height: 460, left: "-8%", top: "8%", background: "#2f6bff" }}
      />
      <div
        className="bg-orb"
        style={{
          width: 380,
          height: 380,
          left: "38%",
          bottom: "-10%",
          background: "#00d8cd",
          animationDelay: "-6s",
          opacity: 0.4,
        }}
      />
      <div
        className="bg-orb"
        style={{
          width: 300,
          height: 300,
          right: "6%",
          top: "-6%",
          background: "#7a4dff",
          animationDelay: "-11s",
          opacity: 0.4,
        }}
      />
      <div className="bg-shield-glow" />
      <div className="bg-shield" />
      <NetworkCanvas />
      <div className="bg-scan" />
      <div className="bg-vignette" />
    </div>
  );
}
