import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  let workspace = await prisma.workspace.findUnique({
    where: { clerkId: userId },
    include: { variants: true, experiments: true },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { clerkId: userId, name: "My Workspace" },
      include: { variants: true, experiments: true },
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-white/50 text-sm mt-1">
            {workspace.variants.length} variants · {workspace.experiments.length} experiments
          </p>
        </div>
        <Link
          href="/dashboard/variants/new"
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition"
        >
          New Variant
        </Link>
      </div>

      {workspace.variants.length === 0 ? (
        <div className="border border-white/10 rounded-xl p-16 text-center">
          <p className="text-white/40 text-sm">No variants yet.</p>
          <Link
            href="/dashboard/variants/new"
            className="mt-4 inline-block text-white underline underline-offset-4 text-sm"
          >
            Create your first variant →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspace.variants.map((v) => (
            <Link
              key={v.id}
              href={`/dashboard/variants/${v.id}`}
              className="border border-white/10 rounded-xl p-5 hover:border-white/30 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{v.name}</span>
                {v.isControl && (
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    Control
                  </span>
                )}
              </div>
              <p className="text-white/40 text-xs font-mono">{v.slug}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}