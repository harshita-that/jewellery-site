"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

type Suggestions = {
  headlines: string[];
  subheadlines: string[];
  featureSuggestions: string[];
};

export default function AISuggestions({
  onApply,
}: {
  onApply: (headline: string, subheadline: string) => void;
}) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);

  async function generate() {
    if (!description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productDescription: description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuggestions(data);
    } catch (err) {
      alert("AI error: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-white/10 rounded-xl p-5 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={15} className="text-white/60" />
        <span className="text-sm font-medium">AI copy suggestions</span>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your product in 2–3 sentences..."
        rows={3}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30 resize-none mb-3"
      />

      <button
        onClick={generate}
        disabled={loading || !description.trim()}
        className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition disabled:opacity-40 flex items-center gap-2"
      >
        <Sparkles size={13} />
        {loading ? "Generating..." : "Generate suggestions"}
      </button>

      {suggestions && (
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-white/40 text-xs mb-2">Headlines — click to apply</p>
            <div className="space-y-2">
              {suggestions.headlines.map((h, i) => (
                <button
                  key={i}
                  onClick={() => onApply(h, suggestions.subheadlines[i] ?? "")}
                  className="w-full text-left text-sm border border-white/10 rounded-lg px-3 py-2 hover:border-white/40 hover:bg-white/5 transition"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/40 text-xs mb-2">Feature suggestions</p>
            <ul className="space-y-1">
              {suggestions.featureSuggestions.map((f, i) => (
                <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                  <span className="text-white/20 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}