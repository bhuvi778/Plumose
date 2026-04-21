export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-20 text-ink">
      <div className="w-6 h-6 border-2 border-ink border-t-transparent animate-spin" />
      <span className="ml-3 text-xs uppercase tracking-widest font-mono text-ink/50">{label}</span>
    </div>
  );
}
