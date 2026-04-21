export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-5xl px-6 py-8 text-sm text-gray-500 flex gap-6">
      <a href="/privacy" className="hover:underline">
        Privacy
      </a>
      <a href="/terms" className="hover:underline">
        Terms
      </a>
      <a href="https://github.com/pulse" className="hover:underline" rel="noreferrer">
        GitHub
      </a>
    </footer>
  );
}
