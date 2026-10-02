// Lightweight inline icon set (stroke icons, 24×24 grid). No external icon library needed.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconSearch = (p: P) => (<Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>);
export const IconUser = (p: P) => (<Base {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Base>);
export const IconHeart = (p: P) => (<Base {...p}><path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.4 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.5 3.4 4.4 6.7C19.5 15.4 12 20 12 20Z" /></Base>);
export const IconBag = (p: P) => (<Base {...p}><path d="M5 8h14l-1 12.2a1 1 0 0 1-1 .8H7a1 1 0 0 1-1-.8L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></Base>);
export const IconMenu = (p: P) => (<Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>);
export const IconX = (p: P) => (<Base {...p}><path d="M18 6 6 18M6 6l12 12" /></Base>);
export const IconChevronLeft = (p: P) => (<Base {...p}><path d="m15 18-6-6 6-6" /></Base>);
export const IconChevronRight = (p: P) => (<Base {...p}><path d="m9 18 6-6-6-6" /></Base>);
export const IconChevronDown = (p: P) => (<Base {...p}><path d="m6 9 6 6 6-6" /></Base>);
export const IconArrowRight = (p: P) => (<Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>);
export const IconPlus = (p: P) => (<Base {...p}><path d="M12 5v14M5 12h14" /></Base>);
export const IconMinus = (p: P) => (<Base {...p}><path d="M5 12h14" /></Base>);
export const IconTrash = (p: P) => (<Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Base>);
export const IconCheck = (p: P) => (<Base {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Base>);
export const IconSliders = (p: P) => (<Base {...p}><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></Base>);
export const IconClock = (p: P) => (<Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Base>);
export const IconHome = (p: P) => (<Base {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9.5Z" /></Base>);
export const IconGrid = (p: P) => (<Base {...p}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></Base>);
export const IconTruck = (p: P) => (<Base {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></Base>);
export const IconShield = (p: P) => (<Base {...p}><path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></Base>);
export const IconBadge = (p: P) => (<Base {...p}><path d="m12 3 2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.8 2.6-2.7-.1L12 21l-2.2-1.6-2.7.1-.8-2.6L4.1 15.3l.9-2.6-.9-2.6 2.2-1.6.8-2.6 2.7.1L12 3Z" /><path d="m9 12 2 2 4-4" /></Base>);
export const IconWallet = (p: P) => (<Base {...p}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M16 15h2" /></Base>);
export const IconLock = (p: P) => (<Base {...p}><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></Base>);
export const IconCard = (p: P) => (<Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></Base>);
export const IconPhone = (p: P) => (<Base {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></Base>);
export const IconMail = (p: P) => (<Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Base>);
export const IconChat = (p: P) => (<Base {...p}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.3L4 20Z" /><path d="M9 10.5c.5 1.6 2 3 3.5 3.5l1-1 2 .8" /></Base>);
export const IconMapPin = (p: P) => (<Base {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></Base>);
export const IconZap = (p: P) => (<Base {...p}><path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" /></Base>);
export const IconCpu = (p: P) => (<Base {...p}><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></Base>);
export const IconMemory = (p: P) => (<Base {...p}><rect x="3" y="7" width="18" height="10" rx="1.5" /><path d="M7 11v2M11 11v2M15 11v2M6 17v2M10 17v2M14 17v2M18 17v2" /></Base>);
export const IconDrive = (p: P) => (<Base {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 14h.01M11 14h6" /></Base>);
export const IconMonitor = (p: P) => (<Base {...p}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></Base>);
export const IconBattery = (p: P) => (<Base {...p}><rect x="3" y="8" width="16" height="9" rx="2" /><path d="M21 11v3M6 11v3M9 11v3" /></Base>);
export const IconFeather = (p: P) => (<Base {...p}><path d="M20 4c-6 0-12 4-13 13l-3 3M7 17h7c3-2 5-6 6-13" /></Base>);
export const IconLayers = (p: P) => (<Base {...p}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></Base>);
export const IconWindow = (p: P) => (<Base {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M12 9v11" /></Base>);
export const IconReturn = (p: P) => (<Base {...p}><path d="M4 9h11a5 5 0 0 1 0 10H8" /><path d="m8 5-4 4 4 4" /></Base>);
export const IconPackage = (p: P) => (<Base {...p}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></Base>);
export const IconSparkle = (p: P) => (<Base {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></Base>);
export const IconTag = (p: P) => (<Base {...p}><path d="M3 12V4h8l10 10-8 8L3 12Z" /><circle cx="7.5" cy="8.5" r="1.5" /></Base>);
export const IconHistory = (p: P) => (<Base {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 8v4l3 2" /></Base>);
export const IconInfo = (p: P) => (<Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Base>);
export const IconGamepad = (p: P) => (<Base {...p}><path d="M7 8h10a4 4 0 0 1 4 4.5l-.7 4A2.5 2.5 0 0 1 16 18l-2-2h-4l-2 2a2.5 2.5 0 0 1-4.3-1.5l-.7-4A4 4 0 0 1 7 8Z" /><path d="M8 11v3M6.5 12.5h3M15 12h.01M17 13.5h.01" /></Base>);
export const IconBriefcase = (p: P) => (<Base {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 13h18" /></Base>);
export const IconGrad = (p: P) => (<Base {...p}><path d="m12 4 10 5-10 5L2 9l10-5Z" /><path d="M6 11v5c3 2.5 9 2.5 12 0v-5" /></Base>);
export const IconPen = (p: P) => (<Base {...p}><path d="m14 4 6 6-10 10H4v-6L14 4Z" /><path d="m12 6 6 6" /></Base>);

// Social marks (simplified, generic)
export const IconInstagram = (p: P) => (<Base {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.3 6.7h.01" /></Base>);
export const IconFacebook = (p: P) => (<Base {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" /></Base>);
export const IconYoutube = (p: P) => (<Base {...p}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9.5 5 2.5-5 2.5v-5Z" /></Base>);
export const IconLinkedin = (p: P) => (<Base {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10v6.5M7.5 7.5h.01M11 16.5V10M11 13a2.5 2.5 0 0 1 5 0v3.5" /></Base>);

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id={`s${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#F5A524" />
                <stop offset={`${fill * 100}%`} stopColor="#D9DCE1" />
              </linearGradient>
            </defs>
            <path
              d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8Z"
              fill={`url(#s${i}-${Math.round(fill * 100)})`}
            />
          </svg>
        );
      })}
    </span>
  );
}
