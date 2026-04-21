export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-brand/20" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-transparent border-t-brand animate-spin" />
      </div>
      <span className="ml-4 text-sm text-ink-soft">{label}</span>
    </div>
  );
}
