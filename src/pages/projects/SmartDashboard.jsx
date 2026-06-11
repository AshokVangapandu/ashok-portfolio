import { motion } from "framer-motion";

const reveal = { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } };
const tiles = ["Executive Overview", "KPI Strip", "Operations Pulse", "Revenue Intelligence", "Widget Collection", "Mobile Analytics", "Data Visualization", "Final Gallery"];

export default function SmartDashboard() {
  return (
    <main className="min-h-screen bg-[#050609] text-white">
      <section className="flex min-h-[92vh] items-end px-6 py-24 lg:px-16"><motion.div {...reveal}><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Project 05 / Cinematic Analytics Gallery</p><h1 className="mt-5 max-w-6xl text-6xl font-semibold leading-none md:text-9xl">Smart Dashboards</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">A premium visual gallery of enterprise dashboards, KPI systems, chart views, widgets, and mobile analytics.</p><a className="mt-9 inline-flex rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold" href="/#work">Back to Showcase</a></motion.div></section>
      <nav className="sticky top-0 z-20 flex gap-3 overflow-x-auto border-y border-white/10 bg-black/40 px-6 py-3 backdrop-blur-xl">{["Gallery", "Analytics", "Insights", "Widgets", "Visualization", "Mobile", "Final"].map((item) => <a key={item} className="shrink-0 rounded-full px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10" href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
      <section id="gallery" className="columns-1 gap-5 px-6 py-24 md:columns-2 xl:columns-3 lg:px-16">{tiles.map((tile, index) => <motion.article {...reveal} key={tile} className={`mb-5 break-inside-avoid rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-2xl ${index % 3 === 0 ? "min-h-[430px]" : index % 3 === 1 ? "min-h-[250px]" : "min-h-[340px]"}`}><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">{tile}</p><div className="mt-6 grid gap-3"><span className="h-32 rounded-2xl bg-gradient-to-r from-emerald-300/30 via-blue-300/20 to-violet-300/30" /><span className="h-10 rounded-xl bg-white/[0.06]" /><span className="h-10 rounded-xl bg-white/[0.06]" /></div></motion.article>)}</section>
      <section id="final" className="px-6 py-28 text-center lg:px-16"><motion.h2 {...reveal} className="mx-auto max-w-4xl text-4xl font-semibold md:text-6xl">A highly visual analytics case study that lets the dashboards lead the narrative.</motion.h2></section>
    </main>
  );
}
