import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().default(""),
    // false = draft: hidden from the public grid, still reachable by direct link
    active: boolean("active").notNull().default(true),
    title: text("title").notNull(),
    desc: text("desc").default(""),
    tags: text("tags").array().default([]),
    image: text("image").default(""),
    url: text("url").default(""),
    // case study — empty means the card links straight out, no detail page
    problem: text("problem").default(""),
    approach: text("approach").default(""),
    result: text("result").default(""),
    stack: text("stack").array().default([]),
    images: text("images").array().default([]),
    sort: integer("sort").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [uniqueIndex("projects_slug_idx").on(t.slug)]
);
