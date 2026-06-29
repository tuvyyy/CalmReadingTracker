// components/StatCard.tsx

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;   // CSS color for value text
  bg?: string;      // optional background override
}

export default function StatCard({ value, label, color, bg }: StatCardProps) {
  return (
    <div className="stat-card" style={bg ? { background: bg } : undefined}>
      <div className="stat-card__value" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
