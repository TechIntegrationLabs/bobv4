import React from 'react';

interface OrbRingsProps {
  isChatActive: boolean;
}

const OrbRings: React.FC<OrbRingsProps> = ({ isChatActive }) => (
  <>
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className={`absolute inset-0 border rounded-full transform-style-3d transition-all duration-300 ${
          isChatActive 
            ? 'border-cyan-400/40 group-hover:border-cyan-400/60' 
            : 'border-white/40 group-hover:border-white/60'
        }`}
        style={{
          transform: `rotateX(${i * 12}deg) rotateY(${i * 12}deg)`,
          animation: `pulse ${3 + i * 0.2}s ease-in-out infinite alternate`,
          animationDelay: `${i * -0.1}s`
        }}
      />
    ))}
  </>
);

export default OrbRings;