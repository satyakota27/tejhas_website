import Link from "next/link";

export default function WhyTejhasSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Why Tejhas Exists
        </h2>
        <div className="max-w-3xl">
          <p className="text-lg text-foreground/90 leading-relaxed mb-6">
            Tejhas was built by a manufacturer who could not find ERP software that was flexible,
            affordable, and grounded in real operational challenges. Tejhas helps leaders stop
            daily firefighting and start working on strategic growth.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center text-accent hover:text-accent-hover font-semibold"
          >
            Meet the founders
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
