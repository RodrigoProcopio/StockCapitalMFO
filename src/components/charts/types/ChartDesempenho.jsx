import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, ComposedChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList, ReferenceLine } from "recharts";
import { readJson } from "../../../lib/cmsLoader.js";

const ptPct = (v) => {
  const n = Number(v);
  return `${(Number.isFinite(n) ? n : 0).toFixed(2).replace(".", ",")}%`;
};

const fmtMes = (iso) => {
  const [y, m] = String(iso).split("-").map(Number);
  return new Date(y || 1970, (m || 1) - 1, 1)
    .toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
};

// Paleta premium
const PALETTE = [
  { stroke: "#1c2846", fill: "#1c2846", strokeWidth: 2.8, strokeDasharray: undefined },   // Portfólio — navy sólido
  { stroke: "#4a7ab5", fill: "#4a7ab5", strokeWidth: 2.2, strokeDasharray: "6 4" },       // IFHA — azul médio tracejado
  { stroke: "#7eaed4", fill: "#7eaed4", strokeWidth: 2.0, strokeDasharray: "3 4" },       // Alpha — azul claro
  { stroke: "#9aa3b2", fill: "#9aa3b2", strokeWidth: 1.8, strokeDasharray: undefined },   // IPCA — cinza
];

function styleFor(label, idx) {
  const name = String(label || "").toLowerCase();
  if (name.includes("ipca")) return PALETTE[3];
  if (name.includes("ifha")) return PALETTE[1];
  if (name.includes("alpha")) return PALETTE[2];
  return PALETTE[idx % PALETTE.length];
}

function buildAccumulated(arr = [], mode = "compound") {
  const sorted = [...arr].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  if (mode === "sum") {
    let acc = 0;
    return sorted.map(({ date, rendimento }) => {
      const mensal = Number(rendimento) || 0;
      acc += mensal;
      return { date, rendimento: acc, mensal };
    });
  }
  let accMul = 1;
  return sorted.map(({ date, rendimento }) => {
    const mensal = Number(rendimento) || 0;
    const r = Number(rendimento) / 100;
    accMul *= 1 + (Number.isFinite(r) ? r : 0);
    return { date, rendimento: (accMul - 1) * 100, mensal };
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(28,40,70,0.12)",
      borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 32px rgba(28,40,70,0.12)",
      fontSize: 13, minWidth: 160,
    }}>
      <p style={{ fontWeight: 700, color: "#1c2846", marginBottom: 6 }}>{fmtMes(label)}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.stroke || p.color }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{ptPct(p?.payload?.mensal)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ChartDesempenho({ config }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    let alive = true;
    try {
      const mode = (config.accumulation || "compound").toLowerCase();
      const loaded = (config.series || []).map((s) => {
        const raw = readJson(String(s.source));
        const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.series) ? raw.series : [];
        const data = buildAccumulated(rows, mode);
        const label = s.label || raw?.nome || s.source?.split("/").pop()?.replace(".json", "") || "Série";
        return { label, data, yKey: s.y || "rendimento" };
      });
      if (alive) setSeries(loaded.filter((s) => s.data?.length));
    } catch (e) { console.error(e); }
    return () => { alive = false; };
  }, [config]);

  const baseData = useMemo(() => {
    const set = new Set();
    series.forEach((s) => s.data?.forEach((p) => set.add(p.date)));
    return Array.from(set).sort().map((date) => ({ date }));
  }, [series]);

  if (!series.length) return <div className="h-[460px] grid place-items-center text-sm" style={{ color: "rgba(28,40,70,0.4)" }}>Carregando…</div>;

  const maxY = Math.max(16, ...series.flatMap((s) => s.data.map((d) => Number(d.rendimento) || 0)));
  const top = Math.ceil(maxY / 4) * 4;
  const yTicks = Array.from({ length: Math.floor(top / 4) + 1 }, (_, i) => i * 4);

  return (
    <figure className="w-full" style={{ background: "#e8ecf4", borderRadius: 16, padding: "24px 8px 16px" }}>
      {config.title && (
        <figcaption className="text-center mb-6">
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#1c2846" }}>{config.title}</h2>
          {config.subtitle && <p style={{ color: "rgba(28,40,70,0.5)", fontSize: 13, marginTop: 4 }}>{config.subtitle}</p>}
        </figcaption>
      )}

      <ResponsiveContainer width="100%" height={520}>
        <ComposedChart data={baseData} margin={{ top: 8, right: 180, left: 48, bottom: 28 }}>
          <defs>
            <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1c2846" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#1c2846" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,40,70,0.18)" />
          <XAxis
            dataKey="date" type="category" allowDuplicatedCategory={false}
            tickMargin={8} tick={{ fontSize: 12, fill: "rgba(28,40,70,0.5)" }}
            axisLine={{ stroke: "rgba(28,40,70,0.12)" }} tickLine={false}
          />
          <YAxis
            ticks={yTicks} domain={[0, top]} tickFormatter={(v) => `${v}%`} width={44}
            tick={{ fontSize: 12, fill: "rgba(28,40,70,0.5)" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(28,40,70,0.15)", strokeWidth: 1 }} />

          {series.map((s, idx) => {
            const sty = styleFor(s.label, idx);
            const isMain = idx === 0;
            return isMain ? (
              <>
                <Area
                  key={`area-${idx}`} type="monotone" data={s.data}
                  dataKey={s.yKey} fill="url(#fillPortfolio)"
                  stroke={sty.stroke} strokeWidth={sty.strokeWidth}
                  strokeDasharray={sty.strokeDasharray} dot={false} name={s.label}
                >
                  <LabelList dataKey={s.yKey} position="right" content={({ x, y, value, index }) => {
                    if (index !== s.data.length - 1 || value == null) return null;
                    return <text x={x + 8} y={y + 4} fontSize={13} fontWeight={700} fill={sty.stroke}>{ptPct(value)} {s.label}</text>;
                  }} />
                </Area>
              </>
            ) : (
              <Line
                key={idx} type="monotone" data={s.data} dataKey={s.yKey}
                name={s.label} stroke={sty.stroke} strokeWidth={sty.strokeWidth}
                strokeDasharray={sty.strokeDasharray} dot={false}
              >
                <LabelList dataKey={s.yKey} position="right" content={({ x, y, value, index }) => {
                  if (index !== s.data.length - 1 || value == null) return null;
                  return <text x={x + 8} y={y + 4} fontSize={13} fontWeight={700} fill={sty.stroke}>{ptPct(value)} {s.label}</text>;
                }} />
              </Line>
            );
          })}
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