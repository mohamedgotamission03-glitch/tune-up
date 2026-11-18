import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { LAST_UPDATED } from "@/lib/appInfo";

export interface Section {
  title: string;
  body: ReactNode;
}

export const LegalPage = ({ title, sections }: { title: string; sections: Section[] }) => (
  <div className="animate-in fade-in duration-300">
    <PageHeader title={title} subtitle={`Last updated: ${LAST_UPDATED}`} back />
    <article className="mx-4 space-y-5 rounded-3xl bg-card p-5 text-sm leading-relaxed shadow-sm">
      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="mb-1 text-base font-extrabold">{s.title}</h2>
          <div className="space-y-2 text-muted-foreground">{s.body}</div>
        </section>
      ))}
    </article>
  </div>
);
