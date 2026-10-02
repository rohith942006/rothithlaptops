// Re-mounts on every page change, giving each page a soft fade-in transition.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
