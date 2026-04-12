import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const experimentId = searchParams.get("experimentId");
  if (!experimentId) return NextResponse.json({ error: "Missing experimentId" }, { status: 400 });

  const experiment = await prisma.experiment.findUnique({
    where: { id: experimentId },
    include: { workspace: true, variants: { include: { variant: true } } },
  });

  if (!experiment || experiment.workspace.clerkId !== userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const variantIds = experiment.variants.map((v) => v.variantId);

  const events = await prisma.event.groupBy({
    by: ["variantId", "eventType"],
    where: { experimentId, variantId: { in: variantIds } },
    _count: { id: true },
  });

  const stats = variantIds.map((vid) => {
    const variantInfo = experiment.variants.find((v) => v.variantId === vid)!;
    const views = events.find((e) => e.variantId === vid && e.eventType === "page_view")?._count.id ?? 0;
    const clicks = events.find((e) => e.variantId === vid && e.eventType === "cta_click")?._count.id ?? 0;
    const conversions = events.find((e) => e.variantId === vid && e.eventType === "conversion")?._count.id ?? 0;
    return {
      variantId: vid,
      variantName: variantInfo.variant.name,
      isControl: variantInfo.variant.isControl,
      views,
      clicks,
      conversions,
      ctr: views > 0 ? (clicks / views) * 100 : 0,
      conversionRate: views > 0 ? (conversions / views) * 100 : 0,
    };
  });

  return NextResponse.json({ experiment, stats });
}