"use client";
import AISuggestions from "@/components/AISuggestions";t
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PricingTier, VariantConfig } from "@/types/variant";
import { GripVertical, Plus, Trash2, Star } from "lucide-react";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function defaultTier(name: string): PricingTier {
  return {
    id: generateId(),
    name,
    price: 0,
    period: "month",
    description: "Perfect for getting started",
    features: ["Feature one", "Feature two", "Feature three"],
    highlighted: false,
    ctaText: "Get started",
  };
}

function SortableTier({
  tier,
  onChange,
  onDelete,
}: {
  tier: PricingTier;
  onChange: (updated: PricingTier) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tier.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  function updateFeature(index: number, value: string) {
    const features = [...tier.features];
    features[index] = value;
    onChange({ ...tier, features });
  }

  function addFeature() {
    onChange({ ...tier, features: [...tier.features, "New feature"] });
  }

  function removeFeature(index: number) {
    onChange({ ...tier, features: tier.features.filter((_, i) => i !== index) });
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-xl p-5 bg-black transition ${
        tier.highlighted ? "border-white" : "border-white/20"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <button
          {...attributes}
          {...listeners}
          className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        <input
          value={tier.name}
          onChange={(e) => onChange({ ...tier, name: e.target.value })}
          className="bg-transparent font-semibold text-sm flex-1 outline-none border-b border-transparent focus:border-white/30 pb-0.5"
          placeholder="Tier name"
        />
        <button
          onClick={() => onChange({ ...tier, highlighted: !tier.highlighted })}
          className={`transition ${tier.highlighted ? "text-yellow-400" : "text-white/20 hover:text-white/50"}`}
          title="Mark as highlighted"
        >
          <Star size={15} fill={tier.highlighted ? "currentColor" : "none"} />
        </button>
        <button
          onClick={onDelete}
          className="text-white/20 hover:text-red-400 transition"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-white/40 text-xs block mb-1">Price ($)</label>
          <input
            type="number"
            value={tier.price}
            onChange={(e) => onChange({ ...tier, price: Number(e.target.value) })}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="text-white/40 text-xs block mb-1">Period</label>
          <select
            value={tier.period}
            onChange={(e) =>
              onChange({ ...tier, period: e.target.value as "month" | "year" })
            }
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
          >
            <option value="month">/ month</option>
            <option value="year">/ year</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-white/40 text-xs block mb-1">Description</label>
        <input
          value={tier.description}
          onChange={(e) => onChange({ ...tier, description: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
          placeholder="Short description"
        />
      </div>

      <div className="mb-4">
        <label className="text-white/40 text-xs block mb-1">CTA Button Text</label>
        <input
          value={tier.ctaText}
          onChange={(e) => onChange({ ...tier, ctaText: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
          placeholder="Get started"
        />
      </div>

      <div>
        <label className="text-white/40 text-xs block mb-2">Features</label>
        <div className="space-y-2">
          {tier.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={f}
                onChange={(e) => updateFeature(i, e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm flex-1 outline-none focus:border-white/30"
              />
              <button
                onClick={() => removeFeature(i)}
                className="text-white/20 hover:text-red-400 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addFeature}
          className="mt-2 text-white/40 hover:text-white text-xs flex items-center gap-1 transition"
        >
          <Plus size={12} /> Add feature
        </button>
      </div>
    </div>
  );
}

export default function VariantBuilder({
  initialData,
  variantId,
  workspaceId,
}: {
  initialData?: { name: string; config: VariantConfig };
  variantId?: string;
  workspaceId: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(initialData?.name ?? "Variant A");
  const [config, setConfig] = useState<VariantConfig>(
    initialData?.config ?? {
      headline: "Simple, transparent pricing",
      subheadline: "No hidden fees. Cancel anytime.",
      tiers: [
        defaultTier("Basic"),
        { ...defaultTier("Pro"), price: 29, highlighted: true, ctaText: "Start free trial" },
        { ...defaultTier("Enterprise"), price: 99, ctaText: "Contact sales" },
      ],
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = config.tiers.findIndex((t) => t.id === active.id);
      const newIndex = config.tiers.findIndex((t) => t.id === over.id);
      setConfig({ ...config, tiers: arrayMove(config.tiers, oldIndex, newIndex) });
    }
  }

  function updateTier(id: string, updated: PricingTier) {
    setConfig({
      ...config,
      tiers: config.tiers.map((t) => (t.id === id ? updated : t)),
    });
  }

  function deleteTier(id: string) {
    setConfig({ ...config, tiers: config.tiers.filter((t) => t.id !== id) });
  }

  function addTier() {
    setConfig({
      ...config,
      tiers: [...config.tiers, defaultTier(`Tier ${config.tiers.length + 1}`)],
    });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(
        variantId ? `/api/variants/${variantId}` : "/api/variants",
        {
          method: variantId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, config, workspaceId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/dashboard/variants/${data.id}`);
      router.refresh();
    } catch (err) {
      alert("Save failed: " + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Editor */}
      <div>
        <div className="mb-6">
          <label className="text-white/40 text-xs block mb-1">Variant Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
          />
        </div>
        <div className="mb-6">
          <label className="text-white/40 text-xs block mb-1">Headline</label>
          <input
            value={config.headline}
            onChange={(e) => setConfig({ ...config, headline: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
          />
        </div>
        <div className="mb-6">
          <label className="text-white/40 text-xs block mb-1">Subheadline</label>
          <input
            value={config.subheadline}
            onChange={(e) => setConfig({ ...config, subheadline: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-white/30"
          />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={config.tiers.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {config.tiers.map((tier) => (
                <SortableTier
                  key={tier.id}
                  tier={tier}
                  onChange={(updated) => updateTier(tier.id, updated)}
                  onDelete={() => deleteTier(tier.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          onClick={addTier}
          className="mt-4 w-full border border-dashed border-white/20 rounded-xl py-3 text-white/40 hover:text-white hover:border-white/40 text-sm transition flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add tier
        </button>

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 w-full bg-white text-black font-medium py-3 rounded-xl text-sm hover:bg-white/90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : variantId ? "Save changes" : "Create variant"}
        </button>
        <AISuggestions
  onApply={(headline, subheadline) =>
    setConfig((c) => ({ ...c, headline, subheadline }))
  }
/>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-8 h-fit">
        <p className="text-white/40 text-xs mb-4 uppercase tracking-widest">Live preview</p>
        <div className="border border-white/10 rounded-xl p-6 bg-white/2">
          <h2 className="text-xl font-semibold text-center mb-1">{config.headline}</h2>
          <p className="text-white/50 text-sm text-center mb-8">{config.subheadline}</p>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(config.tiers.length, 3)}, 1fr)` }}>
            {config.tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-xl p-4 border ${
                  tier.highlighted
                    ? "border-white bg-white/5"
                    : "border-white/10"
                }`}
              >
                <p className="font-semibold text-sm mb-1">{tier.name}</p>
                <p className="text-2xl font-bold mb-1">
                  ${tier.price}
                  <span className="text-sm font-normal text-white/40">/{tier.period}</span>
                </p>
                <p className="text-white/40 text-xs mb-4">{tier.description}</p>
                <ul className="space-y-1 mb-4">
                  {tier.features.map((f, i) => (
                    <li key={i} className="text-xs text-white/60 flex items-center gap-1">
                      <span className="text-white/30">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full text-xs py-2 rounded-lg font-medium transition ${
                    tier.highlighted
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {tier.ctaText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}