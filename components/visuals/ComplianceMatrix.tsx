// Illustrative control-mapping view: each finding traced to the clause it affects in every framework.
// References are real clause/control IDs (ISO/IEC 27001:2022 Annex A, NIST CSF 2.0, PCI DSS v4.0.1, UK GDPR,
// Cyber Essentials) so the example reads the way an auditor would expect.

const frameworks = ["ISO 27001", "NIST CSF 2.0", "PCI DSS 4.0.1", "UK GDPR", "Cyber Essentials"];

const findings: { label: string; severity: "Critical" | "High" | "Medium"; refs: (string | null)[] }[] = [
  { label: "Unpatched internet-facing VPN", severity: "Critical", refs: ["A.8.8", "ID.RA-01", "6.3.3", "Art. 32", "Updates"] },
  { label: "No MFA on admin accounts", severity: "High", refs: ["A.8.5", "PR.AA-03", "8.4.1", "Art. 32", "Access"] },
  { label: "Backups stored unencrypted", severity: "Medium", refs: ["A.8.24", "PR.DS-11", "3.5.1", "Art. 32(1)(a)", null] },
  { label: "Dormant user accounts", severity: "Medium", refs: ["A.5.18", "PR.AA-05", "8.2.6", "Art. 5(1)(f)", "Access"] },
];

const severityStyle = {
  Critical: "bg-red-500",
  High: "bg-orange-400",
  Medium: "bg-amber-300",
};

export default function ComplianceMatrix() {
  return (
    <figure className="relative w-full overflow-hidden rounded-2xl bg-ink-900 p-5 text-white shadow-2xl sm:p-6">
      <div className="absolute inset-0 bg-grid-dark opacity-30" aria-hidden />
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/25 blur-3xl" aria-hidden />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-400">Control mapping</p>
            <p className="mt-1 text-sm font-bold">4 findings → 5 frameworks</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-white/50">
            {(["Critical", "High", "Medium"] as const).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${severityStyle[s]}`} /> {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] border-separate border-spacing-y-1.5 text-left text-xs">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-white/40">
                <th className="pb-1 pr-3 font-semibold">Finding</th>
                {frameworks.map((f) => (
                  <th key={f} className="pb-1 text-center font-semibold">{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {findings.map((row) => (
                <tr key={row.label}>
                  <td className="rounded-l-lg bg-white/[0.05] py-2.5 pl-3 pr-3 font-medium text-white/85">
                    <span className="inline-flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${severityStyle[row.severity]}`} />
                      {row.label}
                    </span>
                  </td>
                  {row.refs.map((ref, i) => (
                    <td key={frameworks[i]} className={`bg-white/[0.05] px-1.5 py-2.5 text-center ${i === row.refs.length - 1 ? "rounded-r-lg" : ""}`}>
                      {ref ? (
                        <span className="inline-block rounded-md bg-primary-500/15 px-2 py-1 font-mono text-[10.5px] text-primary-300 ring-1 ring-inset ring-primary-400/30">
                          {ref}
                        </span>
                      ) : (
                        <span className="text-white/25">n/a</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary-400/20 bg-primary-500/10 px-4 py-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary-500 to-primary-300" />
          </div>
          <p className="shrink-0 text-[11px] font-semibold text-white/70">Evidence coverage 72%</p>
        </div>
        <figcaption className="mt-3 text-[10px] text-white/35">Illustrative example. Fix one finding, close it everywhere it&apos;s mapped.</figcaption>
      </div>
    </figure>
  );
}
