import { getDb } from "./index";
import { projects } from "./schema";

const data = [
  { title: "bara enterprise · landing page", desc: "html · css · javascript · agency landing page", tags: ["frontend", "marketing"], sort: 0 },
  { title: "saas analytics dashboard", desc: "react · typescript · data viz", tags: ["product", "dashboard"], sort: 1 },
  { title: "mobile app landing page", desc: "next.js · tailwind · marketing site", tags: ["frontend", "marketing"], sort: 2 },
];

async function main() {
  await getDb().insert(projects).values(data);
  console.log("seeded 3 projects");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
