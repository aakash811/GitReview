import Link from "next/link";
import { auth, signOut } from "@/auth";
import { ReviewForm } from "@/components/review-form";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
      <div className="space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold">Review AI</h1>

          <p className="text-lg text-zinc-600">
            AI-powered GitHub PR reviewer.
          </p>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <p className="text-sm text-zinc-700">
                Signed in as{" "}
                <span className="font-medium">{session.user.name}</span>
              </p>

              <Link
                href="/dashboard"
                className="rounded-md border px-4 py-2 text-sm"
              >
                Dashboard
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="rounded-md border px-4 py-2 text-sm">
              Login
            </Link>
          )}
        </div>

        {/* Review Form */}
        <div className="max-w-2xl space-y-4">
          <ReviewForm />

          <div className="space-y-2 text-sm text-zinc-500">
            <p>Example PRs:</p>

            <ul className="space-y-1">
              <li>https://github.com/facebook/react/pull/31000</li>

              <li>https://github.com/vercel/next.js/pull/69431</li>

              <li>https://github.com/t3-oss/create-t3-app/pull/1700</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
