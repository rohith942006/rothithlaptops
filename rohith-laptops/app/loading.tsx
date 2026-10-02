export default function Loading() {
  return (
    <div className="wrap grid min-h-[50vh] place-items-center">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink/10 border-t-ink" aria-label="Loading" />
    </div>
  );
}
