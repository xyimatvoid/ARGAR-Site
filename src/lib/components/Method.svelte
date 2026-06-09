<script lang="ts">
	import { reveal } from '$lib/actions';

	const stages = [
		{ n: 1, name: 'Profile', glyph: '◎', desc: 'Extract structured signals from the N reviews: recurring perceptions, tagged by frequency & severity.' },
		{ n: 2, name: 'Plan', glyph: '⊞', desc: 'Map unresolved signals to strategies from a 20+ pool. Protect recognized strengths; avoid past backfires.' },
		{ n: 3, name: 'Edit & Compile', glyph: '✎', desc: 'Apply presentation-level LaTeX edits and recompile the PDF; the science is held fixed.' },
		{ n: 4, name: 'Review', glyph: '❖', desc: 'Generate N fresh independent reviews of the new PDF from the black-box reviewer.' },
		{ n: 5, name: 'Evaluate', glyph: '⟁', desc: 'A pairwise judge scores Δstrength / Δseverity against the fixed original baseline.' },
		{ n: 6, name: 'Update', glyph: '↻', desc: 'Direction gate + selection score decide promotion. Keep best-so-far; recover from failures.' }
	];

	let active = $state(0);
	const cur = $derived(stages[active]);

	// node positions on a ring
	const R = 41;
	const pos = stages.map((_, i) => {
		const t = (-90 + i * 60) * (Math.PI / 180);
		return { left: 50 + R * Math.cos(t), top: 50 + R * Math.sin(t) };
	});

	// Click a node to activate it; no auto-advance.

	const pillars = [
		{ t: 'Closed-loop iteration', d: 'Best-version tracking across rounds, not a single blind rewrite.', icon: 'loop', accent: 'blue' },
		{ t: 'Full-paper editing', d: 'The whole presentation layer is in scope, not just the abstract.', icon: 'layers', accent: 'flip' },
		{ t: 'Signal-driven strategy', d: "Each round conditions on the reviewer's own specific feedback.", icon: 'target', accent: 'weak' }
	];
</script>

<section id="method" class="sec method">
	<div class="wrap">
		<div class="sec-head" use:reveal>
			<span class="kicker">The method</span>
			<h2 class="sec-title">Adversarial <em>Repackaging</em>.</h2>
			<p class="sec-lead">Three design choices define it; each round then runs them as a closed loop.</p>
		</div>

		<!-- three design choices = what defines the method -->
		<div class="pillars top">
			{#each pillars as p, i}
				<div class="pillar card a-{p.accent}" use:reveal={{ delay: 80 + i * 70 }}>
					<span class="p-ic">
						{#if p.icon === 'loop'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v5h-5" /></svg>
						{:else if p.icon === 'layers'}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /><path d="m3 18 9 5 9-5" opacity=".55" /></svg>
						{:else}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /></svg>
						{/if}
					</span>
					<div class="p-body">
						<h4>{p.t}</h4>
						<p>{p.d}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="layout">
			<!-- the ring -->
			<div class="ring-wrap" use:reveal={{ delay: 60 }}>
				<div class="ring">
					<svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true">
						<circle cx="50" cy="50" r="41" class="orbit" />
						<circle
							cx="50"
							cy="50"
							r="41"
							class="orbit-prog"
							pathLength="6"
							style="stroke-dashoffset:{-active}"
						/>
					</svg>

					{#each stages as s, i}
						<button
							class="node"
							class:on={i === active}
							class:past={i < active}
							style="left:{pos[i].left}%; top:{pos[i].top}%"
							onclick={() => (active = i)}
							aria-pressed={i === active}
							aria-label={s.name}
						>
							<span class="ng">{s.glyph}</span>
							<span class="nn mono">{s.name}</span>
							<span class="nidx mono">{s.n}</span>
						</button>
					{/each}

					<!-- center readout -->
					<div class="hub">
						<span class="hub-loop mono">REPACKAGING LOOP</span>
						{#key active}
							<div class="hub-body">
								<div class="hub-stage">
									<span class="hub-n mono">{cur.n}</span>
									<h3>{cur.name}</h3>
								</div>
								<p>{cur.desc}</p>
							</div>
						{/key}
					</div>
				</div>
			</div>

			<!-- rails -->
			<div class="rails" use:reveal={{ delay: 140 }}>
				<div class="rail card">
					<div class="rail-h mono"><span class="rd up"></span> BEST-VERSION STATE</div>
					<div class="bv">
						{#each [0, 1, 2, 3, 4] as r}
							<div class="bv-step" class:promoted={r <= active % 5}>
								<span class="bv-dot"></span>
								<span class="bv-lab mono">r{r + 1}</span>
							</div>
						{/each}
						<div class="bv-track"></div>
					</div>
					<p class="rail-note">
						Best score climbs only on accepted rounds; failed edits are rolled back, never carried.
					</p>
				</div>

				<div class="rail card">
					<div class="rail-h mono"><span class="rd weak"></span> STRATEGY POOL · 20+</div>
					<div class="pool">
						<div class="pool-cat narrative">
							<b>Narrative restructuring</b>
							<span>changes how the reviewer interprets the paper</span>
						</div>
						<div class="pool-cat surface">
							<b>Surface editing</b>
							<span>improves presentation without altering the narrative</span>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</section>

<style>
	.method {
		background:
			radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--weak-rgb), 0.035), transparent 70%),
			var(--paper);
		border-block: 1px solid var(--line);
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		gap: clamp(24px, 4vw, 48px);
		align-items: center;
	}

	/* ring */
	.ring-wrap {
		display: grid;
		place-items: center;
	}
	.ring {
		position: relative;
		width: min(100%, 480px);
		aspect-ratio: 1;
	}
	.ring-svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.orbit {
		fill: none;
		stroke: var(--line-2);
		stroke-width: 0.5;
		stroke-dasharray: 1.4 2;
	}
	.orbit-prog {
		fill: none;
		stroke: var(--weak);
		stroke-width: 1;
		stroke-linecap: round;
		stroke-dasharray: 1 5;
		transition: stroke-dashoffset 0.6s cubic-bezier(0.5, 0, 0.2, 1);
		transform: rotate(-90deg);
		transform-origin: center;
	}
	.node {
		position: absolute;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		width: 92px;
		padding: 10px 6px 8px;
		border-radius: 12px;
		background: var(--card);
		border: 1px solid var(--line-2);
		box-shadow: var(--sh-1);
		cursor: pointer;
		transition:
			transform 0.3s cubic-bezier(0.34, 1.3, 0.5, 1),
			box-shadow 0.3s,
			border-color 0.3s,
			background 0.3s;
		font-family: inherit;
	}
	.node .ng {
		font-size: 18px;
		line-height: 1;
		color: var(--muted);
		transition: color 0.3s;
	}
	.node .nn {
		font-size: 10.5px;
		font-weight: 500;
		color: var(--ink-soft);
		letter-spacing: 0.02em;
		text-align: center;
		line-height: 1.1;
		min-height: 2.2em;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.node .nidx {
		position: absolute;
		top: -7px;
		right: -7px;
		width: 18px;
		height: 18px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--paper-2);
		border: 1px solid var(--line-2);
		font-size: 9.5px;
		color: var(--muted);
	}
	.node.past {
		border-color: var(--up-line);
	}
	.node.past .ng {
		color: var(--up-2);
	}
	.node.on {
		transform: translate(-50%, -50%) scale(1.12);
		background: var(--weak);
		border-color: var(--weak);
		box-shadow: 0 8px 24px -8px rgba(var(--weak-rgb), 0.5);
		z-index: 5;
	}
	.node.on .ng,
	.node.on .nn {
		color: #fff;
	}
	.node.on .nidx {
		background: #fff;
		border-color: #fff;
		color: var(--weak-2);
	}

	.hub {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 56%;
		aspect-ratio: 1;
		border-radius: 50%;
		background: var(--card);
		border: 1px dashed var(--line-2);
		box-shadow: var(--sh-1), 0 0 0 8px rgba(246, 248, 252, 0.7);
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		padding: 8% 11%;
	}
	.hub-loop {
		font-size: 9px;
		letter-spacing: 0.18em;
		color: var(--faint);
	}
	.hub-body {
		animation: hubin 0.45s ease;
	}
	@keyframes hubin {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.hub-stage {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 8px;
	}
	.hub-n {
		width: 22px;
		height: 22px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--weak);
		color: #fff;
		font-size: 12px;
		font-weight: 600;
	}
	.hub-stage h3 {
		font-size: clamp(17px, 2.2vw, 22px);
		font-weight: 600;
	}
	.hub-body p {
		margin-top: 9px;
		font-size: clamp(11px, 1.25vw, 12.5px);
		color: var(--ink-soft);
		line-height: 1.42;
	}

	/* rails */
	.rails {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.rail {
		padding: 16px 18px;
	}
	.rail-h {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 10.5px;
		letter-spacing: 0.12em;
		color: var(--muted);
	}
	.rd {
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}
	.rd.up {
		background: var(--up);
	}
	.rd.weak {
		background: var(--weak);
	}
	.bv {
		position: relative;
		display: flex;
		justify-content: space-between;
		margin: 16px 4px 12px;
	}
	.bv-track {
		position: absolute;
		left: 6px;
		right: 6px;
		top: 6px;
		height: 2px;
		background: var(--line-2);
		z-index: 0;
	}
	.bv-step {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.bv-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--paper);
		border: 2px solid var(--line-strong);
		transition: all 0.4s;
	}
	.bv-step.promoted .bv-dot {
		background: var(--up);
		border-color: var(--up);
		box-shadow: 0 0 0 4px var(--up-bg);
	}
	.bv-lab {
		font-size: 10px;
		color: var(--muted);
	}
	.rail-note {
		font-size: 12px;
		color: var(--muted);
		line-height: 1.45;
	}
	.pool {
		margin-top: 13px;
		display: flex;
		flex-direction: column;
		gap: 9px;
	}
	.pool-cat {
		padding: 10px 12px;
		border-radius: 9px;
		border: 1px solid var(--line);
	}
	.pool-cat b {
		font-size: 13px;
		display: block;
	}
	.pool-cat span {
		font-size: 11.5px;
		color: var(--muted);
	}
	.pool-cat.narrative {
		background: var(--weak-bg);
		border-color: var(--weak-line);
	}
	.pool-cat.narrative b {
		color: var(--weak-2);
	}
	.pool-cat.surface {
		background: var(--blue-bg);
		border-color: var(--blue-line);
	}
	.pool-cat.surface b {
		color: var(--blue-2);
	}

	/* pillars */
	.pillars {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}
	.pillars.top {
		margin-top: clamp(22px, 3vw, 34px);
		margin-bottom: clamp(34px, 5vw, 56px);
	}
	.pillar {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 20px;
		transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s;
	}
	.pillar:hover {
		transform: translateY(-4px);
		box-shadow: var(--sh-2);
	}
	.pillar .p-ic {
		flex: 0 0 auto;
		width: 44px;
		height: 44px;
		border-radius: 12px;
		display: grid;
		place-items: center;
		color: var(--c);
		background: var(--tint);
	}
	.pillar .p-ic svg {
		width: 22px;
		height: 22px;
	}
	.a-weak {
		--c: var(--weak-2);
		--tint: var(--weak-bg);
	}
	.a-blue {
		--c: var(--blue-2);
		--tint: var(--blue-bg);
	}
	.a-flip {
		--c: var(--flip-2);
		--tint: var(--flip-bg);
	}
	.pillar h4 {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.pillar p {
		margin-top: 5px;
		font-size: 13.5px;
		color: var(--ink-soft);
		line-height: 1.45;
	}

	@media (max-width: 940px) {
		.layout {
			grid-template-columns: 1fr;
		}
		.ring {
			width: min(100%, 420px);
		}
		.pillars {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 520px) {
		.ring {
			width: min(100%, 300px);
		}
		.node {
			width: 70px;
			padding: 7px 4px 6px;
		}
		.node .ng {
			font-size: 15px;
		}
		.node .nn {
			font-size: 9px;
		}
		.hub {
			padding: 9% 9%;
		}
	}
</style>
