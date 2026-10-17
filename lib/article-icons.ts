import {
  Factory,
  BrainCircuit,
  ShieldAlert,
  Workflow,
  Cloud,
  GraduationCap,
  MapPinned,
  Network,
  CreditCard,
  Siren,
  Bug,
  LockKeyhole,
  Globe2,
  KeyRound,
  Server,
  Mail,
  Newspaper,
  Radar,
  Eye,
  Landmark,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Articles store an icon *name* so they stay plain JSON (daily posts are generated as JSON files and
// passed from server to client components). This map turns the name back into a component.
export const ARTICLE_ICONS = {
  factory: Factory,
  brain: BrainCircuit,
  "shield-alert": ShieldAlert,
  workflow: Workflow,
  cloud: Cloud,
  graduation: GraduationCap,
  map: MapPinned,
  network: Network,
  "credit-card": CreditCard,
  siren: Siren,
  bug: Bug,
  lock: LockKeyhole,
  globe: Globe2,
  key: KeyRound,
  server: Server,
  mail: Mail,
  newspaper: Newspaper,
  radar: Radar,
  eye: Eye,
  landmark: Landmark,
} satisfies Record<string, LucideIcon>;

export type ArticleIconName = keyof typeof ARTICLE_ICONS;

export const ARTICLE_ICON_NAMES = Object.keys(ARTICLE_ICONS) as ArticleIconName[];

export function articleIcon(name: string): LucideIcon {
  return ARTICLE_ICONS[name as ArticleIconName] ?? Newspaper;
}
