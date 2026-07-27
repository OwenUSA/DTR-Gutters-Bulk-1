import { redirect } from "next/navigation";
import { readFileSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { createSession, setSessionCookie } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");
  const secretPath = path.join(process.cwd(), "admin-secret.json");
  const { passwordHash: hash } = JSON.parse(readFileSync(secretPath, "utf8")) as { passwordHash: string };
  if (!hash) throw new Error("admin-secret.json missing passwordHash");
  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }
  const token = await createSession();
  await setSessionCookie(token);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const error = searchParams.error;
  const next = searchParams.next || "/admin";

  return (
    <main className="min-h-screen flex items-center justify-center bg-offwhite p-6">
      <form
        action={loginAction}
        className="bg-white p-8 rounded-lg shadow w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-navy mb-6">Admin Login</h1>
        {error && (
          <p className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
            Incorrect password.
          </p>
        )}
        <input type="hidden" name="next" value={next} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full border rounded p-3 mb-4"
        />
        <button type="submit" className="btn btn-primary w-full">
          Sign in
        </button>
      </form>
    </main>
  );
}
