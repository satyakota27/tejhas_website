const stats = [
  { value: "Simple", label: "Intuitive workflows" },
  { value: "Efficient", label: "Built for speed" },
  { value: "Adaptive", label: "Fits your business" },
];

export default function StatsSection() {
  return (
    <section className="py-12 md:py-16 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map(({ value, label }) => (
            <div key={value} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-accent">{value}</p>
              <p className="text-foreground/70 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
