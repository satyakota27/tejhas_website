const items = [
  {
    title: "Clean User Interface",
    description: "Tejhas focuses on intuitive, role-based interfaces that users actually enjoy using.",
  },
  {
    title: "Meaningful Reports",
    description: "Decision makers can visualize data in ways that align with organizational goals.",
  },
];

export default function DesignSection() {
  return (
    <section className="py-16 md:py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Design & Decision Making
        </h2>
        <p className="text-foreground/70 text-lg max-w-2xl mb-12">
          Built for clarity and action.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
            >
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-foreground/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
