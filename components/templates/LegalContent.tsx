interface LegalSection {
  heading: string;
  body: string;
}

export default function LegalContent({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-page mx-auto max-w-3xl">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-bold text-ink-900">{section.heading}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
