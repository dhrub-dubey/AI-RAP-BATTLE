import { Flame } from 'lucide-react';

interface CrowdMeterProps {
  score: number;
}

const CROWD_LABELS = [
  { min: 0, label: 'Silence...', color: 'text-gray-500' },
  { min: 10, label: 'Warming Up', color: 'text-blue-400' },
  { min: 25, label: 'Getting Hot!', color: 'text-yellow-400' },
  { min: 45, label: 'CROWD IS LIT!', color: 'text-orange-400' },
  { min: 65, label: 'FIRE!!', color: 'text-red-400' },
  { min: 85, label: 'LEGENDARY!!', color: 'text-pink-400' },
];

function getCrowdLabel(score: number) {
  let label = CROWD_LABELS[0];
  for (const l of CROWD_LABELS) {
    if (score >= l.min) label = l;
  }
  return label;
}

export function CrowdMeter({ score }: CrowdMeterProps) {
  const { label, color } = getCrowdLabel(score);
  const segments = 20;

  return (
    <div className="bg-black/60 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${score > 40 ? 'text-orange-400 animate-pulse' : 'text-gray-600'}`} />
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Crowd Reaction</span>
        </div>
        <span className={`text-xs font-black tracking-wider uppercase ${color}`}>{label}</span>
      </div>

      <div className="flex gap-1 items-end h-6">
        {Array.from({ length: segments }).map((_, i) => {
          const threshold = (i / segments) * 100;
          const active = score > threshold;
          const height = 30 + (i / segments) * 70;

          let barColor = 'bg-gray-800';
          if (active) {
            if (i < segments * 0.3) barColor = 'bg-blue-500';
            else if (i < segments * 0.5) barColor = 'bg-yellow-500';
            else if (i < segments * 0.7) barColor = 'bg-orange-500';
            else barColor = 'bg-red-500';
          }

          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-300 ${barColor} ${active && score > 60 ? 'animate-pulse' : ''}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>0</span>
        <span className={`font-bold ${color}`}>{Math.round(score)}%</span>
        <span>100</span>
      </div>
    </div>
  );
}
