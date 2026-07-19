import React from 'react';

export default function AnalyticsView() {
  const models = [
    { name: 'Gemini 1.5 Pro', percentage: 48, color: 'var(--color-primary)' },
    { name: 'Claude 3.5 Sonnet', percentage: 32, color: 'var(--color-secondary)' },
    { name: 'GPT-4o', percentage: 15, color: 'var(--color-primary-container)' },
    { name: 'Llama-3 (Groq)', percentage: 5, color: 'var(--color-secondary-container)' }
  ];

  return (
    <div className="view-content-wrapper bg-background text-on-surface">
      {/* Header */}
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface">Telemetry & Analytics</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Real-time metrics on token consumption, operational costs, model distribution, and agent latency.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-lg">
        {/* SVG Line Chart: Token Usage Over Time */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-md border border-white/10 hover:border-white/20 transition-all bg-white/[0.02] backdrop-blur-md">
          <div>
            <h3 className="font-headline-md text-base text-on-surface">Daily Token Usage</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Usage metrics over the past 7 days</p>
          </div>

          <div className="relative w-full h-48">
            <svg viewBox="0 0 400 180" className="w-full h-full">
              <defs>
                <linearGradient id="area-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.03)" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="rgba(255,255,255,0.03)" />
              <line x1="40" y1="100" x2="380" y2="100" stroke="rgba(255,255,255,0.03)" />
              <line x1="40" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />

              {/* Chart Line Path */}
              <path
                d="M 40 130 Q 90 90 140 110 T 240 60 T 340 40 T 380 30"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                className="glow-effect"
              />

              {/* Glow Fill Area */}
              <path
                d="M 40 130 Q 90 90 140 110 T 240 60 T 340 40 T 380 30 L 380 140 L 40 140 Z"
                fill="url(#area-glow)"
              />

              {/* Dots on points */}
              <circle cx="90" cy="110" r="3" fill="#fff" stroke="var(--color-primary)" strokeWidth="2" />
              <circle cx="240" cy="60" r="3" fill="#fff" stroke="var(--color-primary)" strokeWidth="2" />
              <circle cx="380" cy="30" r="4" fill="#fff" stroke="var(--color-primary)" strokeWidth="2" className="agent-pulse" />

              {/* Axis Labels */}
              <text x="35" y="155" fill="var(--color-on-surface-variant)" fontSize="9" opacity="0.6">Mon</text>
              <text x="135" y="155" fill="var(--color-on-surface-variant)" fontSize="9" opacity="0.6">Wed</text>
              <text x="235" y="155" fill="var(--color-on-surface-variant)" fontSize="9" opacity="0.6">Fri</text>
              <text x="365" y="155" fill="var(--color-on-surface-variant)" fontSize="9" opacity="0.6">Sun</text>

              <text x="15" y="25" fill="var(--color-on-surface-variant)" fontSize="9" opacity="0.6">2.0M</text>
              <text x="15" y="105" fill="var(--color-on-surface-variant)" fontSize="9" opacity="0.6">0.5M</text>
            </svg>
          </div>
        </div>

        {/* SVG Bar Chart: Agent Latency / Performance */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-md border border-white/10 hover:border-white/20 transition-all bg-white/[0.02] backdrop-blur-md">
          <div>
            <h3 className="font-headline-md text-base text-on-surface">Agent Response Latency</h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-0.5">Average round-trip delay per agent role</p>
          </div>

          <div className="relative w-full h-48">
            <svg viewBox="0 0 400 180" className="w-full h-full">
              {/* Bars */}
              <rect x="50" y="50" width="22" height="90" rx="3" fill="var(--color-primary)" opacity="0.8" />
              <text x="61" y="42" fill="var(--color-on-surface)" fontSize="8" textAnchor="middle">120ms</text>
              
              <rect x="110" y="30" width="22" height="110" rx="3" fill="var(--color-secondary)" opacity="0.8" />
              <text x="121" y="22" fill="var(--color-on-surface)" fontSize="8" textAnchor="middle">240ms</text>
              
              <rect x="170" y="80" width="22" height="60" rx="3" fill="var(--color-primary-container)" opacity="0.8" />
              <text x="181" y="72" fill="var(--color-on-surface)" fontSize="8" textAnchor="middle">380ms</text>
              
              <rect x="230" y="40" width="22" height="100" rx="3" fill="var(--color-primary)" opacity="0.8" />
              <text x="241" y="32" fill="var(--color-on-surface)" fontSize="8" textAnchor="middle">430ms</text>
              
              <rect x="290" y="20" width="22" height="120" rx="3" fill="var(--color-secondary)" opacity="0.8" />
              <text x="301" y="12" fill="var(--color-on-surface)" fontSize="8" textAnchor="middle">510ms</text>

              <rect x="350" y="60" width="22" height="80" rx="3" fill="var(--color-secondary-container)" opacity="0.8" />
              <text x="361" y="52" fill="var(--color-on-surface)" fontSize="8" textAnchor="middle">190ms</text>

              {/* Axis Line */}
              <line x1="30" y1="140" x2="380" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="61" y="155" fill="var(--color-on-surface-variant)" fontSize="8" textAnchor="middle" opacity="0.6">CEO</text>
              <text x="121" y="155" fill="var(--color-on-surface-variant)" fontSize="8" textAnchor="middle" opacity="0.6">PM</text>
              <text x="181" y="155" fill="var(--color-on-surface-variant)" fontSize="8" textAnchor="middle" opacity="0.6">UI</text>
              <text x="241" y="155" fill="var(--color-on-surface-variant)" fontSize="8" textAnchor="middle" opacity="0.6">FE</text>
              <text x="301" y="155" fill="var(--color-on-surface-variant)" fontSize="8" textAnchor="middle" opacity="0.6">BE</text>
              <text x="361" y="155" fill="var(--color-on-surface-variant)" fontSize="8" textAnchor="middle" opacity="0.6">QA</text>
            </svg>
          </div>
        </div>

        {/* Model Distribution Donut Chart */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-md border border-white/10 hover:border-white/20 transition-all bg-white/[0.02] backdrop-blur-md">
          <h3 className="font-headline-md text-base text-on-surface">Active LLM Provider Share</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-lg">
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                
                {/* Gemini 48% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-primary)" strokeWidth="4"
                        strokeDasharray="48 100" strokeDashoffset="0" />
                
                {/* Claude 32% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-secondary)" strokeWidth="4"
                        strokeDasharray="32 100" strokeDashoffset="-48" />

                {/* GPT-4o 15% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-primary-container)" strokeWidth="4"
                        strokeDasharray="15 100" strokeDashoffset="-80" />

                {/* Llama-3 5% */}
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--color-secondary-container)" strokeWidth="4"
                        strokeDasharray="5 100" strokeDashoffset="-95" />
              </svg>
              {/* Inner details text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
                <span className="text-on-surface-variant opacity-60">Total Cost</span>
                <span className="font-bold text-white mt-0.5">$214.85</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="flex flex-col gap-sm flex-1 w-full">
              {models.map((m, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="width w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: m.color }}></span>
                    <span className="text-on-surface-variant">{m.name}</span>
                  </div>
                  <span className="font-bold text-on-surface">{m.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evaluation Metrics panel */}
        <div className="glass-panel rounded-xl p-md flex flex-col gap-md border border-white/10 hover:border-white/20 transition-all bg-white/[0.02] backdrop-blur-md">
          <h3 className="font-headline-md text-base text-on-surface">Model Quality Evaluation</h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Systemic benchmarks compiled from prompt responses, scanning for grounding and hallucination values.
          </p>

          <div className="flex flex-col gap-sm text-sm">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-on-surface-variant">Groundedness / RAG Faithfulness</span>
              <span className="text-[#4ade80] font-bold">98.9% Acc</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-on-surface-variant">Hallucination Validation Index</span>
              <span className="text-[#4ade80] font-bold">0.8% Rate</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-on-surface-variant">Safety Compliance Alignment</span>
              <span className="text-primary font-bold">100% Secure</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-on-surface-variant">Agent Task Completion Rate</span>
              <span className="text-secondary font-bold">96.5% Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
