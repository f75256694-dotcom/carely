export type UserRole = "care-seeker" | "family" | "caregiver";

export interface RoleConfig {
  id: UserRole;
  label: string;
  description: string;
  path: string;
}

export const ROLES: RoleConfig[] = [
  { id: "care-seeker", label: "Hilfesuchende", description: "Ansicht für Hilfesuchende", path: "/care-seeker" },
  { id: "family", label: "Familie", description: "Familienübersicht", path: "/family" },
  { id: "caregiver", label: "Helfende", description: "Ansicht für Helfende", path: "/caregiver" },
];

export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLES.find((r) => r.id === role) ?? ROLES[1];
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
