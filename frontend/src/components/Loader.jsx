export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-20 text-saffron-700">
      <div className="animate-spin w-8 h-8 border-2 border-saffron-400 border-t-transparent rounded-full" />
      <span className="ml-3 text-sm">{label}</span>
    </div>
  );
}
