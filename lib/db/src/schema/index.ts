import { boolean, integer, jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  country: varchar("country", { length: 80 }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("XOF"),
  language: varchar("language", { length: 8 }).notNull().default("fr"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const establishments = pgTable("establishments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: integer("organization_id").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  type: varchar("type", { length: 40 }).notNull(),
  country: varchar("country", { length: 80 }).notNull(),
  city: varchar("city", { length: 80 }),
  currency: varchar("currency", { length: 8 }).notNull().default("XOF"),
  timezone: varchar("timezone", { length: 80 }).notNull().default("Africa/Dakar"),
  enabledModules: jsonb("enabled_modules").notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: integer("organization_id").notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 80 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const learners = pgTable("learners", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: integer("organization_id").notNull(),
  establishmentId: integer("establishment_id").notNull(),
  matricule: varchar("matricule", { length: 40 }).notNull(),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  lastName: varchar("last_name", { length: 80 }).notNull(),
  className: varchar("class_name", { length: 80 }).notNull(),
  guardianName: varchar("guardian_name", { length: 160 }),
  guardianPhone: varchar("guardian_phone", { length: 40 }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: integer("organization_id").notNull(),
  establishmentId: integer("establishment_id").notNull(),
  learnerId: integer("learner_id").notNull(),
  reference: varchar("reference", { length: 40 }).notNull(),
  description: varchar("description", { length: 160 }).notNull(),
  amount: integer("amount").notNull(),
  paidAmount: integer("paid_amount").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  organizationId: integer("organization_id").notNull(),
  establishmentId: integer("establishment_id").notNull(),
  invoiceId: integer("invoice_id"),
  reference: varchar("reference", { length: 40 }).notNull(),
  method: varchar("method", { length: 20 }).notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("confirmed"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
