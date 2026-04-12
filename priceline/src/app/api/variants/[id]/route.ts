import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, config } = await req.json();

  const variant = await prisma.variant.findUnique({
    where: { id: params.id },
    include: { workspace: true },
  });

  if (!variant || variant.workspace.clerkId !== userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.variant.update({
    where: { id: params.id },
    data: { name, config },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const variant = await prisma.variant.findUnique({
    where: { id: params.id },
    include: { workspace: true },
  });

  if (!variant || variant.workspace.clerkId !== userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.variant.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}