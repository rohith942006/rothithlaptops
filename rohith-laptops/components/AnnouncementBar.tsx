export default function AnnouncementBar() {
  return (
    <div className="bg-ink text-white">
      <div className="wrap flex h-9 items-center justify-center gap-3 text-[12.5px] font-medium tracking-wide">
        <span className="hidden h-1.5 w-1.5 rounded-full bg-accent sm:inline-block" />
        <p className="truncate">
          <span className="hidden sm:inline">Exclusive </span>Laptop Deals <span className="mx-1.5 text-white/40">•</span> Free Delivery{" "}
          <span className="mx-1.5 text-white/40">•</span> Easy EMI Available
        </p>
      </div>
    </div>
  );
}
