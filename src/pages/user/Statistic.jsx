export default function Statistic({ user }) {
  const displayName = user?.username || user?.email || "there";
  const role = user?.role || "USER";

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase text-blue-600">
        Statistics
      </p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">
        Hello {displayName} {role}
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Your role-based learning and interview statistics will appear here.
      </p>
    </section>
  );
}
