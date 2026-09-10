import Link from "next/link";
import { SEBI_DISCLAIMER } from "@/lib/compliance";
import { LogoHorizontal } from "@/components/brand/LogoHorizontal";
import { AuroraField } from "@/components/visuals/AuroraField";
import { Container } from "./Container";

const FOOTER_LINKS = [
  { label: "Tools", href: "/tools" },
  { label: "Learn", href: "/learn" },
  { label: "Legends", href: "/legends" },
  { label: "Market", href: "/market" },
  { label: "About", href: "/about" },
  { label: "Disclosures", href: "/disclosures" },
] as const;

/**
 * The closing deep-field band. Every page now ends the way it began — in
 * the atmosphere — with the brand's one-line thesis set at display scale
 * instead of buried as small print. Nothing here is new copy; it is the
 * same line the hero and the mobile drawer carry, given the weight it
 * always deserved.
 */
export function Footer() {
  return (
    <footer className="deep-field deep-field-quiet on-deep relative">
      <AuroraField variant="band" />

      <Container className="relative z-10 flex flex-col gap-12 py-16 sm:py-20">
        <p className="max-w-3xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-white text-glow-soft sm:text-4xl">
          We don&apos;t manage your money.{" "}
          <span className="text-bright-blue">
            We teach you how to manage it.
          </span>
        </p>

        <div className="hairline hairline-deep" />

        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-3">
            <LogoHorizontal tone="light" />
            <p className="max-w-xs font-body text-sm text-white/80">
              Learn · Invest · Grow · Compound
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-white/75 transition-colors hover:text-bright-blue"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="border-t border-white/15 pt-6 font-body text-xs leading-relaxed text-white/85">
          {SEBI_DISCLAIMER}
        </p>
      </Container>
    </footer>
  );
}
