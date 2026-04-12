import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, config, workspaceId } = await req.json();

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId, clerkId: userId },
  });
  if (!workspace) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const baseSlug = slugify(name);
  const existing = await prisma.variant.findMany({
    where: { workspaceId, slug: { startsWith: baseSlug } },
  });
  const slug = existing.length > 0 ? `${baseSlug}-${existing.length}` : baseSlug;

  const isControl = (await prisma.variant.count({ where: { workspaceId } })) === 0;

  const variant = await prisma.variant.create({
    data: { name, slug, config, workspaceId, isControl },
  });

  return NextResponse.json(variant);
}