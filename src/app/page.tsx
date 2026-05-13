export default function HomePage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Strøm<span className="text-brand-blue font-light">Vei</span>
        </h1>
        <p className="text-white/50 text-sm tracking-widest uppercase">
          Lading i Norge
        </p>
        <p className="text-white/30 text-xs mt-8">
          Map loading soon...
        </p>
      </div>
    </div>
  );
}
