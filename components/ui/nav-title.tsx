export function NavTitle({ h1, h2 }: { h1: string, h2: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-muted-foreground sm:text-3xl">{h1}</h1>
      <p className="text-muted-foreground mt-1">{h2}</p>
    </div>
  )
}
