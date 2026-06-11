import { motion } from "framer-motion";

const reveal = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } };
const panels = ["Research Workflow", "Batch Management System", "Experiment Tracking", "Approval Workflows", "Dashboard Systems", "AI Integration Concepts"];

export default function VantageRND() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050609] text-white">
      <section className="relative overflow-hidden px-6 py-24 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(201,222,220,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(201,222,220,.028)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="pointer-events-none absolute right-10 top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <motion.p {...reveal} className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">R&amp;D Digital Ecosystem</motion.p>
            <motion.h1 {...reveal} className="mt-5 max-w-3xl text-[clamp(2.4rem,5vw,3.875rem)] font-bold leading-[1.02]">Connected R&amp;D Infrastructure For Modern Product Development.</motion.h1>
            <motion.p {...reveal} className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-300/80">Vantage Nutrition unifies formulation, compliance, costing, trials, approvals, and audit records inside one structured product lifecycle workspace.</motion.p>
            <motion.div {...reveal} className="mt-7 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.08em] text-emerald-100/75">
              {["Formula Intelligence", "QA Workflow", "Compliance Status", "Batch Intelligence"].map((item) => <span key={item} className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2">{item}</span>)}
            </motion.div>
            <motion.div {...reveal} className="mt-8 flex flex-wrap gap-3">
              <a className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/15 px-5 py-3 text-sm font-bold shadow-[0_18px_46px_rgba(22,161,110,.13)]" href="#research">Explore Lifecycle</a>
              <a className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-bold" href="#batch">View Workflow</a>
            </motion.div>
          </div>
          <motion.div {...reveal} className="relative min-h-[520px]">
            <div className="absolute inset-[9%_3%_7%] rotate-[-3deg] rounded-[2rem] border border-emerald-300/10 bg-emerald-300/[0.035]" />
            <div className="absolute left-[8%] right-[4%] top-1/2 -translate-y-1/2 rotate-[-1.5deg] rounded-[1.6rem] border border-white/10 bg-[#090e11]/85 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex justify-between border-b border-white/10 pb-5"><span className="text-xs font-bold uppercase tracking-[.08em] text-emerald-200/80">Lifecycle Command</span><strong className="text-2xl">Vantage R&amp;D OS</strong></div>
              <div className="mt-5 grid grid-cols-3 gap-3">{["Formula Validation", "Trial Progress", "Lifecycle Approval"].map((item, index) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><span className="text-[10px] font-bold uppercase tracking-[.08em] text-emerald-200/75">{item}</span><strong className="mt-5 block text-xl">{["Ready", "64%", "Review"][index]}</strong></div>)}</div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.035] p-4"><strong>Ingredient Matrix</strong><div className="mt-4 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 text-xs text-slate-300">{["Ingredient", "mg", "Status", "Active A", "180", "Ready", "Binder B", "42", "Review"].map((cell) => <span key={cell} className="border-b border-r border-white/10 p-3">{cell}</span>)}</div></div>
            </div>
          </motion.div>
        </div>
      </section>
      <nav className="sticky top-0 z-20 flex gap-3 overflow-x-auto border-y border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl">
        {["Research", "Batch", "Experiments", "Approvals", "Dashboards", "AI", "Impact"].map((item) => <a key={item} className="shrink-0 rounded-full px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10" href={`#${item.toLowerCase()}`}>{item}</a>)}
      </nav>
      <section className="flex snap-x gap-6 overflow-x-auto px-6 py-24 lg:px-16">
        {panels.map((panel, index) => (
          <motion.article {...reveal} id={panel.split(" ")[0].toLowerCase()} key={panel} className="min-h-[520px] w-[82vw] shrink-0 snap-start rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-2xl md:w-[46vw]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">0{index + 1}</p>
            <h2 className="mt-4 text-4xl font-semibold md:text-6xl">{panel}</h2>
            <p className="mt-5 max-w-xl leading-8 text-slate-300">Scientific workflows become visual, trackable, and approval-ready with graph panels, batch status cards, tablet manufacturing signals, and controlled decision history.</p>
            <div className="mt-10 grid grid-cols-5 gap-3">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="aspect-square rounded-full bg-gradient-to-br from-emerald-300/30 to-violet-300/20" />)}</div>
          </motion.article>
        ))}
      </section>
      <section id="impact" className="px-6 py-28 text-center lg:px-16"><motion.h2 {...reveal} className="mx-auto max-w-4xl text-4xl font-semibold md:text-6xl">A high-control R&amp;D workspace that turns scientific complexity into operational momentum.</motion.h2></section>
    </main>
  );
}
