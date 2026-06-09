<script lang="ts">
	import { scaleLinear, line, area, curveBasis } from 'd3';
	import findings from '$lib/data/findings.json';
	import { reveal, inView } from '$lib/actions';

	const a = findings.asymmetry;

	// ---- (a) density curves (illustrative, matched to reported shapes) ----
	const g = (x: number, mu: number, sig: number) => Math.exp(-0.5 * ((x - mu) / sig) ** 2);
	const strengthD = (x: number) => 0.92 * g(x, 2.2, 1.8) + 0.2 * g(x, 5, 2.2) + 0.06 * g(x, -1.5, 1.6);
	const severityD = (x: number) => 0.64 * g(x, -3, 1.9) + 0.42 * g(x, 1.9, 1.7);

	const xs = Array.from({ length: 121 }, (_, i) => -10 + (i * 20) / 120);
	const maxD = Math.max(...xs.map(strengthD), ...xs.map(severityD));

	const CW = 360,
		CH = 215;
	const cm = { l: 30, r: 14, t: 14, b: 34 };
	const dx = scaleLinear().domain([-10, 10]).range([cm.l, CW - cm.r]);
	const dy = scaleLinear().domain([0, maxD * 1.08]).range([CH - cm.b, cm.t]);

	const linePath = (fn: (x: number) => number) =>
		line<number>()
			.x((d) => dx(d))
			.y((d) => dy(fn(d)))
			.curve(curveBasis)(xs);
	const areaPath = (fn: (x: number) => number) =>
		area<number>()
			.x((d) => dx(d))
			.y0(dy(0))
			.y1((d) => dy(fn(d)))
			.curve(curveBasis)(xs);

	// ---- (b) joint outcome bars ----
	const cats = [
		{ key: 'ideal', label: 'S↑ W↓', sub: 'ideal', color: 'var(--up)' },
		{ key: 'mixed', label: 'S↑ W↑', sub: 'mixed', color: 'var(--soft)' },
		{ key: 'rare', label: 'S↓ W↓', sub: 'rare', color: 'var(--line-strong)' },
		{ key: 'worst', label: 'S↓ W↑', sub: 'worst', color: 'var(--weak)' }
	];
	const rows = [
		{ name: 'All rounds', vals: [67.7, 18.4, 0.8, 13.1] },
		{ name: 'Accepted update', vals: [99.2, 0.5, 0.0, 0.3] },
		{ name: 'No update', vals: [53.6, 26.3, 1.1, 19.0] }
	];

	let shown = $state(false);
</script>

<section class="sec asym" use:inView={() => (shown = true)}>
	<div class="wrap">
		<div class="sec-head" use:reveal>
			<span class="kicker">Finding 2</span>
			<h2 class="sec-title">The strength–weakness <em>asymmetry</em>.</h2>
			<p class="sec-lead">
				<strong class="claim">Easier to impress than to convince.</strong>
				AI reviewers respond to positive presentation signals in a stable, predictable manner, yet
				their response to attempts at dissolving criticism is uncontrollable and frequently
				backfires. They <b>reward the salience of strengths more readily than they forgive the
				evidence of weaknesses.</b>
			</p>
		</div>

		<!-- big asymmetry stats -->
		<div class="bigstats" use:reveal={{ delay: 60 }}>
			<div class="bs up">
				<div class="bs-num tnum">{a.strengthImprove}%</div>
				<div class="bs-lab">of rounds <b>improve perceived strength</b></div>
				<div class="bs-sub mono">mean Δ +{a.strengthMean} · backfire only {a.strengthBackfire}%</div>
			</div>
			<div class="vs mono">vs</div>
			<div class="bs weak">
				<div class="bs-num tnum">{a.severityBackfire}%</div>
				<div class="bs-lab">of weakness edits <b>backfire</b></div>
				<div class="bs-sub mono">{a.backfireRatio}× the strength backfire rate</div>
			</div>
		</div>

		<div class="panels">
			<!-- (a) density -->
			<div class="panel card" use:reveal={{ delay: 80 }}>
				<div class="p-h">
					<span class="p-t">(a) Per-round Δ distribution</span>
					<div class="legend mono">
						<span><i class="sw" style="background:var(--up)"></i>Δ strength</span>
						<span><i class="sw" style="background:var(--weak)"></i>Δ severity</span>
					</div>
				</div>
				<svg viewBox="0 0 {CW} {CH}" class="dsvg">
					<line x1={dx(0)} x2={dx(0)} y1={cm.t} y2={CH - cm.b} class="zero" />
					<text x={dx(0)} y={CH - cm.b + 13} class="zlab">0</text>
					{#each [-10, -5, 5, 10] as t}
						<text x={dx(t)} y={CH - cm.b + 13} class="ax">{t}</text>
					{/each}
					<text x={(cm.l + CW - cm.r) / 2} y={CH - 4} class="axt">Δ score (post-attack − baseline)</text>

					<path d={areaPath(severityD)} class="ar-sev" style:opacity={shown ? 1 : 0} />
					<path d={areaPath(strengthD)} class="ar-str" style:opacity={shown ? 1 : 0} />
					<path d={linePath(severityD)} class="ln-sev" class:draw={shown} />
					<path d={linePath(strengthD)} class="ln-str" class:draw={shown} />

					<text x={dx(4.6)} y={dy(strengthD(2.2)) - 6} class="anno up">86.1% positive ▸</text>
					<text x={dx(-9.6)} y={dy(severityD(-3)) - 8} class="anno weak">◂ 31.6% backfire</text>
				</svg>
				<p class="p-note">
					Δ strength is right-skewed and unimodal; Δ severity is <b>bimodal</b>: a second hump on the
					positive side is criticism that got <i>harsher</i>.
				</p>
			</div>

			<!-- (b) joint outcome -->
			<div class="panel card" use:reveal={{ delay: 140 }}>
				<div class="p-h">
					<span class="p-t">(b) Joint outcome by round type</span>
				</div>
				<div class="jrows">
					{#each rows as r}
						<div class="jrow">
							<span class="jname mono">{r.name}</span>
							<div class="jbar">
								{#each r.vals as v, ci}
									{#if v > 0}
										<span
											class="jseg"
											style="width:{shown ? v : 0}%; background:{cats[ci].color}"
											title="{cats[ci].label} {cats[ci].sub} {v}%"
										>
											{#if v >= 9}<span class="jval">{v}%</span>{/if}
										</span>
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</div>
				<div class="jcap mono">
					<b>S</b> = perceived strength · <b>W</b> = weakness severity &nbsp;(<b>↑</b> rises, <b>↓</b> falls)
				</div>
				<div class="jlegend">
					{#each cats as c}
						<span class="jl mono"><i class="sw" style="background:{c.color}"></i>{c.label} <em>{c.sub}</em></span>
					{/each}
				</div>
				<p class="p-note">
					In rounds that <i>fail</i> the gate, strengths are still enhanced <b>{a.noUpdateStrength}%</b>
					of the time, yet weaknesses deteriorate in {a.noUpdateSevWorse}%; failures stem not from
					insufficient strength gains but from weaknesses <b>resistant to dissolution</b>. For
					{a.paperLevel}% of papers, mean strength gain exceeds mean weakness reduction.
				</p>
			</div>
		</div>

		<!-- swamping callout -->
		<div class="swamp" use:reveal={{ delay: 80 }}>
			<div class="sw-mark mono">SWAMPING EFFECT</div>
			<p>
				Among all rounds where the overall score <i>rises</i>,
				<strong class="tnum">{a.swamping}%</strong> simultaneously exhibit worsening weaknesses.
				Even when deficiencies are criticized more harshly, the score still climbs as long as
				sufficiently salient new strengths are introduced, and the aggregate judgment is
				<i>swamped</i> by amplified strength signals.
			</p>
		</div>
	</div>
</section>

<style>
	.asym {
		background:
			radial-gradient(ellipse 70% 60% at 85% 10%, rgba(var(--up-rgb), 0.04), transparent 60%),
			var(--paper);
	}
	.bigstats {
		display: flex;
		align-items: stretch;
		gap: 16px;
		margin-bottom: 26px;
	}
	.bs {
		flex: 1;
		padding: 20px 22px;
		border-radius: 14px;
		border: 1px solid var(--line);
		background: var(--card);
		box-shadow: var(--sh-1);
	}
	.bs.up {
		border-left: 4px solid var(--up);
	}
	.bs.weak {
		border-left: 4px solid var(--weak);
	}
	.bs-num {
		font-family: var(--f-display);
		font-size: clamp(28px, 3.8vw, 40px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.02em;
	}
	.bs.up .bs-num {
		color: var(--up-2);
	}
	.bs.weak .bs-num {
		color: var(--weak-2);
	}
	.bs-lab {
		margin-top: 7px;
		font-size: 13px;
		color: var(--ink-soft);
	}
	.bs-lab b {
		color: var(--ink);
		font-weight: 600;
	}
	.bs-sub {
		margin-top: 5px;
		font-size: 11.5px;
		color: var(--muted);
	}
	.vs {
		display: grid;
		place-items: center;
		font-size: 13px;
		color: var(--faint);
		letter-spacing: 0.1em;
	}

	.panels {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.panel {
		padding: 16px 18px 18px;
	}
	.p-h {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
		flex-wrap: wrap;
		gap: 6px;
	}
	.p-t {
		font-family: var(--f-display);
		font-size: 13.5px;
		font-weight: 560;
	}
	.legend {
		display: flex;
		gap: 14px;
		font-size: 11px;
		color: var(--muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	.sw {
		width: 10px;
		height: 10px;
		border-radius: 3px;
		display: inline-block;
	}
	.dsvg {
		width: 100%;
		height: auto;
	}
	.zero {
		stroke: var(--line-strong);
		stroke-width: 1;
		stroke-dasharray: 3 3;
	}
	.zlab,
	.ax {
		fill: var(--muted);
		font-family: var(--f-mono);
		font-size: 10px;
		text-anchor: middle;
	}
	.axt {
		fill: var(--faint);
		font-family: var(--f-mono);
		font-size: 9.5px;
		text-anchor: middle;
	}
	.ar-str {
		fill: var(--up);
		opacity: 0;
		fill-opacity: 0.16;
		transition: opacity 0.6s 0.5s;
	}
	.ar-sev {
		fill: var(--weak);
		opacity: 0;
		fill-opacity: 0.14;
		transition: opacity 0.6s 0.5s;
	}
	.ln-str,
	.ln-sev {
		fill: none;
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-dasharray: 600;
		stroke-dashoffset: 600;
	}
	.ln-str {
		stroke: var(--up);
	}
	.ln-sev {
		stroke: var(--weak);
	}
	.ln-str.draw,
	.ln-sev.draw {
		transition: stroke-dashoffset 1.3s ease;
		stroke-dashoffset: 0;
	}
	.anno {
		font-family: var(--f-mono);
		font-size: 9.5px;
		font-weight: 500;
	}
	.anno.up {
		fill: var(--up-2);
		text-anchor: start;
	}
	.anno.weak {
		fill: var(--weak-2);
		text-anchor: start;
	}
	.p-note {
		margin-top: 10px;
		font-size: 12.5px;
		color: var(--muted);
		line-height: 1.5;
	}
	.p-note b {
		color: var(--weak-2);
	}

	/* joint bars */
	.jrows {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin-top: 8px;
	}
	.jrow {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.jname {
		font-size: 11.5px;
		color: var(--ink-soft);
	}
	.jbar {
		display: flex;
		height: 30px;
		border-radius: 7px;
		overflow: hidden;
		background: var(--paper-3);
	}
	.jseg {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: width 1s cubic-bezier(0.5, 0, 0.2, 1);
		min-width: 0;
	}
	.jval {
		font-family: var(--f-mono);
		font-size: 11px;
		font-weight: 600;
		color: #fff;
		white-space: nowrap;
	}
	.jcap {
		margin-top: 16px;
		padding-top: 12px;
		border-top: 1px solid var(--line);
		font-size: 10.5px;
		color: var(--muted);
	}
	.jcap b {
		color: var(--ink-soft);
		font-weight: 600;
	}
	.jlegend {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;
	}
	.jl {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		color: var(--ink-soft);
	}
	.jl em {
		font-style: normal;
		color: var(--muted);
	}

	.swamp {
		margin-top: 22px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px 22px 18px;
		border-radius: 14px;
		background: var(--card);
		border: 1px solid var(--line);
		border-left: 3px solid var(--weak);
		box-shadow: var(--sh-1);
		color: var(--ink);
	}
	.sw-mark {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		align-self: flex-start;
		font-size: 11px;
		letter-spacing: 0.16em;
		color: var(--weak-2);
		white-space: nowrap;
	}
	.sw-mark::before {
		content: '';
		width: 16px;
		height: 2px;
		background: var(--weak);
		border-radius: 2px;
	}
	.swamp p {
		font-size: 13px;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.swamp strong {
		color: var(--weak-2);
		font-family: var(--f-display);
		font-size: 16px;
		font-weight: 600;
	}
	.swamp i {
		font-style: italic;
		color: var(--weak-2);
	}

	@media (max-width: 860px) {
		.panels {
			grid-template-columns: 1fr;
		}
		.bigstats {
			flex-direction: column;
		}
		.vs {
			padding: 4px 0;
		}
	}
</style>
