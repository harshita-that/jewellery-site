import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { workspaceId, experimentId, variantId, sessionId, eventType, metadata } =
      await req.json();

    if (!workspaceId || !experimentId || !variantId || !sessionId || !eventType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        workspaceId,
        experimentId,
        variantId,
        sessionId,
        eventType,
        metadata: metadata ?? {},
      },
    });

    return NextResponse.json({ ok: true, id: event.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}