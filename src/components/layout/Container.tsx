import type { ReactNode } from "react";

/**
 * `prose` caps the measure at 48rem for long-form reading — README §3.3
 * puts body line length under ~75 characters, and at the default 72rem a
 * paragraph runs closer to 130.
 *
 * This is a prop rather than a `max-w-*` class passed through `className`
 * because that never actually worked: two `max-w-*` utilities on one element
 * are resolved by Tailwind's own source order, not by the order they appear
 * in the attribute, so `max-w-6xl` here silently won over every caller's
 * `max-w-3xl` and long-form pages had been rendering full width.
 */
const WIDTH = {
  default: "max-w-6xl",
  prose: "max-w-3xl",
} as const;

export function Container({
  children,
  className = "",
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: keyof typeof WIDTH;
}) {
  return (
    <div className={`mx-auto w-full px-6 ${WIDTH[width]} ${className}`}>
      {children}
    </div>
  );
}
