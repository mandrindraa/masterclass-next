function Avatar({
  email,
  className,
}: {
  email?: string;
  className?: string;
}) {
  const initial = email?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      data-slot="avatar"
      className={
        "inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0 " +
        (className ?? "")
      }
    >
      {initial}
    </div>
  );
}

export { Avatar };
