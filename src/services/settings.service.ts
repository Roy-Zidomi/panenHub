import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SETTINGS_KEY = "app_settings_v1";

const daySchema = z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

const appSettingsSchema = z.object({
  storeProfile: z.object({
    storeName: z.string().min(1),
    storeDescription: z.string(),
    storeLogoUrl: z.string(),
    contactWhatsapp: z.string(),
    contactEmail: z.string(),
    address: z.string(),
  }),
  checkout: z.object({
    adminWhatsapp: z.string(),
    whatsappTemplate: z.string(),
    defaultOrderNote: z.string(),
    allowGuestCheckout: z.boolean(),
  }),
  shipping: z.object({
    serviceAreas: z.string(),
    deliveryEstimate: z.string(),
    defaultShippingCost: z.number().nonnegative(),
    freeShippingMinimum: z.number().nonnegative(),
  }),
  payment: z.object({
    methods: z.object({
      bankTransfer: z.boolean(),
      eWallet: z.boolean(),
      cod: z.boolean(),
    }),
    instructions: z.string(),
  }),
  operations: z.object({
    openDays: z.array(daySchema),
    openTime: z.string(),
    closeTime: z.string(),
  }),
  notifications: z.object({
    newOrder: z.boolean(),
    orderStatus: z.boolean(),
    dailySummary: z.boolean(),
    lowStock: z.boolean(),
    lowStockThreshold: z.number().int().min(1).max(100),
  }),
  security: z.object({
    authTokenVersion: z.number().int().min(1),
  }),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;
export type AppSettingsPatch = {
  [K in keyof AppSettings]?: AppSettings[K] extends Record<string, unknown>
    ? Partial<AppSettings[K]>
    : AppSettings[K];
};

export const defaultAppSettings: AppSettings = {
  storeProfile: {
    storeName: "PanenHub",
    storeDescription: "Marketplace bahan pangan lokal",
    storeLogoUrl: "",
    contactWhatsapp: "6288262668629",
    contactEmail: "hello@panenhub.com",
    address: "Jakarta, Indonesia",
  },
  checkout: {
    adminWhatsapp: "6288262668629",
    whatsappTemplate: "*PESANAN BARU - PANENHUB*",
    defaultOrderNote: "",
    allowGuestCheckout: true,
  },
  shipping: {
    serviceAreas: "Jakarta, Depok, Tangerang, Bekasi",
    deliveryEstimate: "Same day (maksimal H+1)",
    defaultShippingCost: 10000,
    freeShippingMinimum: 150000,
  },
  payment: {
    methods: {
      bankTransfer: true,
      eWallet: true,
      cod: true,
    },
    instructions: "Pembayaran akan dikonfirmasi admin melalui WhatsApp.",
  },
  operations: {
    openDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    openTime: "08:00",
    closeTime: "20:00",
  },
  notifications: {
    newOrder: true,
    orderStatus: true,
    dailySummary: false,
    lowStock: true,
    lowStockThreshold: 5,
  },
  security: {
    authTokenVersion: 1,
  },
};

let settingsTableEnsured = false;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(base: Record<string, unknown>, patch: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    if (isObjectRecord(value) && isObjectRecord(result[key])) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value);
      continue;
    }
    result[key] = value;
  }

  return result;
}

async function ensureSettingsTable() {
  if (settingsTableEnsured) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "AppSetting" (
      "key" TEXT PRIMARY KEY,
      "value" JSONB NOT NULL DEFAULT '{}'::jsonb,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  settingsTableEnsured = true;
}

function normalizeSettings(value: unknown): AppSettings {
  const merged = deepMerge(
    defaultAppSettings as unknown as Record<string, unknown>,
    isObjectRecord(value) ? value : {}
  );

  const parsed = appSettingsSchema.safeParse(merged);
  if (parsed.success) return parsed.data;
  return defaultAppSettings;
}

export async function getAppSettings(): Promise<AppSettings> {
  await ensureSettingsTable();

  const rows = await prisma.$queryRawUnsafe<Array<{ value: unknown }>>(
    `SELECT "value" FROM "AppSetting" WHERE "key" = $1 LIMIT 1`,
    SETTINGS_KEY
  );

  if (!rows[0]) return defaultAppSettings;
  return normalizeSettings(rows[0].value);
}

export async function updateAppSettings(patch: AppSettingsPatch): Promise<AppSettings> {
  const current = await getAppSettings();
  const nextSettings = normalizeSettings(
    deepMerge(current as unknown as Record<string, unknown>, patch as unknown as Record<string, unknown>)
  );

  await prisma.$executeRawUnsafe(
    `
      INSERT INTO "AppSetting" ("key", "value", "updatedAt")
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT ("key")
      DO UPDATE SET
        "value" = EXCLUDED."value",
        "updatedAt" = NOW()
    `,
    SETTINGS_KEY,
    JSON.stringify(nextSettings)
  );

  return nextSettings;
}

export async function getAuthTokenVersion(): Promise<number> {
  const settings = await getAppSettings();
  return settings.security.authTokenVersion;
}

export async function bumpAuthTokenVersion(): Promise<number> {
  const currentVersion = await getAuthTokenVersion();
  const updated = await updateAppSettings({
    security: {
      authTokenVersion: currentVersion + 1,
    },
  });
  return updated.security.authTokenVersion;
}

export async function getPublicStoreSettings() {
  const settings = await getAppSettings();

  return {
    storeProfile: settings.storeProfile,
    checkout: {
      adminWhatsapp: settings.checkout.adminWhatsapp,
      whatsappTemplate: settings.checkout.whatsappTemplate,
      defaultOrderNote: settings.checkout.defaultOrderNote,
      allowGuestCheckout: settings.checkout.allowGuestCheckout,
    },
    shipping: settings.shipping,
    payment: settings.payment,
    operations: settings.operations,
  };
}
