<script lang="ts">
	import { reveal, inView, countUp } from '$lib/actions';

	const STRATS = [
		'Contribution list enhancement',
		'Abstract reframing',
		'Related-work repositioning',
		'Analytical discussion expansion'
	];

	let step = $state(0); // 0 reset · 1-4 strategies · 5 flip · 6 hold
	let started = $state(false);

	$effect(() => {
		if (!started) return;
		const id = setInterval(() => {
			step = (step + 1) % 7;
		}, 900);
		return () => clearInterval(id);
	});

	const checked = $derived(Math.min(step, 4));
	const flipped = $derived(step >= 5);
	const markerPct = $derived((3 + (Math.min(step, 4) / 4) * 3) * 10); // score 3→6 on a 0–10 track
</script>

<section class="band" id="evidence" use:inView={() => (started = true)}>
	<div class="wrap">
		<span class="kicker band-kicker" use:reveal>The result</span>
		<div class="rgrid">
		<!-- left: the result + key numbers -->
		<div class="left">
			<h2 class="claim" use:reveal={{ delay: 40 }}>
				No Hidden Prompts Needed! Gaming AI Review
				<span class="abbr mono">ARGAR</span>
			</h2>
			<p class="lead" use:reveal={{ delay: 80 }}>
				As LLM-generated reviews enter peer review, robustness work has focused on explicit attacks
				like prompt injection. We surface a subtler, policy-relevant risk: modifying only
				presentation-level content (abstract, contribution statements, narrative) with scientific
				content held fixed can systematically overturn AI-review outcomes.
			</p>
			<div class="kstats" use:reveal={{ delay: 120 }}>
				<div class="kstat weak">
					<div class="num" use:countUp={{ to: 75.1, decimals: 1, suffix: '%', duration: 1500 }}>75.1%</div>
					<div class="lab">Attack success rate</div>
					<div class="sub mono">cross-model average · ΔS ≥ +1</div>
				</div>
				<div class="kstat soft">
					<div class="num" use:countUp={{ to: 1.21, decimals: 2, prefix: '+', duration: 1500 }}>+1.21</div>
					<div class="lab">Mean score gain</div>
					<div class="sub mono">out of 10 · science unchanged</div>
				</div>
			</div>
		</div>

		<!-- right: live attack console -->
		<div class="console card" use:reveal={{ delay: 140 }}>
			<div class="con-head">
				<span class="con-title mono"><span class="dot" class:live={started && !flipped}></span>adversarial repackaging</span>
				<span class="con-stat mono" class:done={flipped}>{flipped ? 'accepted' : 'running'}</span>
			</div>

			<div class="track-wrap">
				<div class="track-labs mono"><span>Reject</span><span>Accept</span></div>
				<div class="track">
					<span class="zone-accept"></span>
					<span class="thresh"></span>
					<span class="marker" class:flipped style="left:{markerPct}%"></span>
				</div>
			</div>

			<ul class="strat-log">
				{#each STRATS as s, i}
					<li class:done={i < checked} class:active={i === checked && !flipped}>
						<span class="tick">{i < checked ? '✓' : '▸'}</span>
						<span class="sname mono">{s}</span>
					</li>
				{/each}
			</ul>

			<div class="con-foot">
				<div class="verdict">
					<span class="v-pill reject" class:dim={flipped}>Reject</span>
					<span class="v-arrow" class:show={flipped}>→</span>
					<span class="v-pill accept" class:show={flipped}>Accept</span>
				</div>
				<span class="con-note mono">scientific content unchanged</span>
			</div>
		</div>
		</div>
	</div>
</section>

<style>
	.band {
		padding: clamp(30px, 4vw, 52px) 0 clamp(40px, 6vw, 64px);
		border-bottom: 1px solid var(--line);
	}
	.rgrid {
		display: grid;
		grid-template-columns: 1fr 1.05fr;
		gap: clamp(28px, 5vw, 64px);
		align-items: stretch;
	}

	.band-kicker {
		display: inline-block;
		margin-bottom: 16px;
	}

	/* left */
	.claim {
		margin-top: 0;
		font-size: clamp(25px, 3.1vw, 38px);
		font-weight: 600;
		line-height: 1.1;
		letter-spacing: -0.02em;
	}
	.claim .abbr {
		display: inline-block;
		margin-left: 12px;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.14em;
		padding: 4px 10px;
		border-radius: 7px;
		background: var(--weak-bg);
		color: var(--weak-2);
		vertical-align: middle;
		white-space: nowrap;
	}
	.lead {
		margin-top: 16px;
		font-size: clamp(15px, 1.5vw, 17px);
		color: var(--ink-soft);
		line-height: 1.55;
		max-width: 44ch;
	}
	.kstats {
		display: flex;
		gap: 14px;
		margin-top: 26px;
	}
	.kstat {
		position: relative;
		overflow: hidden;
		flex: 1;
		padding: 16px 18px;
		border-radius: 14px;
		background: var(--card);
		border: 1px solid var(--line);
		box-shadow: var(--sh-1);
	}
	.kstat::before {
		content: '';
		position: absolute;
		top: -38px;
		right: -30px;
		width: 112px;
		height: 112px;
		border-radius: 50%;
		background: radial-gradient(circle, color-mix(in srgb, var(--c) 16%, transparent), transparent 68%);
		pointer-events: none;
	}
	.kstat.weak {
		--c: var(--up);
	}
	.kstat.soft {
		--c: var(--flip);
	}
	.kstat .num {
		font-family: var(--f-display);
		font-size: clamp(23px, 2.6vw, 29px);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--c);
		font-variant-numeric: tabular-nums;
	}
	.kstat .lab {
		margin-top: 10px;
		font-weight: 700;
		font-size: 13.5px;
		color: var(--ink);
	}
	.kstat .sub {
		margin-top: 3px;
		font-size: 11px;
		color: var(--muted);
	}

	/* right console */
	.console {
		padding: 22px 22px 20px;
		display: flex;
		flex-direction: column;
	}
	.con-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 14px;
		border-bottom: 1px solid var(--line);
	}
	.con-title {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		font-size: 14px;
		font-weight: 500;
		color: var(--ink-soft);
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--line-strong);
	}
	.dot.live {
		background: var(--weak);
		animation: pulse 1.2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}
	.con-stat {
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.con-stat.done {
		color: var(--up-2);
	}

	.track-wrap {
		margin: 26px 0 6px;
	}
	.track-labs {
		display: flex;
		justify-content: space-between;
		font-size: 11.5px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-bottom: 10px;
	}
	.track {
		position: relative;
		height: 8px;
		background: var(--paper-3);
		border-radius: 99px;
	}
	.zone-accept {
		position: absolute;
		left: 50%;
		right: 0;
		top: 0;
		bottom: 0;
		background: var(--up-bg);
		border-radius: 0 99px 99px 0;
	}
	.thresh {
		position: absolute;
		left: 50%;
		top: -5px;
		bottom: -5px;
		width: 1px;
		background: var(--line-strong);
		opacity: 0.6;
	}
	.marker {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: #fff;
		border: 2.5px solid var(--weak);
		box-shadow: var(--sh-1);
		transition: left 0.75s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s;
		z-index: 2;
	}
	.marker.flipped {
		border-color: var(--up);
	}

	.strat-log {
		list-style: none;
		padding: 0;
		margin: 20px 0;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		gap: 7px;
	}
	.strat-log li {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 14px;
		color: var(--faint);
		opacity: 0.5;
		transition: opacity 0.35s, color 0.35s;
	}
	.strat-log li.done {
		opacity: 1;
		color: var(--ink-soft);
	}
	.strat-log li.active {
		opacity: 1;
		color: var(--ink-soft);
	}
	.tick {
		width: 15px;
		text-align: center;
		color: var(--up-2);
		font-weight: 700;
	}
	.strat-log li:not(.done) .tick {
		color: var(--faint);
	}
	.sname {
		font-size: 13.5px;
	}

	.con-foot {
		margin-top: 22px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 8px;
	}
	.verdict {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.v-pill {
		font-family: var(--f-mono);
		font-size: 13px;
		font-weight: 600;
		padding: 5px 12px;
		border-radius: 999px;
	}
	.v-pill.reject {
		background: var(--weak-bg);
		color: var(--weak-2);
		transition: opacity 0.4s;
	}
	.v-pill.reject.dim {
		opacity: 0.6;
	}
	.v-arrow {
		color: var(--line-strong);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.v-arrow.show {
		opacity: 1;
	}
	.v-pill.accept {
		background: var(--up-bg);
		color: var(--up-2);
		opacity: 0;
		transform: translateX(-6px);
		transition: opacity 0.4s, transform 0.4s;
	}
	.v-pill.accept.show {
		opacity: 1;
		transform: none;
	}
	.con-note {
		font-size: 12px;
		color: var(--faint);
	}

	@media (max-width: 860px) {
		.rgrid {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}
	@media (max-width: 440px) {
		.kstats {
			flex-direction: column;
		}
	}
</style>
