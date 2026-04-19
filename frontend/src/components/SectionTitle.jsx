export default function SectionTitle({ kicker, title, subtitle, center = true }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {kicker && <div className="inline-block chip mb-3 font-devanagari text-saffron-700">{kicker}</div>}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-maroon-900">{title}</h2>
      {subtitle && <p className="mt-3 text-maroon-700/80 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}
