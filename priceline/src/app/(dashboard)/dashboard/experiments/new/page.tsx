import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NewExperimentForm from "@/components/NewExperimentForm";

export default async function NewExperimentPage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const workspace = await prisma.workspace.findUnique({
    where: { clerkId: userId },
    include: { variants: true },
  });

  if (!workspace) redirect("/dashboard");

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">New experiment</h1>
      <NewExperimentForm variants={workspace.variants} workspaceId={workspace.id} />
    </div>
  );
}