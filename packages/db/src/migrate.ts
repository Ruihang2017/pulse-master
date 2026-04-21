async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn("[migrate] DATABASE_URL not set; nothing to migrate (pass-1 stub).");
    return;
  }
  console.log("[migrate] Pass-1 stub — full migrator lands in Task 22.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
