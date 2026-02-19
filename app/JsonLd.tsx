const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tejhas.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "Tejhas",
      url: BASE_URL,
      description:
        "Tejhas is ERP, MRP and CRM software for MSMEs. Material resource planning and manufacturing ERP that adapts to how you work.",
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Tejhas",
      url: BASE_URL,
      description:
        "Tejhas—ERP, MRP and CRM for MSMEs. Built for manufacturing and material resource planning.",
    },
    {
      "@type": "SoftwareApplication",
      name: "Tejhas",
      applicationCategory: "BusinessApplication",
      description:
        "Tejhas ERP, MRP and CRM software for MSMEs. Material resource planning and manufacturing ERP designed for how you actually work.",
      url: BASE_URL,
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
