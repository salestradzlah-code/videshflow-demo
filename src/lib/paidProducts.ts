export type PaidProductSlug =
  | "student_move_pack"
  | "premium_relocation_pack"
  | "voice_guide";

export type PaidProductStatus = "active" | "paused" | "configuring";

export type PaidProductConfig = {
  slug: PaidProductSlug;
  title: string;
  priceLabel: string;
  amountCents: number;
  stripePriceEnvVar: string | null;
  stripePriceAliasEnvVars: string[];
  publicCheckoutFlag: string;
  publicCheckoutAliasFlags: string[];
  serverCheckoutFlag: string;
  autofulfillFlag: string;
  waitlistUrl: string;
  successProductType: "student" | "premium" | "voice";
  description: string;
  boundaryNote: string;
  requiresStripePriceId: boolean;
  defaultPublicEnabled: boolean;
  defaultServerEnabled: boolean;
  defaultAutofulfillEnabled: boolean;
};

export type PaidProductRuntime = PaidProductConfig & {
  stripePriceId: string | null;
  publicCheckoutEnabled: boolean;
  serverCheckoutEnabled: boolean;
  autofulfillEnabled: boolean;
  status: PaidProductStatus;
  checkoutReady: boolean;
  missingEnvVars: string[];
};

export const paidProductConfigs: Record<PaidProductSlug, PaidProductConfig> = {
  student_move_pack: {
    slug: "student_move_pack",
    title: "Student Move Pack",
    priceLabel: "S$19 one time",
    amountCents: 1900,
    stripePriceEnvVar: null,
    stripePriceAliasEnvVars: [],
    publicCheckoutFlag: "NEXT_PUBLIC_STUDENT_PACK_PAYMENTS_ENABLED",
    publicCheckoutAliasFlags: [],
    serverCheckoutFlag: "STUDENT_PACK_CHECKOUT_ENABLED",
    autofulfillFlag: "STUDENT_PACK_AUTOFULFILL_ENABLED",
    waitlistUrl: "/early-access",
    successProductType: "student",
    description:
      "A route-aware student relocation planning pack with checklist, budget, packing, first-week setup, parent handover and provider research scripts.",
    boundaryNote:
      "Planning support only. No human review. Not professional advice. Always verify important details with official sources.",
    requiresStripePriceId: false,
    // Preserve the working Student launch behaviour: active unless explicitly paused.
    defaultPublicEnabled: true,
    defaultServerEnabled: true,
    defaultAutofulfillEnabled: true,
  },
  premium_relocation_pack: {
    slug: "premium_relocation_pack",
    title: "Premium Relocation Pack",
    priceLabel: "S$49 one time",
    amountCents: 4900,
    stripePriceEnvVar: "STRIPE_PREMIUM_RELOCATION_PACK_PRICE_ID",
    stripePriceAliasEnvVars: [
      "STRIPE_PREMIUM_PACK_PRICE_ID",
      "STRIPE_PREMIUM_PRICE_ID",
    ],
    publicCheckoutFlag: "NEXT_PUBLIC_PREMIUM_CHECKOUT_ENABLED",
    publicCheckoutAliasFlags: ["NEXT_PUBLIC_PREMIUM_PACK_PAYMENTS_ENABLED"],
    serverCheckoutFlag: "PREMIUM_PACK_CHECKOUT_ENABLED",
    autofulfillFlag: "PREMIUM_PACK_AUTOFULFILL_ENABLED",
    waitlistUrl: "/early-access",
    successProductType: "premium",
    description:
      "Self-serve AI generated planning templates, detailed move checklist, budget template, document tracker, first week setup plan, provider research scripts, research links and optional family, student, pet, corporate or return home modules.",
    boundaryNote:
      "Planning support only. No human review. Not professional advice. Always verify important details with official sources.",
    requiresStripePriceId: true,
    // Premium stays off unless Ash explicitly turns both public and server flags on.
    defaultPublicEnabled: false,
    defaultServerEnabled: false,
    defaultAutofulfillEnabled: false,
  },
  voice_guide: {
    slug: "voice_guide",
    title: "SettleMap Voice Guide",
    priceLabel: "S$19 one time",
    amountCents: 1900,
    stripePriceEnvVar: "STRIPE_VOICE_GUIDE_PRICE_ID",
    stripePriceAliasEnvVars: [],
    publicCheckoutFlag: "NEXT_PUBLIC_VOICE_GUIDE_CHECKOUT_ENABLED",
    publicCheckoutAliasFlags: [],
    serverCheckoutFlag: "VOICE_GUIDE_CHECKOUT_ENABLED",
    autofulfillFlag: "VOICE_GUIDE_AUTOFULFILL_ENABLED",
    waitlistUrl: "/early-access",
    successProductType: "voice",
    description:
      "A self serve AI guided voice-style walkthrough for your relocation plan, checklist, first week setup and research questions.",
    boundaryNote:
      "Planning support only. No human review. Not professional advice. No generated audio is included unless an audio engine is added later.",
    requiresStripePriceId: true,
    // Voice Guide is prepared but safe by default.
    defaultPublicEnabled: false,
    defaultServerEnabled: false,
    defaultAutofulfillEnabled: false,
  },
};

export const futureAddonConfigs = [
  {
    slug: "family_addon",
    title: "Family Add-on",
    priceLabel: "S$15",
    stripePriceEnvVar: "STRIPE_FAMILY_ADDON_PRICE_ID",
    description: "Family planning module for school, childcare, family healthcare and household setup research.",
  },
  {
    slug: "pet_addon",
    title: "Pet Add-on",
    priceLabel: "S$15",
    stripePriceEnvVar: "STRIPE_PET_ADDON_PRICE_ID",
    description: "Pet relocation planning module for microchip, vaccination, import permit and provider research questions.",
  },
  {
    slug: "corporate_addon",
    title: "Corporate Transfer Add-on",
    priceLabel: "S$25",
    stripePriceEnvVar: "STRIPE_CORPORATE_ADDON_PRICE_ID",
    description: "Corporate transfer planning module for HR, relocation allowance, work-start and payroll research.",
  },
  {
    slug: "return_home_addon",
    title: "Returning Home Add-on",
    priceLabel: "S$15",
    stripePriceEnvVar: "STRIPE_RETURN_HOME_ADDON_PRICE_ID",
    description: "Returning-home planning module for banking reactivation, address updates, local IDs and home setup.",
  },
  {
    slug: "parent_helper_addon",
    title: "Parent Helper Add-on",
    priceLabel: "S$15",
    stripePriceEnvVar: "STRIPE_PARENT_HELPER_ADDON_PRICE_ID",
    description: "Parent-facing planning helper for student handover, emergency contacts, budget review and first-week check-ins.",
  },
] as const;

export type FutureAddonConfig = (typeof futureAddonConfigs)[number];

export type AddonRuntime = FutureAddonConfig & {
  stripePriceId: string | null;
  priceConfigured: boolean;
};

function envValue(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
}

function readFlag(name: string, defaultValue: boolean): boolean {
  const value = envValue(name);
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
}

function readAnyFlag(names: string[], defaultValue: boolean): boolean {
  const values = names
    .map((name) => envValue(name))
    .filter((value): value is string => value !== undefined);

  if (values.length === 0) return defaultValue;
  return values.some((value) => value.toLowerCase() === "true");
}

function readStripePriceId(config: PaidProductConfig): string | null {
  const names = [
    config.stripePriceEnvVar,
    ...config.stripePriceAliasEnvVars,
  ].filter((name): name is string => Boolean(name));

  for (const name of names) {
    const value = envValue(name);
    if (value) return value;
  }

  return null;
}

export function getPaidProductRuntime(slug: PaidProductSlug): PaidProductRuntime {
  const config = paidProductConfigs[slug];
  const stripePriceId = readStripePriceId(config);
  const publicCheckoutEnabled = readAnyFlag(
    [config.publicCheckoutFlag, ...config.publicCheckoutAliasFlags],
    config.defaultPublicEnabled,
  );
  const serverCheckoutEnabled = readFlag(
    config.serverCheckoutFlag,
    config.defaultServerEnabled,
  );
  const autofulfillEnabled = readFlag(
    config.autofulfillFlag,
    config.defaultAutofulfillEnabled,
  );

  const missingEnvVars =
    config.requiresStripePriceId && !stripePriceId && config.stripePriceEnvVar
      ? [config.stripePriceEnvVar]
      : [];

  const checkoutReady =
    publicCheckoutEnabled &&
    serverCheckoutEnabled &&
    (!config.requiresStripePriceId || Boolean(stripePriceId));

  const status: PaidProductStatus = checkoutReady
    ? "active"
    : missingEnvVars.length > 0 && publicCheckoutEnabled && serverCheckoutEnabled
      ? "configuring"
      : "paused";

  return {
    ...config,
    stripePriceId,
    publicCheckoutEnabled,
    serverCheckoutEnabled,
    autofulfillEnabled,
    status,
    checkoutReady,
    missingEnvVars,
  };
}

export function getCheckoutBlockedMessage(runtime: PaidProductRuntime): string {
  if (runtime.missingEnvVars.length > 0) {
    return "Checkout is being configured. Please contact support@settlemap.app or try again later.";
  }

  return `${runtime.title} checkout is currently paused. Please contact support@settlemap.app or try again later.`;
}

export function getPaidProductRuntimes(): PaidProductRuntime[] {
  return [
    getPaidProductRuntime("student_move_pack"),
    getPaidProductRuntime("premium_relocation_pack"),
    getPaidProductRuntime("voice_guide"),
  ];
}

export function getAddonRuntimes(): AddonRuntime[] {
  return futureAddonConfigs.map((addon) => {
    const stripePriceId = envValue(addon.stripePriceEnvVar) ?? null;
    return {
      ...addon,
      stripePriceId,
      priceConfigured: Boolean(stripePriceId),
    };
  });
}

export function getAddonFlags() {
  return {
    publicAddonsEnabled: readFlag("NEXT_PUBLIC_ADDONS_ENABLED", false),
    checkoutEnabled: readFlag("ADDONS_CHECKOUT_ENABLED", false),
    autofulfillEnabled: readFlag("ADDONS_AUTOFULFILL_ENABLED", false),
  };
}
