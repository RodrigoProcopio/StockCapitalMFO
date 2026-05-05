export default function Toast({ open, message, variant = "error", onClose }) {
  if (!open) return null;
  const bg = variant === "success" ? "bg-emerald-600 border-emerald-400"
           : variant === "warning" ? "bg-amber-500 border-amber-300"
           : "bg-red-600 border-red-400";
  return (
    <div className="fixed top-4 inset-x-0 z-[100] flex justify-center px-4">
      <div className={`w-full max-w-md text-white border rounded-2xl shadow-xl px-4 py-3 flex items-start gap-3 ${bg}`} role="alert">
        <span className="mt-0.5 text-sm whitespace-pre-line">{message}</span>
        <button onClick={onClose} className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 hover:bg-white/25" aria-label="Fechar">×</button>
      </div>
    </div>
  );
}
