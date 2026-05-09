import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main
      style={{
        padding: 40,
        fontFamily: "sans-serif",
      }}
    >
      <h1>Login</h1>
      <form
        action={async () => {
          "use server";

          await signIn("github");
        }}
      >
        <button type="submit">Continue with GitHub</button>
      </form>
    </main>
  );
}
