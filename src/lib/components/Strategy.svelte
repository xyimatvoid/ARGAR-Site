<script lang="ts">
	import findings from '$lib/data/findings.json';
	import { reveal, inView } from '$lib/actions';

	const baseline = findings.strategies.baseline; // 30.8
	type Row = {
		name: string;
		firstHit?: number;
		expRate: number;
		dStr?: number;
		dSev?: number;
		tier: 'narrative' | 'structural' | 'surface';
	};
	const surface: Row[] = [
		{ name: 'Table formatting', expRate: 29.8, tier: 'surface' },
		{ name: 'Local text polishing', expRate: 27.8, tier: 'surface' },
		{ name: 'Algorithm boxes', expRate: 26.5, tier: 'surface' }
	];
	const all: Row[] = [...(findings.strategies.rows as Row[]), ...surface];

	// (1) what opens the attack, ranked by first-hit attribution
	const openers = (findings.strategies.rows as Row[])
		.slice()
		.sort((a, b) => (b.firstHit ?? 0) - (a.firstHit ?? 0));
	const maxFH = 92;

	// (2) what sustains the gain, ranked by accepted-exposure rate
	const sustainers = all.slice().sort((a, b) => b.expRate - a.expRate);
	const maxExp = 52;

	const FLIP = 'Contribution list enhancement';

	let shown = $state(false);
</script>

<section class="sec strat" use:inView={() => (shown = true)}>
	<div class="wrap">
		<div class="sec-head" use:reveal>
			<span class="kicker">Finding 3</span>
			<h2 class="sec-title">Strategy effectiveness <em>gradient</em>.</h2>
			<p class="sec-lead">
				<strong class="claim">Reframing beats polishing.</strong>
				Success is not “better writing → higher score.” Edits that change <b>how the reviewer
				understands the paper</b> (what it contributes and how significant it is) far outperform
				ones that only improve surface appearance. And a strategy that <i>opens</i> the attack is not
				the one that <i>sustains</i> it.
			</p>
		</div>

		<!-- two stages: opener vs. sustainer -->
		<div class="duo">
			<!-- (1) openers -->
			<div class="rank-card card" use:reveal={{ delay: 60 }}>
				<div class="rc-head">
					<span class="rc-tag mono stage1">Stage 1 · first breakthrough</span>
					<h3>What <em>opens</em> the attack</h3>
					<p class="rc-sub">First-hit attribution: share of first successful rounds that contain the strategy.</p>
				</div>
				<div class="rlist">
					{#each openers as r, i}
						<div class="srow t-{r.tier}" class:flip={r.name === FLIP}>
							<span class="s-name">
								<span class="tdot"></span>{r.name}
								{#if r.name === FLIP}<em class="badge open">#1 opener</em>{/if}
							</span>
							<div class="s-bar">
								<span class="s-fill" style="width:{shown ? ((r.firstHit ?? 0) / maxFH) * 100 : 0}%; transition-delay:{i * 70}ms"></span>
							</div>
							<span class="s-val tnum">{r.firstHit}%</span>
						</div>
					{/each}
					<p class="rc-foot">
						<span class="tdot"></span>
						Surface edits (table formatting, text polishing, algorithm boxes) rarely appear in a
						first breakthrough at all. The opener is structural or narrative.
					</p>
				</div>
			</div>

			<!-- (2) sustainers -->
			<div class="rank-card card" use:reveal={{ delay: 120 }}>
				<div class="rc-head">
					<span class="rc-tag mono stage2">Later rounds · sustained</span>
					<h3>What <em>sustains</em> the gain</h3>
					<p class="rc-sub">Accepted-exposure rate: share of a strategy’s rounds accepted as the new best (baseline {baseline}%).</p>
				</div>
				<div class="rlist">
					{#each sustainers as r, i}
						{@const above = r.expRate >= baseline}
						{#if i > 0 && sustainers[i - 1].expRate >= baseline && !above}
							<div class="base-div mono"><span>baseline · {baseline}%</span></div>
						{/if}
						<div class="srow t-{r.tier}" class:flip={r.name === FLIP}>
							<span class="s-name">
								<span class="tdot"></span>{r.name}
								{#if r.name === FLIP}<em class="badge fade">↓ fades to #5</em>{/if}
							</span>
							<div class="s-bar">
								<span class="s-fill" class:dim={!above} style="width:{shown ? (r.expRate / maxExp) * 100 : 0}%; transition-delay:{i * 70}ms"></span>
							</div>
							<span class="s-val tnum" class:up={above}>{r.expRate}%</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- the flip, in one line -->
		<p class="flip-note">
			<b>Contribution-list enhancement</b> opens <b>87.2%</b> of first breakthroughs but sustains only a
			<b>36.8%</b> accepted-exposure rate, with diminishing returns in later rounds. <b>Narrative
			restructuring</b> (related-work repositioning, discussion expansion) is what sustains effectiveness
			once the baseline is raised, while surface edits (table formatting, polishing, algorithm boxes)
			stay below the 30.8% baseline.
		</p>
	</div>
</section>

<style>
	.strat {
		border-block: 1px solid var(--line);
		background:
			radial-gradient(ellipse 60% 50% at 10% 0%, rgba(var(--weak-rgb), 0.035), transparent 60%),
			var(--paper);
	}

	/* two-panel duo */
	.duo {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		align-items: stretch;
	}
	.rank-card {
		padding: 18px 20px 20px;
		display: flex;
		flex-direction: column;
	}
	.rc-head {
		margin-bottom: 14px;
		min-height: 86px;
	}
	.rc-tag {
		display: inline-block;
		font-size: 9.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 6px;
	}
	.rc-tag.stage1 {
		color: var(--soft-2);
		background: var(--soft-bg);
	}
	.rc-tag.stage2 {
		color: var(--weak-2);
		background: var(--weak-bg);
	}
	.rc-head h3 {
		margin-top: 9px;
		font-size: 17px;
		font-weight: 560;
	}
	.rc-head h3 em {
		font-style: italic;
		color: var(--weak-2);
	}
	.rc-sub {
		margin-top: 4px;
		font-size: 11.5px;
		color: var(--muted);
		line-height: 1.45;
	}

	.rlist {
		display: flex;
		flex-direction: column;
		gap: 11px;
		height: 252px;
		overflow-y: auto;
		padding-right: 6px;
	}
	.rc-foot {
		display: flex;
		gap: 8px;
		margin-top: 5px;
		padding-top: 13px;
		border-top: 1px solid var(--line);
		font-size: 11.5px;
		line-height: 1.5;
		color: var(--muted);
	}
	.rc-foot .tdot {
		margin-top: 5px;
		background: var(--blue);
	}
	.srow {
		display: grid;
		grid-template-columns: 1fr 88px 42px;
		gap: 10px;
		align-items: center;
	}
	.s-name {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 12.5px;
		color: var(--ink-soft);
		line-height: 1.25;
	}
	.tdot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex: none;
	}
	.t-narrative .tdot {
		background: var(--weak);
	}
	.t-structural .tdot {
		background: var(--soft);
	}
	.t-surface .tdot {
		background: var(--blue);
	}
	.badge {
		font-style: normal;
		font-family: var(--f-mono);
		font-size: 9px;
		letter-spacing: 0.04em;
		padding: 1px 6px;
		border-radius: 5px;
		white-space: nowrap;
	}
	.badge.open {
		color: var(--soft-2);
		background: var(--soft-bg);
	}
	.badge.fade {
		color: var(--weak-2);
		background: var(--weak-bg);
	}
	.s-bar {
		height: 9px;
		background: var(--paper-3);
		border-radius: 99px;
		overflow: hidden;
	}
	.s-fill {
		display: block;
		height: 100%;
		border-radius: 99px;
		background: var(--weak);
		transition: width 0.9s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.t-structural .s-fill {
		background: var(--soft);
	}
	.t-surface .s-fill {
		background: var(--blue);
	}
	.s-fill.dim {
		opacity: 0.5;
	}
	.s-val {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-soft);
		text-align: right;
	}
	.s-val.up {
		color: var(--weak-2);
	}
	.srow.flip .s-name {
		color: var(--ink);
		font-weight: 600;
	}
	.base-div {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 2px 0;
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.base-div::before,
	.base-div::after {
		content: '';
		flex: 1;
		height: 1px;
		background: repeating-linear-gradient(90deg, var(--line-2) 0 4px, transparent 4px 8px);
	}

	/* flip note */
	.flip-note {
		margin-top: 18px;
		padding: 14px 18px;
		border-left: 3px solid var(--weak);
		border-radius: 10px;
		background: var(--card);
		font-size: 13px;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.flip-note b {
		color: var(--ink);
		font-weight: 600;
	}

	@media (max-width: 900px) {
		.duo {
			grid-template-columns: 1fr;
		}
	}
</style>
