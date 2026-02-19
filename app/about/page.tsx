import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Tejhas",
  description: "Meet the founders of Tejhas—ERP built for MSMEs by operators who understand manufacturing and technology.",
};

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

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
        About Tejhas
      </h1>
      <p className="text-lg text-foreground/80 leading-relaxed mb-16">
        Tejhas is an ERP built for MSMEs by people who have run manufacturing and built software.
        We believe ERP should adapt to your organization—not force you to change how you work.
      </p>

      <h2 className="text-2xl font-bold text-foreground mb-8">Founders</h2>
      <div className="space-y-12">
        {founders.map((founder) => (
          <div
            key={founder.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-8"
          >
            <h3 className="text-2xl font-bold text-foreground">{founder.name}</h3>
            <p className="text-accent font-semibold mt-1">{founder.role}</p>
            <p className="text-foreground/80 mt-4 text-lg">{founder.bio}</p>
            <p className="text-foreground/50 text-sm mt-4 italic">
              More details to be added.
            </p>
          </div>
        ))}
      </div>

      <p className="mt-16 text-foreground/60 text-sm max-w-xl">
        Our story and team details will be updated here. Get in touch if you would
        like to learn more about Tejhas.
      </p>
    </div>
  );
}
