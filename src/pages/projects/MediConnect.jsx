import { motion } from "framer-motion";

const reveal = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } };

export default function MediConnect() {
  return (
    <main className="min-h-screen bg-[#050609] text-white">
      <section className="grid min-h-screen items-center gap-12 px-6 py-28 lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
        <motion.div {...reveal}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Project 01 / Healthcare Ecosystem</p>
          <h1 className="mt-5 max-w-3xl text-6xl font-semibold leading-none md:text-8xl">Medi Connect</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A clinical SaaS platform connecting patients, doctors, hospitals, and laboratories through calm dashboards and care-first workflows.</p>
          <a className="mt-9 inline-flex rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold" href="/#work">Back to Showcase</a>
        </motion.div>
        <motion.div {...reveal} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-2xl">
          <div className="mb-5 flex gap-2"><span className="h-2 w-2 rounded-full bg-white/30" /><span className="h-2 w-2 rounded-full bg-white/30" /><span className="h-2 w-2 rounded-full bg-white/30" /></div>
          <div className="grid grid-cols-[0.85fr_1.15fr] gap-4">
            <div className="h-48 rounded-2xl bg-emerald-300/10" />
            <div className="h-48 rounded-2xl bg-gradient-to-br from-blue-400/20 to-violet-400/20" />
            {["Patients", "Doctors", "Labs", "Reports"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-slate-300">{item}</div>)}
          </div>
        </motion.div>
      </section>
      <nav className="sticky top-0 z-20 flex gap-3 overflow-x-auto border-y border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl">
        {["Problem", "Workflow", "Dashboard", "System Flow", "Decisions", "Technical", "Outcome"].map((item) => <a key={item} className="shrink-0 rounded-full px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10" href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>{item}</a>)}
      </nav>
      <section id="problem" className="px-6 py-28 lg:px-16"><motion.h2 {...reveal} className="max-w-4xl text-4xl font-semibold md:text-6xl">Healthcare teams needed one calm operating layer instead of scattered care touchpoints.</motion.h2><div className="mt-10 grid gap-4 md:grid-cols-4">{["4 user roles", "24/7 care context", "3x scan target", "AA contrast"].map((m) => <div key={m} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-slate-200">{m}</div>)}</div></section>
      <section id="workflow" className="px-6 py-28 lg:px-16"><motion.h2 {...reveal} className="text-4xl font-semibold md:text-6xl">A guided path from symptom discovery to report follow-up.</motion.h2></section>
      <section id="dashboard" className="px-6 py-28 lg:px-16"><div className="grid gap-5 md:grid-cols-3">{["Analytics cards", "Patient records", "Mobile + desktop mockups"].map((x) => <motion.article {...reveal} key={x} className="min-h-64 rounded-3xl border border-white/10 bg-white/[0.05] p-6"><h3 className="text-2xl font-semibold">{x}</h3></motion.article>)}</div></section>
      <section id="system-flow" className="px-6 py-28 lg:px-16"><motion.h2 {...reveal} className="text-4xl font-semibold md:text-6xl">Patient, doctor, hospital, and lab flows share one source of truth.</motion.h2></section>
      <section id="decisions" className="px-6 py-28 lg:px-16"><motion.h2 {...reveal} className="text-4xl font-semibold md:text-6xl">Trust comes from restraint, hierarchy, and predictable states.</motion.h2></section>
      <section id="technical" className="px-6 py-28 lg:px-16"><motion.h2 {...reveal} className="text-4xl font-semibold md:text-6xl">Reusable dashboard modules shaped for enterprise delivery.</motion.h2></section>
      <section id="outcome" className="px-6 py-28 text-center lg:px-16"><motion.h2 {...reveal} className="mx-auto max-w-4xl text-4xl font-semibold md:text-6xl">A premium healthcare experience that feels organized, human, and ready for real operations.</motion.h2></section>
    </main>
  );
}
