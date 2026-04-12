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
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/experiments/new"
            className="border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-lg hover:border-white/50 transition"
          >
            New experiment
          </Link>
          <Link
            href="/dashboard/variants/new"
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition"
          >
            New variant
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-sm text-white/40 uppercase tracking-widest mb-4">Experiments</h2>
        {workspace.experiments.length === 0 ? (
          <div className="border border-white/10 rounded-xl p-10 text-center">
            <p className="text-white/30 text-sm">No experiments yet. Create 2+ variants first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspace.experiments.map((e) => (
              <Link
                key={e.id}
                href={`/dashboard/experiments/${e.id}`}
                className="border border-white/10 rounded-xl p-5 hover:border-white/30 transition"
              >
                <p className="font-medium text-sm mb-1">{e.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  e.status === "RUNNING"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/10 text-white/40"
                }`}>
                  {e.status.toLowerCase()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm text-white/40 uppercase tracking-widest mb-4">Variants</h2>
        {workspace.variants.length === 0 ? (
          <div className="border border-white/10 rounded-xl p-10 text-center">
            <p className="text-white/30 text-sm">No variants yet.</p>
            <Link href="/dashboard/variants/new" className="mt-3 inline-block text-white underline text-sm">
              Create your first →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspace.variants.map((v) => (
              <Link
                key={v.id}
                href={`/dashboard/variants/${v.id}`}
                className="border border-white/10 rounded-xl p-5 hover:border-white/30 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{v.name}</span>
                  {v.isControl && (
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Control</span>
                  )}
                </div>
                <p className="text-white/30 text-xs font-mono">{v.slug}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}