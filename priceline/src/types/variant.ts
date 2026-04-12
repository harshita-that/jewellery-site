export type PricingTier = {
  id: string;
  name: string;
  price: number;
  period: "month" | "year";
  description: string;
  features: string[];
  highlighted: boolean;
  ctaText: string;
};

export type VariantConfig = {
  headline: string;
  subheadline: string;
  tiers: PricingTier[];
};

export type VariantWithConfig = {
  id: string;
  name: string;
  slug: string;
  isControl: boolean;
  config: VariantConfig;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
};