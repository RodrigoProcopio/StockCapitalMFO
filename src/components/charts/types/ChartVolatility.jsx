import { useEffect, useState } from "react";
import { ResponsiveContainer, ComposedChart, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Line, Area, LabelList, Legend, ReferenceLine } from "recharts";
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
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: "#1c2846" }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{num(p.value)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function ChartVolatility({ config }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    try {
      const raw = readJson(String(config.source));
      const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.series) ? raw.series : [];
      // Normaliza o campo: aceita vol, volatilidade, value, rendimento
      const normalized = rows.map((row) => ({
        ...row,
        vol: row.vol ?? row.volatilidade ?? row.value ?? row.rendimento ?? row.y ?? 0,
      }));
      setData(normalized);
      // Log para debug
      if (normalized.length) console.log("ChartVolatility sample:", normalized[0]);
    } catch (e) { console.error("ChartVolatility:", e); setData([]); }
  }, [config?.source]);

  const xKey = config.options?.x || "date";
  const yKey = config.options?.y || "vol";
  const lineName = config.options?.label || "Volatilidade";

  return (
    <figure className="w-full" style={{ background: "#e8ecf4", borderRadius: 16, padding: "24px 8px 16px" }}>
      {(config.title || config.subtitle) && (
        <figcaption className="text-center mb-6">
          {config.title && <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#1c2846" }}>{config.title}</h3>}
          {config.subtitle && <p style={{ color: "rgba(28,40,70,0.5)", fontSize: 13, marginTop: 4 }}>{config.subtitle}</p>}
        </figcaption>
      )}

      <ResponsiveContainer width="100%" height={520}>
        <ComposedChart data={data} margin={{ top: 8, right: 110, bottom: 8, left: 48 }}>
          <defs>
            <linearGradient id="fillVol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#1c2846" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#1c2846" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,40,70,0.18)" />
          <XAxis
            dataKey={xKey} tick={{ fontSize: 12, fill: "rgba(28,40,70,0.5)" }}
            axisLine={{ stroke: "rgba(28,40,70,0.12)" }} tickLine={false} tickMargin={8}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "rgba(28,40,70,0.5)" }}
            axisLine={false} tickLine={false} width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(28,40,70,0.15)", strokeWidth: 1 }} />

          <Area
            type="monotone" dataKey={yKey} name={lineName}
            stroke="#1c2846" strokeWidth={2.5}
            fill="url(#fillVol)" dot={false}
          >
            <LabelList dataKey={yKey} position="right" content={({ x, y, value, index }) => {
              if (index !== data.length - 1 || value == null) return null;
              return (
                <text x={x + 8} y={y + 4} fontSize={13} fontWeight={700} fill="#1c2846">
                  {num(value)}% LTM³
                </text>
              );
            }} />
          </Area>
        </ComposedChart>
      </ResponsiveContainer>

      {config.notes && (
        <figcaption style={{ color: "rgba(28,40,70,0.45)", fontSize: 12, marginTop: 12, textAlign: "center" }}>
          {config.notes}
        </figcaption>
      )}
    </figure>
  );
}