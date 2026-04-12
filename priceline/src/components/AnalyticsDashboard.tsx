"use client";

import { useEffect, useState } from "react";

type VariantStat = {
  variantId: string;
  variantName: string;
  isControl: boolean;
  views: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
};

export default function AnalyticsDashboard({ experimentId }: { experimentId: string }) {
  const [stats, setStats] = useState<VariantStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [significance, setSignificance] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch(`/api/analytics?experimentId=${experimentId}`)
      .then((r) => r.json())
      .then((data) => {
        setStats(data.stats ?? []);
        if (data.stats?.length >= 2) {
          const sig = calculateSignificance(data.stats);
          setSignificance(sig);
        }
        setLoading(false);
      });
  }, [experimentId]);

  // Welch's t-test from scratch
  function calculateSignificance(variants: VariantStat[]) {
    const control = variants.find((v) => v.isControl);
    if (!control) return {};
    const result: Record<string, number> = {};

    variants.forEach((v) => {
      if (v.variantId === control.variantId) return;
      if (control.views < 2 || v.views < 2) { result[v.variantId] = 0; return; }

      const p1 = control.conversions / (control.views || 1);
      const p2 = v.conversions / (v.views || 1);
      const se1 = (p1 * (1 - p1)) / control.views;
      const se2 = (p2 * (1 - p2)) / v.views;
      const se = Math.sqrt(se1 + se2);
      if (se === 0) { result[v.variantId] = 0; return; }

      const t = Math.abs(p1 - p2) / se;
      // Approximate p-value using normal distribution
      const pValue = 2 * (1 - normalCDF(t));
      result[v.variantId] = Math.round((1 - pValue) * 100);
    });

    return result;
  }

  function normalCDF(z: number): number {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);
    const t = 1 / (1 + p * z);
    const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    return 0.5 * (1 + sign * y);
  }

  if (loading) return <p className="text-white/40 text-sm">Loading analytics...</p>;
  if (stats.length === 0) return <p className="text-white/40 text-sm">No data yet.</p>;

  return (
    <div className="space-y-4">
      {stats.map((v) => {
        const sig = significance[v.variantId];
        const isWinning = sig !== undefined && sig >= 95;
        return (
          <div key={v.variantId} className="border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{v.variantName}</span>
                {v.isControl && (
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Control</span>
                )}
                {isWinning && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                    Winner ({sig}% confidence)
                  </span>
                )}
              </div>
              {sig !== undefined && !v.isControl && (
                <span className="text-xs text-white/40">{sig}% significance</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Views", value: v.views },
                { label: "Clicks", value: v.clicks },
                { label: "CTR", value: v.ctr.toFixed(1) + "%" },
                { label: "Conv. rate", value: v.conversionRate.toFixed(1) + "%" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-white/40 text-xs mb-1">{stat.label}</p>
                  <p className="font-semibold text-lg">{stat.value}</p>
                </div>
              ))}
            </div>
            {!v.isControl && sig !== undefined && (
              <div className="mt-4">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${sig >= 95 ? "bg-green-500" : sig >= 80 ? "bg-yellow-500" : "bg-white/30"}`}
                    style={{ width: `${Math.min(sig, 100)}%` }}
                  />
                </div>
                <p className="text-white/30 text-xs mt-1">
                  {sig >= 95 ? "Statistically significant winner" : sig >= 80 ? "Trending — needs more data" : "Not significant yet"}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}