import { useEffect, useRef } from 'react';
import { mountParticleBackground } from '../../js/components/particle-background.js';

/** One canvas per portfolio page, independent of content loading and re-renders. */
export function PortfolioBackground() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => mountParticleBackground(host.current), []);
  return <div ref={host} className="site-bg" aria-hidden="true"><div className="noise" /></div>;
}
