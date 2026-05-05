export default function GSection({ id, label, title, children, subtle }) {
  const cx = (...c) => c.filter(Boolean).join(" ");
  return (
    <section id={id} className={cx("scroll-mt-24 border-t border-[#d6d6d6] py-24", subtle ? "bg-[#f5f5f7]" : "bg-white")}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <p className="label-upper">{label}</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#1c2846] md:text-4xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
