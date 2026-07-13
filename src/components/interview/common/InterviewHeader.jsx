export default function InterviewHeader({ title, description }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase text-blue-600">Interview</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">{description}</p>
    </div>
  );
}
