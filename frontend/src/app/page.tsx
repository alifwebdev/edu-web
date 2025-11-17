// // src/app/page.tsx
// import { redirect } from "next/navigation";
// export default function Home() {
//   redirect("/dashboard");
// }

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-4">
          Go to{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
