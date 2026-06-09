/** Reveal-on-scroll: adds `.in` when the element enters the viewport. */
export function reveal(node: HTMLElement, options: { delay?: number; once?: boolean } = {}) {
	const { delay = 0, once = true } = options;
	node.classList.add('reveal');
	if (delay) node.style.setProperty('--rd', `${delay}ms`);

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					node.classList.add('in');
					if (once) io.unobserve(node);
				} else if (!once) {
					node.classList.remove('in');
				}
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}

/** Count up to a target number when scrolled into view. */
export function countUp(
	node: HTMLElement,
	opts: {
		to: number;
		from?: number;
		decimals?: number;
		prefix?: string;
		suffix?: string;
		duration?: number;
	}
) {
	const { to, from = 0, decimals = 0, prefix = '', suffix = '', duration = 1300 } = opts;
	const fmt = (v: number) => prefix + v.toFixed(decimals) + suffix;
	node.textContent = fmt(from);

	let started = false;
	const run = (ts0: number) => {
		const step = (ts: number) => {
			const t = Math.min(1, (ts - ts0) / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			node.textContent = fmt(from + (to - from) * eased);
			if (t < 1) requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	};

	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting && !started) {
					started = true;
					if (matchMedia('(prefers-reduced-motion: reduce)').matches) node.textContent = fmt(to);
					else requestAnimationFrame((ts) => run(ts));
					io.unobserve(node);
				}
			}
		},
		{ threshold: 0.6 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}

/** Fire a callback once when the node first enters the viewport (for chart/animation triggers). */
export function inView(node: HTMLElement, cb: () => void) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					cb();
					io.unobserve(node);
				}
			}
		},
		{ threshold: 0.25 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
