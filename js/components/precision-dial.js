/**
 * Precision Dial Scroll Progress Indicator (Sticky Clock-based Gauge)
 * Supports both Desktop hero dial and Mobile bottom nav precision dial.
 * Rotates smoothly like a clock based on total page scroll percentage (0% to 100%).
 */
export function initPrecisionDial() {
  const desktopDial = document.getElementById('hero-precision-dial');
  const mobileDial = document.getElementById('mobile-precision-dial');

  if (!desktopDial && !mobileDial) return () => {};

  // Desktop elements
  const desktopNeedle = desktopDial?.querySelector('#dial-needle-group');
  const desktopProgressRing = desktopDial?.querySelector('.dial-progress-ring');
  const desktopLabelText = desktopDial?.querySelector('.label-text');
  const desktopLink = desktopDial?.querySelector('.precision-dial-link');

  // Mobile elements
  const mobileNeedle = mobileDial?.querySelector('.mobile-dial-needle-group');
  const mobileProgressRing = mobileDial?.querySelector('.mobile-dial-progress-ring');
  const mobilePercent = mobileDial?.querySelector('.mobile-dial-percent');

  const DESKTOP_RING_CIRCUMFERENCE = 339.29; // 2 * PI * 54
  const MOBILE_RING_CIRCUMFERENCE = 326.72; // 2 * PI * 52

  let targetAngle = 0;
  let currentAngle = 0;
  let animId = null;
  let isHovered = false;

  function updateScrollProgress() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollFraction = Math.min(1, Math.max(0, scrollY / maxScroll));
    const percent = Math.round(scrollFraction * 100);

    // Clock rotation: 0% -> 0deg (12 o'clock), 100% -> 360deg
    targetAngle = scrollFraction * 360;

    // Desktop Progress Ring
    if (desktopProgressRing) {
      const offset = DESKTOP_RING_CIRCUMFERENCE - (scrollFraction * DESKTOP_RING_CIRCUMFERENCE);
      desktopProgressRing.style.strokeDashoffset = `${offset.toFixed(2)}`;
    }

    // Mobile Progress Ring
    if (mobileProgressRing) {
      const mobileOffset = MOBILE_RING_CIRCUMFERENCE - (scrollFraction * MOBILE_RING_CIRCUMFERENCE);
      mobileProgressRing.style.strokeDashoffset = `${mobileOffset.toFixed(2)}`;
    }

    // Desktop Dynamic Label
    if (desktopLabelText && !isHovered) {
      if (scrollY < 120) {
        desktopLabelText.textContent = 'SCROLL';
      } else {
        desktopLabelText.textContent = `${percent}%`;
      }
    }

    // Mobile Percent Label
    if (mobilePercent) {
      mobilePercent.textContent = `${percent}%`;
    }

    if (desktopDial) {
      if (scrollY > 300) {
        desktopDial.classList.add('can-scroll-top');
      } else {
        desktopDial.classList.remove('can-scroll-top');
      }
    }

    if (mobileDial) {
      if (scrollY > 300) {
        mobileDial.classList.add('can-scroll-top');
      } else {
        mobileDial.classList.remove('can-scroll-top');
      }
    }
  }

  function onMouseEnter() {
    isHovered = true;
    if (desktopDial) {
      desktopDial.classList.add('is-hovered');
    }
    if (desktopLabelText) {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      desktopLabelText.textContent = scrollY > 300 ? 'TOP ↑' : 'EXPLORE ↓';
    }
  }

  function onMouseLeave() {
    isHovered = false;
    if (desktopDial) {
      desktopDial.classList.remove('is-hovered');
    }
    updateScrollProgress();
  }

  function animate() {
    // Smooth dampening towards target clock angle
    const diff = targetAngle - currentAngle;
    currentAngle += diff * 0.18;

    if (desktopNeedle) {
      desktopNeedle.setAttribute('transform', `translate(60, 60) rotate(${currentAngle.toFixed(2)})`);
    }
    if (mobileNeedle) {
      mobileNeedle.setAttribute('transform', `translate(60, 60) rotate(${currentAngle.toFixed(2)})`);
    }

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });

  if (desktopDial) {
    desktopDial.addEventListener('mouseenter', onMouseEnter);
    desktopDial.addEventListener('mouseleave', onMouseLeave);
  }

  animId = requestAnimationFrame(animate);
  updateScrollProgress();

  // Desktop Click Action
  if (desktopLink) {
    desktopLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleDialClick();
    });
  }

  // Mobile Click Action
  if (mobileDial) {
    mobileDial.addEventListener('click', (e) => {
      e.preventDefault();
      handleDialClick();
    });
  }

  function handleDialClick() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 300) {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const target = document.querySelector('#expertise') || document.querySelector('#work');
      if (target) {
        if (window.lenis) {
          window.lenis.scrollTo(target, { duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('scroll', updateScrollProgress);
    window.removeEventListener('resize', updateScrollProgress);
    if (desktopDial) {
      desktopDial.removeEventListener('mouseenter', onMouseEnter);
      desktopDial.removeEventListener('mouseleave', onMouseLeave);
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPrecisionDial);
} else {
  initPrecisionDial();
}
