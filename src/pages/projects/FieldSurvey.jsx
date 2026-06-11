import { motion } from "framer-motion";

const reveal = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } };

function Phone({ alt = false }) {
  return <div className={`rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl ${alt ? "rotate-6 scale-90" : "-rotate-6"}`}><span className="mx-auto mb-5 block h-2 w-20 rounded-full bg-white/20" /><div className="h-56 rounded-3xl bg-[linear-gradient(135deg,transparent_24%,rgba(101,230,196,.4)_25%,transparent_28%),radial-gradient(circle_at_64%_38%,#65e6c4_0_5px,transparent_6px),rgba(255,255,255,.06)]" />{[1, 2, 3].map((i) => <span key={i} className="mt-4 block h-12 rounded-2xl bg-white/[0.06]" />)}</div>;
}

export default function FieldSurvey() {
  return (
    <main className="min-h-screen bg-[#050609] text-white">
      <section className="grid min-h-screen items-center gap-12 px-6 py-28 lg:grid-cols-[0.85fr_1.15fr] lg:px-16">
        <motion.div {...reveal} className="relative grid min-h-[620px] grid-cols-2 items-start gap-4"><Phone /><div className="mt-20"><Phone alt /></div></motion.div>
        <motion.div {...reveal}><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Project 03 / Mobile Field Operations</p><h1 className="mt-5 text-6xl font-semibold leading-none md:text-8xl">Field Survey Personnel</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A mobile-first route tracking and task workflow product for teams moving through real-world locations.</p><a className="mt-9 inline-flex rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold" href="/#work">Back to Showcase</a></motion.div>
      </section>
      <nav className="sticky top-0 z-20 flex gap-3 overflow-x-auto border-y border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl">{["Route", "GPS", "Tasks", "Sync", "Offline", "Challenges", "Impact"].map((item) => <a key={item} className="shrink-0 rounded-full px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10" href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
      {["Route Management", "GPS Tracking", "Task Workflow", "Real-time Sync", "Offline Accessibility", "UI Challenges", "Operational Impact"].map((section) => <section id={section.split(" ")[0].toLowerCase()} key={section} className="px-6 py-28 lg:px-16"><motion.h2 {...reveal} className="max-w-4xl text-4xl font-semibold md:text-6xl">{section}</motion.h2><p className="mt-5 max-w-2xl leading-8 text-slate-300">Map visuals, task status cards, route concepts, and resilient sync states keep outdoor workflows clear and accountable.</p></section>)}
    </main>
  );
}
