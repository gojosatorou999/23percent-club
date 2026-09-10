import type { Metadata } from "next";
import { LogoMark } from "@/components/brand/LogoMark";
import { LogoHorizontal } from "@/components/brand/LogoHorizontal";
import { LogoStacked } from "@/components/brand/LogoStacked";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Expandable } from "@/components/ui/Expandable";
import { ComplianceNote } from "@/components/ui/ComplianceNote";
import { SourceCitation } from "@/components/ui/SourceCitation";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { BlogCard } from "@/components/cards/BlogCard";
import { LegendCard } from "@/components/cards/LegendCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CalculatorDemo } from "./CalculatorDemo";
import { sampleProducts, sampleBlogPosts, sampleLegends } from "./sample-data";

export const metadata: Metadata = {
  title: "Component Gallery",
  robots: { index: false, follow: false },
};

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-lg border border-line"
        style={{ background: `var(${varName})` }}
      />
      <div className="font-body text-xs text-content-2">
        <div className="font-medium text-content">{name}</div>
        <code>{varName}</code>
      </div>
    </div>
  );
}

export default function ComponentGallery() {
  return (
    <div className="flex flex-col">
      <Section tone="muted" className="!py-12">
        <Container>
          <h1 className="font-display text-3xl font-semibold text-content">
            Component Gallery
          </h1>
          <p className="mt-2 max-w-2xl font-body text-content-2">
            Internal reference for every shared component in every state.
            Not indexed, not linked from the site nav. See README §8 Phase 1.
          </p>
        </Container>
      </Section>

      {/* Tokens */}
      <Section>
        <Container className="flex flex-col gap-8">
          <h2 className="font-display text-2xl font-semibold text-content">
            Tokens — Sapphire Blue
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Swatch name="Sapphire" varName="--color-sapphire" />
            <Swatch name="Bright Blue" varName="--color-bright-blue" />
            <Swatch name="Ink" varName="--color-ink" />
            <Swatch name="Slate" varName="--color-slate" />
            <Swatch name="Off White" varName="--color-off-white" />
            <Swatch name="Success Green" varName="--color-success-green" />
            <Swatch name="Alert Amber" varName="--color-alert-amber" />
            <Swatch name="Alert Amber (text-safe)" varName="--color-alert-amber-text" />
            <Swatch name="Border" varName="--color-border" />
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-display text-4xl font-semibold text-content">
              Outfit display type
            </p>
            <p className="font-body text-base text-content">
              Inter body type — the quick brown fox jumps over the lazy dog. 1234567890
            </p>
            <p className="tabular-nums font-body text-base text-content">
              Tabular numerals: ₹1,23,456.78 vs ₹9,87,654.32 (columns align)
            </p>
          </div>
        </Container>
      </Section>

      {/* Brand */}
      <Section tone="muted">
        <Container className="flex flex-col gap-8">
          <h2 className="font-display text-2xl font-semibold text-content">Brand marks</h2>
          <div className="flex flex-wrap items-end gap-10">
            <div className="flex flex-col items-center gap-2">
              <LogoMark className="h-16 w-16" />
              <span className="font-body text-xs text-content-2">LogoMark</span>
            </div>
            <div className="flex flex-col items-start gap-2">
              <LogoHorizontal />
              <span className="font-body text-xs text-content-2">LogoHorizontal</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded border border-line bg-surface-3 p-6">
              <LogoStacked />
              <span className="font-body text-xs text-content-2">LogoStacked</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Buttons */}
      <Section>
        <Container className="flex flex-col gap-6">
          <h2 className="font-display text-2xl font-semibold text-content">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button>Primary — default</Button>
            <Button className="opacity-90">Primary — hover (simulated)</Button>
            <Button className="outline-2 outline-bright-blue outline-offset-4">
              Primary — focus (simulated)
            </Button>
            <Button disabled>Primary — disabled</Button>
            <Button variant="secondary">Secondary</Button>
            <ButtonLink href="#" variant="secondary">
              Button as link
            </ButtonLink>
          </div>
          <p className="font-body text-xs text-content-2">
            Real focus state: tab to any interactive element on this page —
            the ring is a global `:focus-visible` style, not per-component.
          </p>
        </Container>
      </Section>

      {/* Card + Expandable + Compliance + Citation */}
      <Section tone="muted">
        <Container className="flex flex-col gap-8">
          <h2 className="font-display text-2xl font-semibold text-content">
            Card, Expandable, Compliance, Citation
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="p-6">
              <p className="font-body text-sm text-content">Base Card primitive — border + radius only.</p>
            </Card>
            <div className="flex flex-col gap-3">
              <Expandable title="How this is calculated (closed — default)">
                <p>Formula and explanation live here.</p>
              </Expandable>
              <Expandable title="How this is calculated (open)" defaultOpen>
                <p>Formula and explanation live here.</p>
              </Expandable>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <ComplianceNote />
            <div className="flex flex-col gap-2">
              <SourceCitation label="Income Tax Act, Section 50AA" href="https://incometaxindia.gov.in" />
              <SourceCitation label="No link provided (label-only state)" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Pagination + CategoryFilter */}
      <Section>
        <Container className="flex flex-col gap-8">
          <h2 className="font-display text-2xl font-semibold text-content">
            Pagination &amp; Category Filter
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-1 font-body text-xs text-content-2">Middle page</p>
              <Pagination currentPage={3} totalPages={7} buildHref={(p) => `?page=${p}`} />
            </div>
            <div>
              <p className="mb-1 font-body text-xs text-content-2">First page (Previous disabled)</p>
              <Pagination currentPage={1} totalPages={7} buildHref={(p) => `?page=${p}`} />
            </div>
            <div>
              <p className="mb-1 font-body text-xs text-content-2">Last page (Next disabled)</p>
              <Pagination currentPage={7} totalPages={7} buildHref={(p) => `?page=${p}`} />
            </div>
            <div>
              <p className="mb-1 font-body text-xs text-content-2">
                Empty state — totalPages=1 renders nothing (no pagination needed)
              </p>
              <Pagination currentPage={1} totalPages={1} buildHref={(p) => `?page=${p}`} />
              <span className="font-body text-xs text-content-2">(renders null — nothing above this line)</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <CategoryFilter
              options={[
                { slug: "behavioural-finance", label: "Behavioural Finance" },
                { slug: "case-studies", label: "Case Studies" },
                { slug: "flagship", label: "Flagship" },
              ]}
              active="case-studies"
              buildHref={(slug) => (slug ? `?category=${slug}` : "?")}
            />
            <CategoryFilter
              options={[
                { slug: "behavioural-finance", label: "Behavioural Finance" },
                { slug: "case-studies", label: "Case Studies" },
              ]}
              buildHref={(slug) => (slug ? `?category=${slug}` : "?")}
            />
          </div>
        </Container>
      </Section>

      {/* Calculator shell — the hero interaction */}
      <Section tone="muted">
        <Container className="flex flex-col gap-8">
          <h2 className="font-display text-2xl font-semibold text-content">
            Calculator shell (live demo)
          </h2>
          <p className="max-w-2xl font-body text-sm text-content-2">
            The hero interaction of the site. Drag a slider or edit a number
            — the result panel counts up, the chart redraws, the compliance
            note is always present. There is no loading state here by
            design: calculators compute client-side with pure functions
            (README §5.1), never a server round-trip.
          </p>
          <CalculatorDemo />
        </Container>
      </Section>

      {/* Content cards */}
      <Section>
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-content">BlogCard</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {sampleBlogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-content">
              LegendCard — published vs. draft
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {sampleLegends.map((legend) => (
                <LegendCard key={legend.slug} legend={legend} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-content">
              ProductCard — risk levels
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {sampleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
