import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "sans-serif",
      }}
    >
      <h1>Welcome to Review AI</h1>
      <p>AI powered Github PR reviewer</p>

      {session?.user ? (
        <>
          <p>Signed in as: {session.user.name}</p>

          <Link href="/dashboard">Go to dashboard</Link>

          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <button type="submit">Sign out</button>
          </form>
        </>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </main>
  );
}
