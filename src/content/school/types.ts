export type VisualKind =
  | "compound"
  | "inflation"
  | "budget"
  | "emergency"
  | "jars"
  | "habit"
  | "riskLadder"
  | "fundFlow"
  | "expenseDrag"
  | "fundMap"
  | "ownership"
  | "statements"
  | "valuation"
  | "allocation"
  | "drift"
  | "shield"
  | "debtOrder"
  | "creditScore"
  | "slabs"
  | "regimes"
  | "gainsTax"
  | "corpus"
  | "pillars"
  | "buckets"
  | "goalLadder"
  | "stepUp"
  | "drawdowns"
  | "biases"
  | "fomo"
  | "policy"
  | "factors"
  | "bondSeesaw"
  | "alternatives"
  | "timeValue"
  | "purpose"
  | "riskReturn";

export interface LessonContent {
  slug: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
  visual: { kind: VisualKind; caption: string };
  example: { title: string; body: string[]; figures?: [string, string][] };
  takeaways: string[];
  tool?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface ModuleContent {
  slug: string;
  lessons: LessonContent[];
  quiz: QuizQuestion[];
}
