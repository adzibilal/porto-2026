import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  desc: text("desc").default(""),
  tags: text("tags").array().default([]),
  image: text("image").default(""),
  url: text("url").default(""),
  sort: integer("sort").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
