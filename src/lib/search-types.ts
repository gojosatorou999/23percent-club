export interface SearchItem {
  kind: "Tool" | "Lesson" | "Module" | "Article" | "Term" | "Event" | "Page";
  title: string;
  href: string;
  text: string;
}
