import { useEffect, useState } from "react";
import { ResponsiveContainer, ComposedChart, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, Line, Area, LabelList, Legend } from "recharts";
import { readJson } from "../../../lib/cmsLoader.js";

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0).toFixed(2).replace(".", ",");

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(28,40,70,0.12)",
      borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 32px rgba(28,40,70,0.12)",
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 700, color: "#1c2846", marginBottom: 6 }}>Mês: {label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.stroke || "#1c2846" }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{num(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ChartRiskReturn({ config }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let alive = true;
    try {
      const raw = readJson(String(config.source));
      const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.series) ? raw.series : [];
      if (alive) setData(rows);
    } catch (e) { console.error("ChartRiskReturn:", e); }
    return () => { alive = false; };
  }, [config?.source]);

  const xKey = config.options?.x || "date";
  const y1   = config.options?.y1 || "sortino";
  const y2   = config.options?.y2 || "sharpe";

  return (
    <figure className="w-full" style={{ background: "#e8ecf4", borderRadius: 16, padding: "24px 8px 16px" }}>
      <figcaption className="text-center mb-6">
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#1c2846" }}>{config.title}</h2>
        {config.subtitle && <p style={{ color: "rgba(28,40,70,0.5)", fontSize: 13, marginTop: 4 }}>{config.subtitle}</p>}
      </figcaption>

      <ResponsiveContainer width="100%" height={520}>
        <ComposedChart data={data} margin={{ top: 8, right: 130, left: 48, bottom: 28 }}>
          <defs>
            <linearGradient id="fillSharpe" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#4a7ab5" stopOpacity={0.10} />
              <stop offset="95%" stopColor="#4a7ab5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,40,70,0.18)" />
          <XAxis
            dataKey={xKey} tickMargin={8}
            tick={{ fontSize: 12, fill: "rgba(28,40,70,0.5)" }}
            axisLine={{ stroke: "rgba(28,40,70,0.12)" }} tickLine={false}
          />
          <YAxis
            width={44} tick={{ fontSize: 12, fill: "rgba(28,40,70,0.5)" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(28,40,70,0.15)", strokeWidth: 1 }} />

          {/* Sortino — linha sólida navy */}
          <Line type="monotone" dataKey={y1} name="Sortino"
            stroke="#1c2846" strokeWidth={2.5} dot={false}
          >
            <LabelList dataKey={y1} position="right" content={({ x, y, value, index }) => {
              if (index !== data.length - 1 || value == null) return null;
              return <text x={x + 8} y={y + 4} fontSize={13} fontWeight={700} fill="#1c2846">{num(value)} Sortino</text>;
            }} />
          </Line>

          {/* Sharpe — área preenchida azul médio tracejado */}
          <Area type="monotone" dataKey={y2} name="Sharpe"
            stroke="#4a7ab5" strokeWidth={2.2} strokeDasharray="6 4"
            fill="url(#fillSharpe)" dot={false}
          >
            <LabelList dataKey={y2} position="right" content={({ x, y, value, index }) => {
              if (index !== data.length - 1 || value == null) return null;
              return <text x={x + 8} y={y + 4} fontSize={13} fontWeight={700} fill="#4a7ab5">{num(value)} Sharpe</text>;
            }} />
          </Area>
        </ComposedChart>
      </ResponsiveContainer>
    </figure>
  );
}