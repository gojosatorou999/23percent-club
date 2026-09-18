import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[70dvh] place-items-center py-20 text-center">
      <div>
        <p className="font-display text-[7rem] font-bold leading-none tracking-tighter text-accent sm:text-[10rem]">404</p>
        <h1 className="t-h2 mt-2">This page didn&apos;t compound.</h1>
        <p className="t-lead mx-auto mt-4 max-w-[40ch]">The link may be old, or the page may have moved. Try search, or start from one of these.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Go home
          </Link>
          <Link href="/learn" className="btn btn-ghost">
            School of Finance
          </Link>
          <Link href="/tools" className="btn btn-ghost">
            All tools
          </Link>
        </div>
      </div>
    </section>
  );
}
