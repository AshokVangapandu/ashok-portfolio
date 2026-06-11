import { motion } from "framer-motion";

const reveal = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } };
const cards = ["Token Architecture", "Component Library", "Variant System", "Responsive Standards", "Accessibility System", "Developer Handoff"];

export default function DesignSystem() {
  return (
    <main className="min-h-screen bg-[#050609] text-white">
      <section className="px-6 py-32 lg:px-16"><motion.p {...reveal} className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Project 04 / Design Engineering</motion.p><motion.h1 {...reveal} className="mt-5 max-w-6xl text-6xl font-semibold leading-none md:text-8xl">Unified Design System</motion.h1><motion.p {...reveal} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A scalable enterprise component ecosystem with tokens, variants, responsive standards, accessibility guidance, and developer-ready handoff patterns.</motion.p><motion.a {...reveal} className="mt-9 inline-flex rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold" href="/#work">Back to Showcase</motion.a></section>
      <nav className="sticky top-0 z-20 flex gap-3 overflow-x-auto border-y border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl">{["Tokens", "Components", "Variants", "Responsive", "A11y", "Handoff", "Scale"].map((item) => <a key={item} className="shrink-0 rounded-full px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10" href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
      <section className="grid gap-5 px-6 py-24 md:grid-cols-6 lg:px-16">{cards.map((card, index) => <motion.article {...reveal} id={card.split(" ")[0].toLowerCase()} key={card} className={`min-h-72 rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur-2xl ${index < 2 ? "md:col-span-3" : "md:col-span-2"}`}><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">0{index + 1}</p><h2 className="mt-4 text-3xl font-semibold">{card}</h2><p className="mt-4 leading-7 text-slate-300">Figma-style previews, modular UI rules, color systems, typography systems, grid standards, and implementation contracts.</p></motion.article>)}</section>
      <section id="scale" className="px-6 py-28 text-center lg:px-16"><motion.h2 {...reveal} className="mx-auto max-w-4xl text-4xl font-semibold md:text-6xl">A modular system that makes future products faster, cleaner, and more consistent.</motion.h2></section>
    </main>
  );
}
