// A BPMN 2.0 collaboration diagram (pool, lanes, events, tasks, exclusive gateway) drawn in SVG, so it stays
// crisp at any size and shows exactly the notation our process work uses. Blue tasks are automation candidates.

const LANES = [
  { label: "Customer", y: 40 },
  { label: "Operations", y: 160 },
  { label: "Finance", y: 280 },
];

const TOKEN_PATH = "M118 100 L188 100 L188 220 L395 220 L410 235 L410 340 L586 340";

function Task({ x, y, label, automated = false }: { x: number; y: number; label: string[]; automated?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={104}
        height={46}
        rx={9}
        fill={automated ? "url(#bpmn-auto)" : "#FFFFFF"}
        stroke={automated ? "#1854CC" : "#7FA9FF"}
        strokeWidth={1.5}
        filter="url(#bpmn-shadow)"
      />
      {automated && (
        <g transform={`translate(${x + 8} ${y + 8})`} stroke="#FFFFFF" strokeWidth={1.3} fill="none">
          <circle cx={5} cy={5} r={2.2} />
          <circle cx={5} cy={5} r={4.6} strokeDasharray="2 1.6" />
        </g>
      )}
      {label.map((line, i) => (
        <text
          key={line}
          x={x + 52}
          y={y + 23 + (i - (label.length - 1) / 2) * 13}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fontWeight={600}
          fill={automated ? "#FFFFFF" : "#161C2C"}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export default function BpmnDiagram() {
  return (
    <figure className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 via-white to-surface p-4 ring-1 ring-ink-900/5 sm:p-6">
      <div
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "radial-gradient(circle, rgba(30,106,255,0.16) 1px, transparent 1px)", backgroundSize: "18px 18px" }}
        aria-hidden
      />
      <svg viewBox="0 0 640 440" className="relative h-auto w-full font-sans" role="img" aria-labelledby="bpmn-title">
        <title id="bpmn-title">
          BPMN future-state process: customer submits a request, operations validates it automatically, an approval gateway
          either notifies the customer or passes it to finance to raise an invoice.
        </title>
        <defs>
          <marker id="bpmn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#123F99" />
          </marker>
          <linearGradient id="bpmn-auto" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82FF" />
            <stop offset="100%" stopColor="#1854CC" />
          </linearGradient>
          <filter id="bpmn-shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1E6AFF" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Header chips */}
        <g fontSize={10} fontWeight={700} letterSpacing={0.6}>
          <rect x={20} y={8} width={78} height={22} rx={11} fill="#123F99" />
          <text x={59} y={23} textAnchor="middle" fill="#FFFFFF">BPMN 2.0</text>
          <rect x={106} y={8} width={92} height={22} rx={11} fill="#FFFFFF" stroke="#ABC7FF" />
          <text x={152} y={23} textAnchor="middle" fill="#123F99">FUTURE STATE</text>
        </g>

        {/* Pool and lanes */}
        <rect x={20} y={40} width={600} height={360} rx={10} fill="#FFFFFF" fillOpacity={0.85} stroke="#123F99" strokeWidth={1.5} />
        <rect x={72} y={160} width={547} height={120} fill="#F3F7FF" />
        <rect x={20} y={40} width={26} height={360} rx={10} fill="#123F99" />
        <text transform="translate(37 220) rotate(-90)" textAnchor="middle" fontSize={11} fontWeight={700} fill="#FFFFFF" letterSpacing={1.5}>
          REQUEST TO INVOICE
        </text>
        {LANES.map((lane, i) => (
          <g key={lane.label}>
            {i > 0 && <line x1={46} y1={lane.y} x2={620} y2={lane.y} stroke="#ABC7FF" strokeWidth={1} />}
            <line x1={72} y1={lane.y} x2={72} y2={lane.y + 120} stroke="#ABC7FF" strokeWidth={1} />
            <text transform={`translate(63 ${lane.y + 60}) rotate(-90)`} textAnchor="middle" fontSize={10} fontWeight={600} fill="#123F99">
              {lane.label}
            </text>
          </g>
        ))}

        {/* Sequence flows */}
        <g stroke="#123F99" strokeWidth={1.5} fill="none" markerEnd="url(#bpmn-arrow)">
          <path d="M118 100 L136 100" />
          <path d="M188 123 L188 220 L258 220" />
          <path d="M362 220 L393 220" />
          <path d="M410 205 L410 100 L448 100" />
          <path d="M410 235 L410 340 L448 340" />
          <path d="M552 100 L584 100" />
          <path d="M552 340 L584 340" />
        </g>
        <text x={418} y={150} fontSize={10} fontWeight={600} fill="#2C3548">No</text>
        <text x={418} y={296} fontSize={10} fontWeight={600} fill="#2C3548">Yes</text>

        {/* Start event */}
        <circle cx={104} cy={100} r={14} fill="#FFFFFF" stroke="#123F99" strokeWidth={1.5} />
        <text x={104} y={128} textAnchor="middle" fontSize={8.5} fill="#2C3548">
          <tspan x={104}>Request</tspan>
          <tspan x={104} dy={10}>received</tspan>
        </text>

        <Task x={136} y={77} label={["Submit", "request"]} />
        <Task x={258} y={197} label={["Validate &", "enrich data"]} automated />

        {/* Exclusive gateway */}
        <g transform="translate(410 220)">
          <rect x={-15} y={-15} width={30} height={30} transform="rotate(45)" fill="#FFFFFF" stroke="#123F99" strokeWidth={1.5} />
          <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#123F99" strokeWidth={2.2} />
        </g>
        <text x={432} y={214} fontSize={10} fontWeight={600} fill="#2C3548">Approved?</text>

        <Task x={448} y={77} label={["Notify", "customer"]} automated />
        <Task x={448} y={317} label={["Raise", "invoice"]} automated />

        {/* Timer boundary event on the invoice task */}
        <g transform="translate(540 363)">
          <circle r={9} fill="#FFFFFF" stroke="#123F99" strokeWidth={1.3} />
          <circle r={6.5} fill="none" stroke="#123F99" strokeWidth={0.8} />
          <path d="M0 -4 L0 0 L3 2" stroke="#123F99" strokeWidth={1} fill="none" />
        </g>

        {/* End events */}
        <circle cx={600} cy={100} r={14} fill="#FFFFFF" stroke="#123F99" strokeWidth={3.5} />
        <circle cx={600} cy={340} r={14} fill="#FFFFFF" stroke="#123F99" strokeWidth={3.5} />

        {/* Token travelling the happy path */}
        <circle r={5} fill="#1E6AFF" stroke="#FFFFFF" strokeWidth={2} className="motion-reduce:hidden">
          <animateMotion dur="7s" repeatCount="indefinite" path={TOKEN_PATH} />
        </circle>

        {/* Legend */}
        <g transform="translate(20 418)" fontSize={10} fill="#2C3548">
          <rect width={14} height={10} rx={2} fill="#1E6AFF" />
          <text x={20} y={9}>Automation candidate</text>
          <rect x={150} width={14} height={10} rx={2} fill="#FFFFFF" stroke="#7FA9FF" />
          <text x={170} y={9}>Manual task</text>
          <circle cx={262} cy={5} r={5} fill="none" stroke="#123F99" />
          <text x={272} y={9}>Start</text>
          <circle cx={318} cy={5} r={5} fill="none" stroke="#123F99" strokeWidth={2.5} />
          <text x={328} y={9}>End</text>
          <circle cx={370} cy={5} r={5} fill="none" stroke="#123F99" />
          <circle cx={370} cy={5} r={3} fill="none" stroke="#123F99" strokeWidth={0.6} />
          <text x={380} y={9}>Timer (SLA)</text>
        </g>
      </svg>
    </figure>
  );
}
