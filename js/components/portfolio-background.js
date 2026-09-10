import { mountParticleBackground } from './particle-background.js';

const dispose = mountParticleBackground(document.querySelector('.site-bg'));
if (import.meta.hot) import.meta.hot.dispose(dispose);
