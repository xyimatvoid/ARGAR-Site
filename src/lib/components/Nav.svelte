<script lang="ts">
	import meta from '$lib/data/meta.json';

	const links = [
		{ id: 'condition', label: 'Condition' },
		{ id: 'method', label: 'Method' },
		{ id: 'results', label: 'Results' },
		{ id: 'findings', label: 'Findings' },
		{ id: 'case', label: 'Case' },
		{ id: 'data', label: 'Benchmark' }
	];

	let scrolled = $state(false);
	let progress = $state(0);
	let active = $state('');

	function onScroll() {
		scrolled = window.scrollY > 24;
		const h = document.documentElement;
		const max = h.scrollHeight - h.clientHeight;
		progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;

		let cur = '';
		for (const l of links) {
			const el = document.getElementById(l.id);
			if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = l.id;
		}
		active = cur;
	}

	$effect(() => {
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});
</script>

<header class="nav" class:scrolled>
	<div class="bar wrap">
		<a class="brand" href="#top" aria-label="Top">
			<span class="glyph" aria-hidden="true">
				<svg viewBox="0 0 24 24" width="20" height="20">
					<rect x="4" y="3" width="13" height="18" rx="2" class="pg" />
					<line x1="7" y1="7" x2="13" y2="7" />
					<line x1="7" y1="10" x2="14" y2="10" />
					<line x1="7" y1="13" x2="11" y2="13" />
					<path d="M15 18 L18.5 13.5 L21 16" class="arr" />
				</svg>
			</span>
			<span class="bt">
				<b>Adversarial Repackaging</b>
				<i class="mono">peer-review gaming</i>
			</span>
		</a>

		<nav class="links mono">
			{#each links as l}
				<a href={'#' + l.id} class:on={active === l.id}>{l.label}</a>
			{/each}
		</nav>

		<a class="btn btn-signal cta" href={meta.links[0].href} target="_blank" rel="noopener">
			{meta.links[0].label}
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
				><path d="M7 17 L17 7 M9 7 h8 v8" stroke-linecap="round" stroke-linejoin="round" /></svg
			>
		</a>
	</div>
	<div class="progress" style="--p:{progress}"></div>
</header>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
		border-bottom: 1px solid transparent;
	}
	.nav.scrolled {
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		backdrop-filter: blur(14px) saturate(1.3);
		-webkit-backdrop-filter: blur(14px) saturate(1.3);
		border-bottom-color: var(--line);
		box-shadow: 0 6px 24px -18px rgba(28, 36, 51, 0.4);
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		height: 64px;
	}
	.brand {
		display: inline-flex;
		align-items: center;
		gap: 11px;
	}
	.glyph {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--card);
		border: 1px solid var(--line-2);
		box-shadow: var(--sh-1);
	}
	.glyph svg {
		stroke: var(--muted);
		stroke-width: 1.6;
		fill: none;
		stroke-linecap: round;
	}
	.glyph .pg {
		fill: var(--card-2);
		stroke: var(--line-strong);
	}
	.glyph .arr {
		stroke: var(--weak);
		stroke-width: 2;
	}
	.bt {
		display: flex;
		flex-direction: column;
		line-height: 1.05;
	}
	.bt b {
		font-family: var(--f-display);
		font-weight: 600;
		font-size: 16px;
		letter-spacing: -0.01em;
	}
	.bt i {
		font-style: normal;
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.links {
		display: flex;
		gap: 4px;
		font-size: 13px;
	}
	.links a {
		padding: 7px 12px;
		border-radius: 8px;
		color: var(--ink-soft);
		transition: color 0.18s, background 0.18s;
		position: relative;
	}
	.links a:hover {
		color: var(--ink);
		background: var(--paper-2);
	}
	.links a.on {
		color: var(--weak-2);
	}
	.links a.on::after {
		content: '';
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: 2px;
		height: 1.5px;
		background: var(--weak);
		border-radius: 2px;
	}
	.cta {
		padding: 9px 15px;
		font-size: 12.5px;
	}
	.progress {
		height: 2px;
		width: 100%;
		transform-origin: left;
		transform: scaleX(var(--p, 0));
		background: linear-gradient(90deg, var(--weak), var(--soft) 60%, var(--up));
		opacity: 0;
		transition: opacity 0.3s;
	}
	.nav.scrolled .progress {
		opacity: 1;
	}
	@media (max-width: 880px) {
		.links {
			display: none;
		}
		.bt i {
			display: none;
		}
	}
	@media (max-width: 520px) {
		.bt b {
			font-size: 14px;
		}
	}
</style>
