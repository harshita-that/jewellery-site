import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const experimentId = searchParams.get("experimentId");
  const workspaceId = searchParams.get("workspaceId");

  if (!experimentId || !workspaceId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const experiment = await prisma.experiment.findFirst({
    where: { id: experimentId, workspaceId, status: "RUNNING" },
    include: {
      variants: {
        include: { variant: true },
      },
    },
  });

  if (!experiment || experiment.variants.length === 0) {
    return NextResponse.json({ error: "No active experiment" }, { status: 404 });
  }

  // Weighted random selection
  const total = experiment.variants.reduce((s, v) => s + v.weight, 0);
  let rand = Math.random() * total;
  let selected = experiment.variants[0];
  for (const ev of experiment.variants) {
    rand -= ev.weight;
    if (rand <= 0) { selected = ev; break; }
  }

  return NextResponse.json({ variant: selected.variant });
}