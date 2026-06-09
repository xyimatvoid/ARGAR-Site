<script lang="ts">
	import { scaleLinear } from 'd3';
	import results from '$lib/data/results.json';
	import { reveal, inView, countUp } from '$lib/actions';

	const data = results.main;

	// chart geometry
	const W = 720,
		H = 40 + data.length * 66;
	const m = { top: 30, right: 70, bottom: 40, left: 118 };
	const x = scaleLinear()
		.domain([3, 7])
		.range([m.left, W - m.right]);
	const ticks = [3, 4, 5, 6, 7]; // vertical gridlines only, no numeric labels
	const rowY = (i: number) => m.top + 22 + i * 66;

	let shown = $state(false);
	let hover = $state<number | null>(null);
	let mx = $state(0);
	let my = $state(0);

	function track(e: MouseEvent) {
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		mx = e.clientX - r.left;
		my = e.clientY - r.top;
	}
</script>

<section id="results" class="sec results">
	<div class="wrap">
		<div class="sec-head" use:reveal>
			<span class="kicker">Finding 1</span>
			<h2 class="sec-title">Overall attack <em>effectiveness</em>.</h2>
			<p class="sec-lead">
				<strong class="claim">Repackaging alone shifts AI reviews.</strong>
				With methods, experiments, figures and numbers held fixed, presentation edits alone produce
				<b>systematic</b> score gains across all three reviewer models: <b>+1.21 mean</b>, <b>75.1%
				success rate</b>.
			</p>
		</div>

		<!-- headline -->
		<div class="headline" use:reveal={{ delay: 60 }}>
			<div class="hl-card">
				<div class="hl-num tnum" use:countUp={{ to: 75.1, decimals: 1, suffix: '%' }}>75.1%</div>
				<div class="hl-lab">attack success rate</div>
				<div class="hl-sub mono">papers with ΔS ≥ +1</div>
			</div>
			<div class="hl-card">
				<div class="hl-num tnum up" use:countUp={{ to: 1.21, decimals: 2, prefix: '+' }}>+1.21</div>
				<div class="hl-lab">mean score gain</div>
				<div class="hl-sub mono">out of 10 · science unchanged</div>
			</div>
		</div>

		<!-- dumbbell chart -->
		<div class="chart card" use:reveal={{ delay: 100 }} use:inView={() => (shown = true)}>
			<div class="chart-h">
				<span class="ch-title">Original → Attacked review score</span>
				<div class="legend mono">
					<span><span class="lg ld-o"></span>Original</span>
					<span><span class="lg ld-a"></span>Attacked</span>
				</div>
			</div>
			<div class="plot" role="presentation" onmousemove={track}>
			<svg viewBox="0 0 {W} {H}" class="svg" role="img" aria-label="Original versus attacked scores per model">
				<!-- reject → weak-accept gradient field (no numeric ticks) -->
				<defs>
					<linearGradient id="zonegrad" x1="0" x2="1" y1="0" y2="0">
						<stop offset="0%" stop-color="#ed6a52" stop-opacity="0.14" />
						<stop offset="42%" stop-color="#ed6a52" stop-opacity="0.02" />
						<stop offset="58%" stop-color="#2fa279" stop-opacity="0.03" />
						<stop offset="100%" stop-color="#2fa279" stop-opacity="0.17" />
					</linearGradient>
				</defs>
				<rect x="0" y="0" width={W} height={H} fill="url(#zonegrad)" />

				<!-- vertical gridlines (no numeric labels) -->
				{#each ticks as t}
					<line x1={x(t)} x2={x(t)} y1={m.top - 6} y2={H - m.bottom} class="grid" />
				{/each}

				<!-- zone end labels -->
				<text x={m.left + 4} y={m.top - 12} class="zone-lab reject">← Reject</text>
				<text x={W - m.right - 4} y={m.top - 12} class="zone-lab accept" text-anchor="end">Weak Accept →</text>

				<!-- baseline + scale note (no numeric ticks) -->
				<line x1={m.left} x2={W - m.right} y1={H - m.bottom} y2={H - m.bottom} class="axis-line" />
				<text x={(m.left + W - m.right) / 2} y={H - 8} class="axis-title">review score · 0–10</text>

				{#each data as d, i}
					{@const yy = rowY(i)}
					{@const xo = x(d.orig)}
					{@const xa = shown ? x(d.attacked) : x(d.orig)}
					<g
						class="row"
						class:dim={hover !== null && hover !== i}
						role="button"
						tabindex="0"
						onmouseenter={() => (hover = i)}
						onmouseleave={() => (hover = null)}
						onfocus={() => (hover = i)}
						onblur={() => (hover = null)}
					>
						<rect x="0" y={yy - 34} width={W} height="68" fill="transparent" />
						<!-- model label -->
						<text x={m.left - 16} y={yy - 4} class="model">{d.model}</text>
						<text x={m.left - 16} y={yy + 14} class="model-sub">ASR {d.asr}%</text>

						<!-- connector -->
						<line x1={xo} x2={xa} y1={yy} y2={yy} class="conn" style="transition-delay:{i * 120}ms" />
						<!-- orig dot -->
						<circle cx={xo} cy={yy} r="5.5" class="dot-o" />
						<!-- attacked dot -->
						<circle cx={xa} cy={yy} r="6.5" class="dot-a" style="transition-delay:{i * 120}ms" />
						<!-- delta label -->
						<g style="transition-delay:{i * 120 + 200}ms" class="dlabel" class:in={shown}>
							<text x={xa + 18} y={yy - 6} class="d-val">+{d.dS.toFixed(2)}</text>
							<text x={xa + 18} y={yy + 11} class="d-lab">ΔS</text>
						</g>
					</g>
				{/each}
			</svg>

			{#if hover !== null}
				{@const d = data[hover]}
				<div class="tip" style="left:{mx}px; top:{my}px">
					<b>{d.model}</b>
					<div class="tip-row"><span>orig → attacked</span><span><i>{d.orig.toFixed(2)}</i> → <i class="up">{d.attacked.toFixed(2)}</i></span></div>
					<div class="tip-row"><span>ΔS · ASR</span><span><i class="up">+{d.dS.toFixed(2)}</i> · <i>{d.asr}%</i></span></div>
					<div class="tip-row"><span>Δ strength&nbsp;↑</span><span><i class="up">+{d.dStr.toFixed(2)}</i></span></div>
					<div class="tip-row"><span>Δ severity&nbsp;↓</span><span><i class="dn">{d.dSev.toFixed(2)}</i></span></div>
					<div class="tip-row"><span>Δ content&nbsp;↑</span><span><i class="up">+{d.dCont.toFixed(2)}</i></span></div>
				</div>
			{/if}
			</div>

			<!-- metric key: two dimensions, score is only half of it -->
			<div class="metric-key">
				<div class="mk-group">
					<span class="mk-gh mono">Numerical score</span>
					<div class="mk">
						<span class="mk-t">ΔS</span>
						<span class="mk-d">mean review-score shift, out of 10</span>
					</div>
					<div class="mk">
						<span class="mk-t">ASR</span>
						<span class="mk-d">share of papers with ΔS ≥ +1</span>
					</div>
				</div>
				<div class="mk-group">
					<span class="mk-gh mono">Content shift · pairwise judge <em>(scores capture only half)</em></span>
					<div class="mk">
						<span class="mk-t up">Δ strength&nbsp;↑</span>
						<span class="mk-d">perceived strengths (higher means more praise)</span>
					</div>
					<div class="mk">
						<span class="mk-t dn">Δ severity&nbsp;↓</span>
						<span class="mk-d">weakness severity (lower means less criticism)</span>
					</div>
					<div class="mk">
						<span class="mk-t up">Δ content&nbsp;↑</span>
						<span class="mk-d">Δstrength − Δseverity (net content-level gain)</span>
					</div>
				</div>
			</div>
		</div>

		<!-- ablation -->
		<div class="ablation" use:reveal={{ delay: 80 }}>
			<div class="abl-head">
				<h3>Built on three design dimensions.</h3>
				<span class="mono">our attack beats every baseline on both reviewers; effectiveness comes from the synergy of all three · {results.ablation.note}</span>
			</div>
			<div class="matrix">
				<div class="mrow mhead mono">
					<span class="m-name">Method</span>
					{#each results.ablation.reviewers as rv}<span class="m-ds">ΔS · {rv}</span>{/each}
					{#each results.ablation.pillars as p}<span class="m-cap">{p}</span>{/each}
				</div>
				{#each results.ablation.rows as r}
					<div class="mrow" class:ours={r.ours}>
						<span class="m-name">
							<b>{r.method}</b>{#if r.ours}<em>ours</em>{/if}
							<small>{r.short}</small>
						</span>
						{#each r.dS as d}
							<span class="m-ds">
								<span class="mini-bar"><span class="mini-fill" style="width:{(d / results.ablation.maxDS) * 100}%"></span></span>
								<i class="tnum" class:up={r.ours}>+{d.toFixed(2)}</i>
							</span>
						{/each}
						{#each r.has as h}
							<span class="m-cap">
								{#if h === true}<span class="yes" title="has it">✓</span>
								{:else if h === 'partial'}<span class="partial" title="signal-guided, but no strategy pool">◐</span>
								{:else}<span class="no" title="missing">✗</span>{/if}
							</span>
						{/each}
					</div>
				{/each}
			</div>
			<p class="matrix-key mono">
				<span class="yes">✓</span> has it &nbsp;·&nbsp;
				<span class="partial">◐</span> signal-guided, but no strategy pool &nbsp;·&nbsp;
				<span class="no">✗</span> missing
			</p>
		</div>
	</div>
</section>

<style>
	.results {
		border-bottom: 1px solid var(--line);
	}
	/* headline */
	.headline {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		align-items: stretch;
		margin-bottom: 26px;
	}
	.hl-card {
		padding: 14px 20px;
		border-radius: 13px;
		background: var(--card);
		border: 1px solid var(--line);
		box-shadow: var(--sh-1);
	}
	.hl-num {
		font-family: var(--f-display);
		font-size: clamp(28px, 3.4vw, 38px);
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1;
		color: var(--weak-2);
	}
	.hl-num.up {
		color: var(--up-2);
	}
	.hl-lab {
		margin-top: 6px;
		font-size: 13px;
		font-weight: 600;
	}
	.hl-sub {
		font-size: 11px;
		color: var(--muted);
		margin-top: 2px;
	}
	/* chart */
	.chart {
		position: relative;
		padding: 18px 20px 12px;
	}
	.chart-h {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 4px;
	}
	.ch-title {
		font-family: var(--f-display);
		font-size: 16px;
		font-weight: 560;
	}
	.legend {
		display: flex;
		gap: 16px;
		font-size: 11.5px;
		color: var(--muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.lg {
		width: 11px;
		height: 11px;
		border-radius: 50%;
	}
	.ld-o {
		background: var(--paper-3);
		border: 2px solid var(--line-strong);
	}
	.ld-a {
		background: var(--up);
	}
	.plot {
		position: relative;
	}
	.svg {
		width: 100%;
		height: auto;
		display: block;
	}
	.grid {
		stroke: var(--line-2);
		stroke-width: 1;
		stroke-dasharray: 2 4;
		opacity: 0.7;
	}
	/* hover tooltip: follows the cursor */
	.tip {
		position: absolute;
		transform: translate(-50%, calc(-100% - 16px));
		pointer-events: none;
		z-index: 6;
		min-width: 210px;
		background: var(--ink);
		color: var(--paper);
		border-radius: 11px;
		padding: 13px 15px;
		box-shadow: var(--sh-3);
	}
	.tip b {
		font-family: var(--f-display);
		font-size: 15px;
		display: block;
		margin-bottom: 8px;
	}
	.tip-row {
		display: flex;
		justify-content: space-between;
		gap: 18px;
		font-family: var(--f-mono);
		font-size: 13px;
		line-height: 1.9;
		color: var(--on-dark-2);
	}
	.tip-row i {
		font-style: normal;
		color: #fff;
		font-weight: 500;
	}
	.tip-row i.up {
		color: #7ee0b0;
	}
	.tip-row i.dn {
		color: #f5a890;
	}
	.zone-lab {
		font-family: var(--f-mono);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
	}
	.zone-lab.reject {
		fill: var(--weak-2);
	}
	.zone-lab.accept {
		fill: var(--up-2);
	}
	.axis-line {
		stroke: var(--line-2);
		stroke-width: 1;
	}
	.axis-title {
		fill: var(--faint);
		font-family: var(--f-mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-anchor: middle;
		text-transform: uppercase;
	}
	.row {
		cursor: pointer;
	}
	.row.dim {
		opacity: 0.4;
		transition: opacity 0.2s;
	}
	.model {
		fill: var(--ink);
		font-family: var(--f-display);
		font-size: 13px;
		font-weight: 560;
		text-anchor: end;
	}
	.model-sub {
		fill: var(--muted);
		font-family: var(--f-mono);
		font-size: 9.5px;
		text-anchor: end;
	}
	.conn {
		stroke: var(--up);
		stroke-width: 4;
		stroke-linecap: round;
		opacity: 0.4;
		transition: x2 0.9s cubic-bezier(0.34, 1.1, 0.5, 1);
	}
	.dot-o {
		fill: var(--paper);
		stroke: var(--line-strong);
		stroke-width: 2;
	}
	.dot-a {
		fill: var(--up);
		stroke: var(--card);
		stroke-width: 2;
		transition: cx 0.9s cubic-bezier(0.34, 1.1, 0.5, 1);
		filter: drop-shadow(0 1px 3px rgba(var(--up-rgb), 0.25));
	}
	.dlabel {
		opacity: 0;
		transition: opacity 0.5s;
	}
	.dlabel.in {
		opacity: 1;
	}
	.d-val {
		fill: var(--up-2);
		font-family: var(--f-display);
		font-size: 13.5px;
		font-weight: 600;
	}
	.d-lab {
		fill: var(--muted);
		font-family: var(--f-mono);
		font-size: 8.5px;
	}
	/* metric key */
	.metric-key {
		display: grid;
		grid-template-columns: 0.86fr 1.14fr;
		gap: 16px;
		margin-top: 22px;
	}
	.mk-group {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 14px 16px 6px;
		background: var(--paper-2);
		border: 1px solid var(--line);
		border-radius: 12px;
	}
	.mk-gh {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--faint);
		padding-bottom: 10px;
		margin-bottom: 6px;
		border-bottom: 1px solid var(--line);
	}
	.mk-gh em {
		font-style: normal;
		text-transform: none;
		letter-spacing: 0;
		color: var(--muted);
	}
	.mk {
		display: grid;
		grid-template-columns: 104px 1fr;
		gap: 12px;
		align-items: baseline;
		padding: 8px 0;
		border-bottom: 1px solid var(--line);
	}
	.mk:last-child {
		border-bottom: none;
	}
	.mk-t {
		justify-self: start;
		font-family: var(--f-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--ink-soft);
		background: var(--paper-3);
		border: 1px solid var(--line-2);
		padding: 2px 8px;
		border-radius: 6px;
		white-space: nowrap;
	}
	.mk-t.up {
		color: var(--up-2);
		background: var(--up-bg);
		border-color: transparent;
	}
	.mk-t.dn {
		color: var(--weak-2);
		background: var(--weak-bg);
		border-color: transparent;
	}
	.mk-d {
		font-size: 12.5px;
		color: var(--ink-soft);
		line-height: 1.4;
	}

	/* ablation */
	.ablation {
		margin-top: clamp(34px, 5vw, 52px);
	}
	.abl-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 14px;
	}
	.abl-head h3 {
		font-size: clamp(20px, 2.6vw, 26px);
		font-weight: 520;
	}
	.abl-head span {
		font-size: 11.5px;
		color: var(--muted);
	}
	.matrix {
		border: 1px solid var(--line);
		border-radius: 12px;
		overflow: hidden;
		background: var(--card);
	}
	.mrow {
		display: grid;
		grid-template-columns: 2.2fr 1.2fr 1.2fr 0.8fr 0.8fr 0.8fr;
		gap: 12px;
		align-items: center;
		padding: 13px 18px;
		border-bottom: 1px solid var(--line);
	}
	.mrow:last-child {
		border-bottom: none;
	}
	.mhead {
		background: var(--paper-3);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--ink-soft);
		border-bottom: 1px solid var(--line-2);
	}
	.mrow.ours {
		background: var(--up-bg);
	}
	.m-name {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.m-name b {
		font-weight: 600;
		font-size: 14.5px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.m-name small {
		font-size: 11.5px;
		font-weight: 400;
		color: var(--muted);
	}
	.mhead .m-name {
		font: inherit;
	}
	.m-name em {
		font-style: normal;
		font-family: var(--f-mono);
		font-size: 9px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #fff;
		background: var(--up);
		padding: 2px 6px;
		border-radius: 5px;
	}
	.m-cap {
		text-align: center;
	}
	.yes,
	.no {
		display: inline-grid;
		place-items: center;
		width: 23px;
		height: 23px;
		border-radius: 50%;
		font-size: 12px;
		font-weight: 700;
		line-height: 1;
	}
	.yes {
		color: var(--up-2);
		background: var(--up-bg);
	}
	.no {
		color: var(--weak-2);
		background: var(--weak-bg);
	}
	.partial {
		color: var(--soft-2);
		background: var(--soft-bg);
	}
	.matrix-key {
		margin: 12px 2px 0;
		font-size: 11.5px;
		color: var(--muted);
		display: flex;
		flex-wrap: wrap;
		gap: 4px 8px;
		align-items: center;
	}
	.matrix-key .yes,
	.matrix-key .no,
	.matrix-key .partial {
		width: 17px;
		height: 17px;
		font-size: 10px;
	}
	.mhead .m-ds {
		text-align: left;
	}
	.m-ds {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.mini-bar {
		flex: 1;
		height: 7px;
		background: var(--paper-3);
		border-radius: 99px;
		overflow: hidden;
		max-width: 110px;
	}
	.mini-fill {
		display: block;
		height: 100%;
		background: var(--line-strong);
		border-radius: 99px;
	}
	.ours .mini-fill {
		background: var(--up);
	}
	.m-ds i {
		font-style: normal;
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-soft);
	}
	.m-ds i.up {
		color: var(--up-2);
	}

	@media (max-width: 620px) {
		.metric-key {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.mrow {
			grid-template-columns: 1.5fr 1fr 0.6fr 0.6fr 0.6fr;
			gap: 8px;
			padding: 12px 12px;
		}
		.mrow .m-ds:nth-of-type(3) {
			display: none;
		}
		.m-name small {
			display: none;
		}
		.headline {
			grid-template-columns: 1fr;
		}
	}
</style>
