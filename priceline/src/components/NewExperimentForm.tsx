"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Variant } from "@prisma/client";

export default function NewExperimentForm({
  variants,
  workspaceId,
}: {
  variants: Variant[];
  workspaceId: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("Experiment 1");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  async function create() {
    if (selected.length < 2) return alert("Select at least 2 variants");
    setSaving(true);
    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, variantIds: selected, workspaceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/experiments/${data.id}`);
      router.refresh();
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <label className="text-white/40 text-xs block mb-1">Experiment name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
        />
      </div>
      <div>
        <label className="text-white/40 text-xs block mb-2">Select variants (min 2)</label>
        <div className="space-y-2">
          {variants.map((v) => (
            <label
              key={v.id}
              className="flex items-center gap-3 border border-white/10 rounded-lg px-4 py-3 cursor-pointer hover:border-white/30 transition"
            >
              <input
                type="checkbox"
                checked={selected.includes(v.id)}
                onChange={() => toggle(v.id)}
                className="accent-white"
              />
              <span className="text-sm">{v.name}</span>
              {v.isControl && (
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-auto">
                  Control
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={create}
        disabled={saving}
        className="w-full bg-white text-black font-medium py-3 rounded-xl text-sm hover:bg-white/90 transition disabled:opacity-50"
      >
        {saving ? "Creating..." : "Create experiment"}
      </button>
    </div>
  );
}