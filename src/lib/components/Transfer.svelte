<script lang="ts">
	import { scaleLinear } from 'd3';
	import lb from '$lib/data/leaderboard.json';
	import { reveal } from '$lib/actions';

	const models = lb.models;
	const matrix = lb.transferMatrix;
	const cell = (s: string, t: string) => matrix.find((m) => m.source === s && m.target === t)!;
	const maxD = Math.max(...matrix.map((m) => m.deltaS));
	const color = scaleLinear<string>()
		.domain([0, maxD * 0.5, maxD])
		.range(['#eef3fa', '#f7bdb0', '#ed6a52']);
	const tw = Math.max(...lb.templates.map((t) => t.deltaS));

	let hover = $state<{ s: string; t: string } | null>(null);
</script>

<section class="sec transfer">
	<div class="wrap">
		<div class="sec-head" use:reveal>
			<span class="kicker">Appendix · transferability</span>
			<h2 class="sec-title">Not tied to one model or template: it <em>transfers</em>.</h2>
			<p class="sec-lead">
				An attack optimized against one reviewer still works when a different model re-scores the
				paper, and across other venues’ guidelines. Every off-diagonal entry stays positive.
			</p>
		</div>

		<div class="grid">
			<!-- heatmap -->
			<div class="hm card" use:reveal={{ delay: 60 }}>
				<div class="hm-h">
					<span class="hm-t">Cross-model ΔS</span>
					<span class="hm-axis mono">optimized ↓ · re-scored →</span>
				</div>
				<div class="hm-grid" style="grid-template-columns: 96px repeat({models.length}, 1fr)">
					<span class="hm-corner"></span>
					{#each models as t}
						<span class="hm-col mono">{t.label}</span>
					{/each}
					{#each models as s}
						<span class="hm-row mono">{s.label}</span>
						{#each models as t}
							{@const c = cell(s.key, t.key)}
							<button
								class="hm-cell"
								class:diag={c.diagonal}
								style="background:{color(c.deltaS)}"
								onmouseenter={() => (hover = { s: s.key, t: t.key })}
								onmouseleave={() => (hover = null)}
							>
								<span class="hm-v tnum" class:light={c.deltaS > maxD * 0.55}>+{c.deltaS.toFixed(2)}</span>
								{#if c.diagonal}<span class="hm-diag-mark"></span>{/if}
							</button>
						{/each}
					{/each}
				</div>
				<div class="hm-foot">
					<div class="means mono">
						<span>matched <b class="weak">+{lb.means.matched}</b></span>
						<span>mismatched <b>+{lb.means.mismatched}</b></span>
					</div>
					<div class="scalebar">
						<span class="mono">0</span>
						<span class="grad"></span>
						<span class="mono">+{maxD.toFixed(1)}</span>
					</div>
				</div>
			</div>

			<!-- templates -->
			<div class="tmpl card" use:reveal={{ delay: 120 }}>
				<div class="hm-h">
					<span class="hm-t">Cross-template ΔS</span>
					<span class="hm-axis mono">reviewer: Sonnet 4.5</span>
				</div>
				<div class="tlist">
					{#each lb.templates as t, i}
						<div class="trow" use:reveal={{ delay: 140 + i * 60 }}>
							<div class="tname">
								<b>{t.label}</b>
								<span class="mono">scale {t.scale}{#if t.matched} · optimized{/if}</span>
							</div>
							<div class="tbar">
								<span class="tfill" class:matched={t.matched} style="width:{(t.deltaS / tw) * 100}%"></span>
							</div>
							<span class="tval tnum">+{t.deltaS.toFixed(2)}</span>
						</div>
					{/each}
				</div>
				<p class="tnote mono">{lb.notes.template}</p>
			</div>
		</div>

		<p class="tfoot mono" use:reveal>{lb.notes.offdiag}</p>
	</div>
</section>

<style>
	.transfer {
		border-top: 1px solid var(--line);
		background: var(--paper-2);
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.hm,
	.tmpl {
		padding: 20px 22px;
	}
	.hm-h {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 16px;
	}
	.hm-t {
		font-family: var(--f-display);
		font-size: 17px;
		font-weight: 560;
	}
	.hm-axis {
		font-size: 10.5px;
		color: var(--faint);
		letter-spacing: 0.04em;
	}
	.hm-grid {
		display: grid;
		gap: 6px;
		align-items: center;
	}
	.hm-corner {
		display: block;
	}
	.hm-col {
		font-size: 11px;
		color: var(--muted);
		text-align: center;
	}
	.hm-row {
		font-size: 11px;
		color: var(--muted);
		text-align: right;
		padding-right: 8px;
	}
	.hm-cell {
		position: relative;
		aspect-ratio: 1.7;
		border: 1px solid rgba(0, 0, 0, 0.05);
		border-radius: 9px;
		display: grid;
		place-items: center;
		cursor: pointer;
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.hm-cell:hover {
		transform: scale(1.05);
		box-shadow: var(--sh-2);
		z-index: 2;
	}
	.hm-cell.diag {
		outline: 2px solid var(--ink);
		outline-offset: -2px;
	}
	.hm-v {
		font-family: var(--f-display);
		font-size: 17px;
		font-weight: 600;
		color: var(--ink);
	}
	.hm-v.light {
		color: #fff;
	}
	.hm-diag-mark {
		position: absolute;
		top: 5px;
		right: 6px;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ink);
	}
	.hm-foot {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		flex-wrap: wrap;
		gap: 10px;
	}
	.means {
		display: flex;
		gap: 16px;
		font-size: 12px;
		color: var(--muted);
	}
	.means b {
		font-family: var(--f-display);
		font-size: 15px;
		color: var(--ink);
	}
	.means b.weak {
		color: var(--weak-2);
	}
	.scalebar {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 10px;
		color: var(--muted);
	}
	.grad {
		width: 80px;
		height: 9px;
		border-radius: 99px;
		background: linear-gradient(90deg, #eef3fa, #f7bdb0, #ed6a52);
	}

	/* templates */
	.tlist {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.trow {
		display: grid;
		grid-template-columns: 130px 1fr 52px;
		gap: 12px;
		align-items: center;
	}
	.tname b {
		font-family: var(--f-display);
		font-size: 15px;
		font-weight: 580;
		display: block;
	}
	.tname span {
		font-size: 10px;
		color: var(--muted);
	}
	.tbar {
		height: 11px;
		background: var(--paper-3);
		border-radius: 99px;
		overflow: hidden;
	}
	.tfill {
		display: block;
		height: 100%;
		border-radius: 99px;
		background: var(--soft);
		transition: width 0.9s ease;
	}
	.tfill.matched {
		background: var(--weak);
	}
	.tval {
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-soft);
		text-align: right;
	}
	.tnote {
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		font-size: 11px;
		color: var(--muted);
		line-height: 1.55;
	}
	.tfoot {
		margin-top: 16px;
		font-size: 12px;
		color: var(--ink-soft);
		text-align: center;
		line-height: 1.5;
	}
	@media (max-width: 820px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
