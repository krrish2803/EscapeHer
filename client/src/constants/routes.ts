export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  EMERGENCY: "/emergency",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  CONTACTS: "/contacts",
  INCIDENTS: "/incidents",
  REPORTS: "/reports",
  MAP: "/map",
  TIMELINE: "/timeline",
} as const;

export const PUBLIC_ROUTES: string[] = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export const PROTECTED_ROUTES: string[] = [
  ROUTES.DASHBOARD,
  ROUTES.EMERGENCY,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
  ROUTES.CONTACTS,
  ROUTES.INCIDENTS,
  ROUTES.REPORTS,
  ROUTES.MAP,
  ROUTES.TIMELINE,
];

export const SIDEBAR_NAV = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Emergency", href: ROUTES.EMERGENCY, icon: "ShieldAlert" },
  { label: "Contacts", href: ROUTES.CONTACTS, icon: "Users" },
  { label: "Map", href: ROUTES.MAP, icon: "Map" },
  { label: "Incidents", href: ROUTES.INCIDENTS, icon: "FileWarning" },
  { label: "Reports", href: ROUTES.REPORTS, icon: "FileText" },
  { label: "Timeline", href: ROUTES.TIMELINE, icon: "Clock" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
] as const;

export const DEFAULT_REDIRECT_AFTER_LOGIN = ROUTES.DASHBOARD;
export const DEFAULT_REDIRECT_AFTER_LOGOUT = ROUTES.HOME;
