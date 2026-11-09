import {
  ChartLineUp,
  Aperture,
  Package,
  ChartBar,
  Sparkle,
  ArrowCounterClockwise,
  UsersThree,
  Target,
  CalendarCheck,
  Handshake,
  Storefront,
  Truck,
  ShoppingCart,
  Crosshair,
  GlobeHemisphereWest,
  TShirt,
  MapTrifold,
  Tag,
  VideoCamera,
  Camera,
  ChatCircleDots,
  ArrowRight,
  ArrowUpRight,
  MagnifyingGlass,
  Phone,
  EnvelopeSimple,
  MapPin,
  CalendarBlank,
  Clock,
  User,
  Quotes,
  Pause,
  Play,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export type { Icon };

/** Capabilities (and the one-team pillars that link to them). */
export const capabilityIcons: Record<string, Icon> = {
  "retail-media": ChartLineUp,
  "creative-studio": Aperture,
  "marketplace-operations": Package,
  analytics: ChartBar,
  "ai-commerce": Sparkle,
  "revenue-recovery": ArrowCounterClockwise,
};

/** One-team pillar labels → capability slug (for shared icons). */
export const pillarToCapability: Record<string, string> = {
  Measured: "retail-media",
  Made: "creative-studio",
  Run: "marketplace-operations",
  Found: "ai-commerce",
  Reported: "analytics",
  Recovered: "revenue-recovery",
};

/** Channels (by slug). */
export const channelIcons: Record<string, Icon> = {
  amazon: Storefront,
  walmart: ShoppingCart,
  "target-plus": Crosshair,
  international: GlobeHemisphereWest,
  zalando: TShirt,
  "mercado-libre": MapTrifold,
  temu: Tag,
  "tiktok-shop": VideoCamera,
  "instagram-shop": Camera,
};

/** Homepage "Budget goes where it earns most" channel list (by label). */
export const budgetChannelIcons: Record<string, Icon> = {
  "Amazon Seller Central": Storefront,
  "Amazon Vendor Central": Truck,
  Walmart: ShoppingCart,
  "Target Plus": Crosshair,
  International: GlobeHemisphereWest,
  Zalando: TShirt,
  "Mercado Libre": MapTrifold,
  Temu: Tag,
  "TikTok Shop": VideoCamera,
  "Instagram Shop": Camera,
  "AI shopping assistants": ChatCircleDots,
};

/** "What one team means for you" bullets, in order. */
export const oneTeamMeansIcons: Icon[] = [UsersThree, Target, CalendarCheck, Handshake];

export const ui = {
  ArrowRight,
  ArrowUpRight,
  Search: MagnifyingGlass,
  Phone,
  Email: EnvelopeSimple,
  MapPin,
  Calendar: CalendarBlank,
  Clock,
  User,
  Quote: Quotes,
  Pause,
  Play,
};
