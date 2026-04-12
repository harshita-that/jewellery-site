import { auth } from "@clerk/nextjs";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default async function ExperimentPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const experiment = await prisma.experiment.findUnique({
    where: { id: params.id },
    include: { workspace: true, variants: { include: { variant: true } } },
  });

  if (!experiment || experiment.workspace.clerkId !== userId) notFound();

  const embedSnippet = `<div id="pricing"></div>
<script
  src="https://your-domain.vercel.app/priceline.js"
  data-priceline
  data-workspace="${experiment.workspaceId}"
  data-experiment="${experiment.id}"
  data-container="pricing"
></script>`;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">{experiment.name}</h1>
          <p className="text-white/40 text-sm mt-1">
            {experiment.variants.length} variants · {experiment.status}
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-sm font-medium mb-3">Embed snippet</h2>
        <pre className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/70 overflow-x-auto">
          {embedSnippet}
        </pre>
      </div>

      <h2 className="text-sm font-medium mb-4">Results</h2>
      <AnalyticsDashboard experimentId={experiment.id} />
    </div>
  );
}