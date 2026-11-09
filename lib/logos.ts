// Logo sets restored from the prototype sprite (public/brand/logos/*).
// Order matches build brief §6.

export type Logo = { id: string; label: string; src: string };

const client = (id: string, label: string): Logo => ({
  id,
  label,
  src: `/brand/logos/clients/${id}.svg`,
});
const press = (id: string, label: string): Logo => ({
  id,
  label,
  src: `/brand/logos/press/${id}.svg`,
});

export const clientLogos: Logo[] = [
  client("timberland", "Timberland"),
  client("tula", "TULA"),
  client("quiksilver", "Quiksilver"),
  client("burtsbees", "Burt’s Bees"),
  client("kipling", "Kipling"),
  client("vilebrequin", "Vilebrequin"),
  client("spyder", "Spyder"),
  client("moonjuice", "Moon Juice"),
  client("brahmin", "Brahmin"),
  client("pelagic", "Pelagic"),
  client("trish", "Trish McEvoy"),
  client("volcom", "Volcom"),
  client("texturecrush", "Texture Crush"),
  client("billabong", "Billabong"),
  client("fairharbor", "Fair Harbor"),
  client("liquidplus", "Liquid Plus"),
  client("rvca", "RVCA"),
  client("agride", "Agride"),
  client("radius", "Radius"),
  client("burlebo2", "BURLEBO"),
  client("bleusalt", "Bleusalt"),
  client("buffalove", "Buffalove"),
  client("alexevenings", "Alex Evenings"),
  client("flojos", "Flojos"),
  client("seacret", "Seacret"),
  client("bluesage", "Blue Sage Accessories"),
  client("contorno", "Contorno"),
  client("ely", "Ely Cattleman"),
  client("crowned", "Crowned Skin"),
  client("phusa", "Phusa Foods"),
  client("finest", "The Finest Accessories"),
  client("slfashions", "S.L. Fashions"),
];

export const pressLogos: Logo[] = [
  press("wsj", "The Wall Street Journal"),
  press("wapo", "The Washington Post"),
  press("bloomberg", "Bloomberg"),
  press("ft", "Financial Times"),
  press("cnbc", "CNBC"),
  press("npr", "NPR"),
  press("latimes", "Los Angeles Times"),
  press("nbcnews", "NBC News"),
  press("foxbusiness", "Fox Business"),
  press("bof", "The Business of Fashion"),
  press("wwd", "WWD"),
  press("quartz", "Quartz"),
  press("yahoo", "Yahoo"),
  press("digiday", "Digiday"),
  press("glossy", "Glossy"),
  press("modernretail", "Modern Retail"),
  press("racked", "Racked"),
  press("beautymatter", "BeautyMatter"),
  press("totalretail", "Total Retail"),
  press("fierceretail", "Fierce Retail"),
  press("mcm", "Multichannel Merchant"),
  press("geekwire", "GeekWire"),
  press("sbm", "Seattle Business"),
  press("bizwomen", "Bizwomen"),
];

// Social: 9 in the sprite; only show networks that have a real URL (§6 / Appendix A).
// URLs come from the live site (lib/site.ts). TODO(content): Substack, Threads,
// Bluesky, TikTok URLs — hidden until supplied.
export const socialLogos: Record<string, string> = {
  linkedin: "/brand/logos/social/linkedin.svg",
  instagram: "/brand/logos/social/instagram.svg",
  youtube: "/brand/logos/social/youtube.svg",
  facebook: "/brand/logos/social/facebook.svg",
  x: "/brand/logos/social/x.svg",
  substack: "/brand/logos/social/substack.svg",
  threads: "/brand/logos/social/threads.svg",
  bluesky: "/brand/logos/social/bluesky.svg",
  tiktok: "/brand/logos/social/tiktok.svg",
};
