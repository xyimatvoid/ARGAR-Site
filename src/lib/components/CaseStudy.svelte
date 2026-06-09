<script lang="ts">
	import cs from '$lib/data/case_study.json';
	import { reveal } from '$lib/actions';

	// the clearest, paper-attributed strength upgrades (not the full list)
	const strengthCards = cs.strengths.filter((s) => ['1', '3', '5'].includes(s.n));
	const tabs = [
		{ id: 'str', label: 'Strength inflation', count: strengthCards.length },
		{ id: 'weak', label: 'Limitation laundering', count: cs.mechanisms.length }
	];
	let tab = $state('str');

	const sub = Object.keys(cs.scores.before.sub) as Array<keyof typeof cs.scores.before.sub>;
</script>

<section id="case" class="sec case">
	<div class="wrap">
		<div class="sec-head" use:reveal>
			<span class="kicker">Case study · one campaign, start to finish</span>
			<h2 class="sec-title">Anatomy of a <em>case study</em>.</h2>
			<p class="sec-lead">{cs.meta.paperDesc}</p>
		</div>

		<!-- score header -->
		<div class="scorecard card" use:reveal={{ delay: 60 }}>
			<div class="sc-meta mono">
				<span><span class="rdot"></span>{cs.meta.reviewerModel}</span>
				<span>{cs.meta.template}</span>
				<span>temp {cs.meta.temperature}</span>
			</div>
			<div class="sc-body">
				<div class="sc-flip">
				<div class="sc-side before">
					<span class="sc-tag mono">BEFORE</span>
					<div class="sc-score tnum">{cs.scores.before.rating}<small>/10</small></div>
					<span class="sc-verdict reject">{cs.scores.before.verdict}</span>
				</div>
				<div class="sc-arrow">
					<svg width="46" height="22" viewBox="0 0 46 22" fill="none" stroke="currentColor" stroke-width="2"
						><path d="M2 11h40M34 4l8 7-8 7" stroke-linecap="round" stroke-linejoin="round" /></svg
					>
				</div>
				<div class="sc-side after">
					<span class="sc-tag mono">AFTER</span>
					<div class="sc-score tnum up">{cs.scores.after.rating}<small>/10</small></div>
					<span class="sc-verdict accept">{cs.scores.after.verdict}</span>
				</div>
			</div>
			<div class="sc-subs">
				{#each sub as k}
					<div class="subrow">
						<span class="sk">{k}</span>
						<span class="sbar">
							<span class="sb-before" style="width:{(cs.scores.before.sub[k] / 4) * 100}%"></span>
							<span class="sb-after" style="width:{(cs.scores.after.sub[k] / 4) * 100}%"></span>
						</span>
						<span class="sv mono">{cs.scores.before.sub[k]}→{cs.scores.after.sub[k]}</span>
					</div>
				{/each}
				<div class="sw-counts mono">
					<span class="up">strengths {cs.scores.before.strengths} → {cs.scores.after.strengths}</span>
					<span class="dn">weaknesses {cs.scores.before.weaknesses} → {cs.scores.after.weaknesses}</span>
				</div>
				</div>
			</div>
		</div>

		<p class="unchanged mono" use:reveal>
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
				><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg
			>
			Same 2 datasets · 5 methods · every number unchanged. Only the presentation moved.
		</p>

		<!-- tabs -->
		<div class="tabs" use:reveal={{ delay: 40 }}>
			{#each tabs as t}
				<button class="tab" class:on={tab === t.id} onclick={() => (tab = t.id)}>
					{t.label}<span class="tc mono">{t.count}</span>
				</button>
			{/each}
		</div>

		<div class="tabpane card">
			{#if tab === 'str'}
				<!-- framing shift -->
				<div class="framing">
					<div class="fr-col">
						<span class="fr-tag mono weak">BEFORE · skeptical framing</span>
						<p>{@html cs.summary.before}</p>
					</div>
					<div class="fr-col">
						<span class="fr-tag mono up">AFTER · premise accepted</span>
						<p>{@html cs.summary.after}</p>
					</div>
				</div>
				<p class="fr-note mono">{cs.summary.note}</p>

				<div class="strip">
					{#each strengthCards as s}
						<div class="mech">
							<h4>{s.category}</h4>
							<span class="mech-strat mono">strategy · {s.strategy}</span>
							<div class="mech-trans">
								<div class="mt-line">
									<span class="mt-lab mono">before</span>
									<p class="mt-o">{@html s.before}</p>
								</div>
								<span class="mt-arrow">↓</span>
								<div class="mt-line">
									<span class="mt-lab mono after">after</span>
									<p class="mt-r">{@html s.after}</p>
								</div>
							</div>
							<p class="mech-gloss">{s.gloss}</p>
						</div>
					{/each}
				</div>
			{:else}
				<p class="ll-intro">
					Of 6 original weaknesses, <b>3 are softened</b> and <b>3 removed</b> (one flipped into a
					strength); <b>2 new</b> ones surface, exactly the limitations the attacker planted. None is
					resolved in scientific content. Four mechanisms drive it:
				</p>
				<div class="mechgrid">
					{#each cs.mechanisms as m}
						<div class="mech">
							<div class="mech-h">
								<span class="mech-id mono">{m.id}</span>
								<span class="mech-eff e-{m.effect.split(' ')[0]}">{m.effect}</span>
							</div>
							<h4>{m.name}</h4>
							<span class="mech-strat mono">strategy · {m.strategy}</span>
							<div class="mech-trans">
								<div class="mt-line">
									<span class="mt-lab mono">before</span>
									<p class="mt-o">{@html m.original}</p>
								</div>
								<span class="mt-arrow">↓</span>
								<div class="mt-line">
									<span class="mt-lab mono after">after</span>
									<p class="mt-r">{@html m.result}</p>
								</div>
							</div>
							<p class="mech-gloss">{m.gloss}</p>
						{#if m.id === 'M3'}
							<div class="planted">
								<span class="planted-h mono">a new weakness that surfaced, exactly a decoy the attacker planted, e.g.:</span>
								<p class="planted-item">{@html cs.weaknessesAdded[1]}</p>
							</div>
						{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- ledger -->
		<div class="ledger" use:reveal>
			<span class="led-lab mono">LEDGER</span>
			<div class="led-lines mono">
				<span><b class="up">{cs.ledger.strengths}</b></span>
				<span><b class="dn">{cs.ledger.weaknesses}</b></span>
			</div>
		</div>

		<!-- takeaway -->
		<blockquote class="takeaway" use:reveal>
			<p>{@html cs.takeaway}</p>
			<footer class="mono">{cs.provenance}</footer>
		</blockquote>
	</div>
</section>

<style>
	.case {
		background:
			radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--weak-rgb), 0.04), transparent 65%),
			var(--paper);
		border-top: 1px solid var(--line);
	}

	/* scorecard */
	.scorecard {
		padding: 22px 24px;
	}
	.sc-meta {
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
		font-size: 11.5px;
		color: var(--muted);
		padding-bottom: 16px;
		border-bottom: 1px solid var(--line);
	}
	.sc-meta span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.rdot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--up);
	}
	.sc-body {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: clamp(24px, 5vw, 56px);
		align-items: center;
		padding-top: 18px;
	}
	.sc-flip {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(14px, 2.5vw, 26px);
	}
	.sc-side {
		text-align: center;
	}
	.sc-tag {
		font-size: 9.5px;
		letter-spacing: 0.16em;
		color: var(--faint);
	}
	.sc-score {
		font-family: var(--f-display);
		font-size: clamp(38px, 4.4vw, 52px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--weak-2);
	}
	.sc-score.up {
		color: var(--up-2);
	}
	.sc-score small {
		font-size: 0.34em;
		color: var(--muted);
		font-weight: 400;
	}
	.sc-verdict {
		display: inline-block;
		margin-top: 6px;
		font-family: var(--f-mono);
		font-size: 12px;
		padding: 4px 12px;
		border-radius: 999px;
	}
	.sc-verdict.reject {
		background: var(--weak-bg);
		color: var(--weak-2);
		border: 1px solid var(--weak-line);
	}
	.sc-verdict.accept {
		background: var(--up-bg);
		color: var(--up-2);
		border: 1px solid var(--up-line);
	}
	.sc-arrow {
		display: flex;
		align-items: center;
		color: var(--line-strong);
	}
	.sc-subs {
		border-left: 1px solid var(--line);
		padding-left: clamp(20px, 4vw, 48px);
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.subrow {
		display: grid;
		grid-template-columns: 96px 1fr 40px;
		gap: 12px;
		align-items: center;
	}
	.sk {
		font-size: 12.5px;
		color: var(--ink-soft);
	}
	.sbar {
		position: relative;
		height: 8px;
		background: var(--paper-3);
		border-radius: 99px;
	}
	.sb-before {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: var(--weak-line);
		border-radius: 99px;
	}
	.sb-after {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: var(--up);
		border-radius: 99px;
		opacity: 0.85;
		mix-blend-mode: multiply;
	}
	.sv {
		font-size: 11.5px;
		color: var(--muted);
		text-align: right;
	}
	.sw-counts {
		display: flex;
		gap: 16px;
		font-size: 12px;
		margin-top: 4px;
	}
	.sw-counts .up {
		color: var(--up-2);
	}
	.sw-counts .dn {
		color: var(--weak-2);
	}

	.unchanged {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 14px;
		font-size: 12px;
		color: var(--ink-soft);
		padding: 8px 14px;
		background: repeating-linear-gradient(-45deg, var(--paper-2) 0 8px, var(--card-2) 8px 16px);
		border: 1px solid var(--line-2);
		border-radius: 8px;
	}

	/* tabs */
	.tabs {
		display: flex;
		gap: 6px;
		margin-top: 26px;
		flex-wrap: wrap;
	}
	.tab {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--f-body);
		font-size: 14px;
		font-weight: 500;
		padding: 9px 16px;
		border-radius: 10px 10px 0 0;
		border: 1px solid transparent;
		border-bottom: none;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		transition: all 0.18s;
	}
	.tab:hover {
		color: var(--ink);
		background: var(--paper-2);
	}
	.tab.on {
		background: var(--card);
		color: var(--ink);
		border-color: var(--line);
	}
	.tc {
		font-size: 11px;
		padding: 1px 7px;
		border-radius: 99px;
		background: var(--paper-3);
		color: var(--muted);
	}
	.tab.on .tc {
		background: var(--weak-bg);
		color: var(--weak-2);
	}
	.tabpane {
		border-radius: 0 14px 14px 14px;
		padding: 22px 24px;
		margin-top: -1px;
	}

	/* framing */
	.framing {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.fr-col {
		padding: 14px 16px;
		border-radius: 11px;
		background: var(--card-2);
		border: 1px solid var(--line);
	}
	.fr-tag {
		font-size: 10px;
		letter-spacing: 0.1em;
		display: block;
		margin-bottom: 8px;
	}
	.fr-tag.weak {
		color: var(--weak-2);
	}
	.fr-tag.up {
		color: var(--up-2);
	}
	.fr-col p {
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--ink-soft);
	}
	.fr-note {
		margin-top: 12px;
		font-size: 11.5px;
		color: var(--muted);
		line-height: 1.5;
		padding-left: 12px;
		border-left: 2px solid var(--line-2);
	}

	/* mechanism / strength cards */
	.mechgrid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 18px;
	}
	/* horizontal carousel: strength cards */
	.strip {
		display: flex;
		gap: 16px;
		margin-top: 18px;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		padding-bottom: 12px;
		scrollbar-width: thin;
		scrollbar-color: var(--line-strong) transparent;
		scroll-padding-left: 2px;
	}
	.strip::-webkit-scrollbar {
		height: 7px;
	}
	.strip::-webkit-scrollbar-thumb {
		background: var(--line-2);
		border-radius: 99px;
	}
	.strip::-webkit-scrollbar-thumb:hover {
		background: var(--line-strong);
	}
	.strip .mech {
		flex: 0 0 calc((100% - 16px) / 2);
		scroll-snap-align: start;
	}
	@media (max-width: 620px) {
		.strip .mech {
			flex-basis: 86%;
		}
	}
	.mech {
		padding: 16px 18px;
		border-radius: 12px;
		border: 1px solid var(--line);
		background: var(--card-2);
	}
	.mech-h {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.mech-id {
		font-size: 12px;
		font-weight: 600;
		color: var(--weak-2);
	}
	.mech-eff {
		font-family: var(--f-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 2px 8px;
		border-radius: 5px;
	}
	.e-softened {
		background: var(--soft-bg);
		color: var(--soft);
	}
	.e-eliminated {
		background: var(--flip-bg);
		color: var(--flip);
	}
	.mech h4 {
		margin-top: 8px;
		font-size: 16px;
		font-weight: 560;
		line-height: 1.2;
	}
	.mech > h4:first-child {
		margin-top: 0;
	}
	.mech-strat {
		font-size: 11px;
		color: var(--muted);
		display: block;
		margin-top: 4px;
	}
	.ll-intro {
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--ink-soft);
		margin-bottom: 0;
	}
	.ll-intro b {
		color: var(--ink);
		font-weight: 600;
	}
	.planted {
		margin-top: 11px;
		padding-top: 10px;
		border-top: 1px dashed var(--line-2);
	}
	.planted-h {
		display: block;
		margin-bottom: 5px;
		font-size: 10px;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: var(--blue-2);
	}
	.planted-item {
		font-size: 12px;
		color: var(--ink-soft);
		line-height: 1.45;
		padding: 2px 0;
	}
	.mech-trans {
		margin-top: 12px;
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 11px 12px;
		background: var(--card);
		border-radius: 9px;
		border: 1px solid var(--line);
	}
	.mt-line {
		display: grid;
		grid-template-columns: 46px 1fr;
		gap: 10px;
		align-items: baseline;
	}
	.mt-lab {
		font-size: 9px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.mt-lab.after {
		color: var(--up-2);
	}
	.mt-o {
		font-size: 12.5px;
		color: var(--muted);
		line-height: 1.45;
	}
	.mt-arrow {
		color: var(--line-strong);
		font-family: var(--f-mono);
		font-size: 13px;
		padding-left: 4px;
	}
	.mt-r {
		font-size: 12.5px;
		color: var(--ink);
		line-height: 1.45;
	}
	.mech-gloss {
		margin-top: 10px;
		font-size: 12.5px;
		color: var(--ink-soft);
		line-height: 1.5;
	}

	/* ledger */
	.ledger {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 24px;
		padding: 14px 20px;
		border-radius: 12px;
		border: 1px dashed var(--line-2);
		background: var(--card-2);
		flex-wrap: wrap;
	}
	.led-lab {
		font-size: 10px;
		letter-spacing: 0.16em;
		color: var(--faint);
	}
	.led-lines {
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 12.5px;
	}
	.led-lines b {
		font-weight: 500;
	}
	.led-lines .up {
		color: var(--up-2);
	}
	.led-lines .dn {
		color: var(--weak-2);
	}

	/* takeaway */
	.takeaway {
		margin: 26px 0 0;
		padding: 24px 28px;
		border-radius: 14px;
		background: var(--card);
		border: 1px solid var(--line);
		border-left: 3px solid var(--weak);
		color: var(--ink);
		box-shadow: var(--sh-1);
		position: relative;
	}
	.takeaway p {
		font-family: var(--f-display);
		font-size: clamp(18px, 2.2vw, 23px);
		font-weight: 420;
		line-height: 1.45;
		letter-spacing: -0.01em;
	}
	.takeaway :global(em) {
		font-style: italic;
		color: var(--weak-2);
	}
	.takeaway footer {
		margin-top: 14px;
		font-size: 11.5px;
		color: var(--muted);
		line-height: 1.5;
	}

	@media (max-width: 820px) {
		.framing,
		.mechgrid {
			grid-template-columns: 1fr;
		}
		.sc-body {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		.sc-subs {
			border-left: none;
			padding-left: 0;
			border-top: 1px solid var(--line);
			padding-top: 16px;
		}
	}
</style>
