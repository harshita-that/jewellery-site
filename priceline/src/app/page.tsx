import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-semibold tracking-tight mb-4 text-center">
        priceline
      </h1>
      <p className="text-white/50 text-lg text-center max-w-md mb-10">
        A/B test your SaaS pricing page. Embed anywhere. Find what converts.
      </p>
      <div className="flex gap-4">
        <Link
          href="/sign-up"
          className="bg-white text-black font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition"
        >
          Get started free
        </Link>
        <Link
          href="/sign-in"
          className="border border-white/20 text-white px-6 py-3 rounded-xl hover:border-white/50 transition"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}