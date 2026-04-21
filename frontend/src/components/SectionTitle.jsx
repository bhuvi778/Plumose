export default function SectionTitle({ kicker, title, subtitle, center = true }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {kicker && (
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-3">{kicker}</div>
      )}
      <h2
        className="text-4xl md:text-5xl text-ink leading-[0.85] tracking-tighter"
        style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
      >
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-sm text-ink/60 max-w-2xl mx-auto font-body leading-relaxed">{subtitle}</p>}
    </div>
  );
}
