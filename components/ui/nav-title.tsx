export function NavTitle({ h1, h2 }: { h1: string, h2: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-500">{h1}</h1>
      <p className="text-slate-400 mt-1">{h2}</p>
    </div>
  )
}
