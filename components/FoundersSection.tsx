import Link from "next/link";

const founders = [
  {
    name: "Satya Kota",
    role: "Chief Technology Officer",
    bio: "Software Architect with 13+ years of experience.",
  },
  {
    name: "Avinash Reddy Vanakuri",
    role: "Chief Operating Officer",
    bio: "Manufacturing professional with 13+ years of experience in pump design and production technology.",
  },
];

export default function FoundersSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Founders
        </h2>
        <p className="text-foreground/70 text-lg max-w-2xl mb-12">
          Tejhas was built by operators who understand manufacturing and technology.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
            >
              <h3 className="text-xl font-bold text-foreground">{founder.name}</h3>
              <p className="text-accent font-medium mt-1">{founder.role}</p>
              <p className="text-foreground/80 mt-4">{founder.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/about"
            className="inline-flex items-center text-accent hover:text-accent-hover font-semibold"
          >
            See full story
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
