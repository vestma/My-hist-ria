import React from 'react';
import { VALUE_DEFINITIONS } from '../data/storyData';
import { ValueKey } from '../types/story';

interface ValuesCompassChartProps {
  scores: Record<ValueKey, number>;
}

export const ValuesCompassChart: React.FC<ValuesCompassChartProps> = ({ scores }) => {
  const size = 340;
  const center = size / 2;
  const maxRadius = 112;
  const rings = [0.25, 0.5, 0.75, 1];

  const points = VALUE_DEFINITIONS.map((def, i) => {
    const angle = (Math.PI * 2 * i) / VALUE_DEFINITIONS.length - Math.PI / 2;
    const valueRatio = (scores[def.key] ?? 0) / 100;
    const r = valueRatio * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    const outerX = center + maxRadius * Math.cos(angle);
    const outerY = center + maxRadius * Math.sin(angle);

    const labelRadius = maxRadius + 30;
    const labelX = center + labelRadius * Math.cos(angle);
    const labelY = center + labelRadius * Math.sin(angle);

    return {
      def,
      score: scores[def.key] ?? 0,
      x,
      y,
      outerX,
      outerY,
      labelX,
      labelY,
      angle,
    };
  });

  const polygonPoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[340px] h-auto overflow-visible"
        role="img"
        aria-label="Bússola de valores pessoais revelados na jornada"
      >
        {/* Concentric reference rings */}
        {rings.map((ring) => {
          const r = maxRadius * ring;
          const ringPoints = VALUE_DEFINITIONS.map((_, i) => {
            const angle = (Math.PI * 2 * i) / VALUE_DEFINITIONS.length - Math.PI / 2;
            return `${(center + r * Math.cos(angle)).toFixed(1)},${(
              center +
              r * Math.sin(angle)
            ).toFixed(1)}`;
          }).join(' ');
          return (
            <polygon
              key={ring}
              points={ringPoints}
              fill="none"
              stroke="#E5E2DC"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {points.map((p) => (
          <line
            key={p.def.key}
            x1={center}
            y1={center}
            x2={p.outerX}
            y2={p.outerY}
            stroke="#E5E2DC"
            strokeWidth={1}
          />
        ))}

        {/* Value polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(30, 58, 138, 0.14)"
          stroke="#1E3A8A"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Data nodes */}
        {points.map((p) => (
          <circle
            key={p.def.key}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#1E3A8A"
            stroke="#F8F7F4"
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {points.map((p) => {
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(p.angle) > 0.25) textAnchor = 'start';
          else if (Math.cos(p.angle) < -0.25) textAnchor = 'end';

          return (
            <g key={`label-${p.def.key}`}>
              <text
                x={p.labelX}
                y={p.labelY - 4}
                textAnchor={textAnchor}
                className="fill-[#1C1917] text-[12px] font-semibold"
              >
                {p.def.label}
              </text>
              <text
                x={p.labelX}
                y={p.labelY + 11}
                textAnchor={textAnchor}
                className="fill-[#57534E] text-[11px] font-mono-tabular"
              >
                {p.score}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
