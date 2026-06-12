<script lang="ts">
	import testbed from '$lib/data/testbed.json';
	import { reveal } from '$lib/actions';
	const d = testbed.dataset;
	const p = testbed.pipeline;
</script>

<section id="data" class="sec data">
	<div class="wrap">
		<div class="sec-head" use:reveal>
			<span class="kicker">The benchmark</span>
			<h2 class="sec-title">A contamination-free testbed for <em>AI-review robustness</em>.</h2>
			<p class="sec-lead">
				We release the full construction <b>pipeline</b>, not a frozen snapshot: a contamination-free,
				<b>rolling</b> benchmark of unpublished papers that refreshes as models evolve, with source and
				PDF paired to mirror the real review workflow.
			</p>
		</div>

		<div class="grid">
			<!-- dataset characteristics -->
			<div class="col card" use:reveal={{ delay: 60 }}>
				<div class="col-h">
					<span class="ci" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
							><ellipse cx="12" cy="5.5" rx="7.5" ry="3" /><path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" /></svg
						>
					</span>
					<h3>{d.title}</h3>
				</div>
				<div class="facts">
					{#each d.facts as f, i}
						<div class="fact" use:reveal={{ delay: 80 + i * 50 }}>
							<span class="fv">{f.v}</span>
							<span class="fl">{f.l}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- construction pipeline -->
			<div class="col card" use:reveal={{ delay: 120 }}>
				<div class="col-h">
					<span class="ci" aria-hidden="true">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
							><path d="M3 4h18l-7 8.5V20l-4 1v-8.5z" stroke-linejoin="round" /></svg
						>
					</span>
					<h3>{p.title}</h3>
				</div>
				<p class="pipe-intro">{p.intro}</p>
				<div class="stages">
					{#each p.stages as s, i}
						<div class="stage" use:reveal={{ delay: 140 + i * 50 }}>
							<span class="stage-n mono">{i + 1}</span>
							<div class="stage-body">
								<b>{s.n}</b>
								<span>{s.d}</span>
							</div>
								</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="cta-band" use:reveal>
			<div>
				<b>The construction pipeline is released</b>
				<span>Re-run it to rebuild a fresh, contamination-free benchmark as models evolve; the data stays rolling, never a frozen snapshot.</span>
			</div>
			<a class="btn btn-primary" href="https://arxiv.org/abs/2606.13044" target="_blank" rel="noopener">
				Read the paper
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
					><path d="M7 17 L17 7 M9 7 h8 v8" stroke-linecap="round" stroke-linejoin="round" /></svg
				>
			</a>
		</div>
	</div>
</section>

<style>
	.data {
		border-top: 1px solid var(--line);
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		align-items: stretch;
	}
	.col {
		padding: 22px 24px;
		display: flex;
		flex-direction: column;
	}
	.col-h {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--line);
		margin-bottom: 16px;
	}
	.ci {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: var(--card-2);
		border: 1px solid var(--line-2);
		color: var(--weak-2);
	}
	.col-h h3 {
		font-size: 19px;
		font-weight: 560;
	}

	/* dataset characteristics */
	.facts {
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: space-between;
	}
	.fact {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 13px 0;
		border-top: 1px solid var(--line);
	}
	.fact:first-child {
		border-top: none;
		padding-top: 0;
	}
	.fact:last-child {
		padding-bottom: 0;
	}
	.fv {
		font-family: var(--f-display);
		font-size: 16.5px;
		font-weight: 600;
		color: var(--weak-2);
		letter-spacing: -0.01em;
	}
	.fl {
		font-size: 13px;
		color: var(--ink-soft);
		line-height: 1.5;
	}

	/* pipeline */
	.pipe-intro {
		font-size: 13px;
		color: var(--muted);
		line-height: 1.55;
		margin-bottom: 18px;
	}
	.stages {
		display: flex;
		flex-direction: column;
	}
	.stage {
		display: grid;
		grid-template-columns: 26px 1fr;
		gap: 12px;
		align-items: start;
		padding-bottom: 16px;
		position: relative;
	}
	.stage:last-child {
		padding-bottom: 0;
	}
	.stage:not(:last-child)::after {
		content: '';
		position: absolute;
		left: 12.5px;
		top: 28px;
		bottom: 0;
		width: 1px;
		background: var(--line-2);
	}
	.stage-n {
		width: 26px;
		height: 26px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--card-2);
		border: 1px solid var(--line-2);
		font-size: 11px;
		font-weight: 600;
		color: var(--ink-soft);
		z-index: 1;
	}
	.stage-body {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-top: 3px;
	}
	.stage-body b {
		font-size: 13.5px;
		font-weight: 600;
	}
	.stage-body span {
		font-size: 12px;
		color: var(--muted);
		line-height: 1.45;
	}

	.cta-band {
		margin-top: 18px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 18px;
		padding: 18px 24px;
		border-radius: 14px;
		background: var(--card-2);
		border: 1px solid var(--line-2);
		flex-wrap: wrap;
	}
	.cta-band b {
		font-family: var(--f-display);
		font-size: 17px;
		font-weight: 560;
		display: block;
	}
	.cta-band span {
		font-size: 12.5px;
		color: var(--muted);
	}
	@media (max-width: 820px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
