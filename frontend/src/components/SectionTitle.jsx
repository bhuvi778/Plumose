export default function SectionTitle({ kicker, title, subtitle, center = true }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {kicker && <div className="kicker mb-3">{kicker}</div>}
      <h2 className="display text-3xl md:text-5xl">{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-base text-ink-soft leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
