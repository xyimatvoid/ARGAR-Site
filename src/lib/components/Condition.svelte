<script lang="ts">
	import { reveal } from '$lib/actions';

	const zones = [
		{
			key: 'free',
			name: 'Free zone',
			sub: 'narrative framing',
			items: 'Abstract · Introduction · Related Work · Discussion · Conclusion',
			perm: 'May be rewritten',
			detail: 'reframed, reorganized, renarrated, but no scientific claim unsupported by the original.',
			lvl: 3,
			lock: 'open'
		},
		{
			key: 'limited',
			name: 'Limited zone',
			sub: 'technical exposition',
			items: 'Method descriptions · Result analysis',
			perm: 'Rephrase only',
			detail: 'may be reworded or reorganized, but factual content must be preserved.',
			lvl: 2,
			lock: 'half'
		},
		{
			key: 'fixed',
			name: 'Fixed zone',
			sub: 'scientific evidence',
			items: 'Data · Tables · Figures · Equations · Proofs · Numbers',
			perm: 'Immutable',
			detail: 'experimental evidence is untouched. This is what the work actually contributes.',
			lvl: 0,
			lock: 'closed'
		}
	];
</script>

<section id="condition" class="sec">
	<div class="wrap grid">
		<!-- statement -->
		<div class="left">
			<div class="sec-head" use:reveal>
				<span class="kicker">The necessary condition</span>
				<h2 class="sec-title">Resistance to <em>presentation-only</em> review gaming.</h2>
				<p class="sec-lead">
					We propose this as a necessary condition for AI review automation: necessary, not sufficient.
				</p>
			</div>

			<blockquote class="statement card" use:reveal={{ delay: 80 }}>
				<span class="q mono">condition</span>
				<p>
					When scientific content is unchanged, AI reviewer scores
					<strong>should not become systematically more favorable</strong> merely because the
					presentation is adjusted.
				</p>
				<footer>
					Clearer writing may be acknowledged, but it must not be
					<span class="hl">exploitable to inflate perceived scientific value.</span>
				</footer>
			</blockquote>

			<p class="aside" use:reveal={{ delay: 140 }}>
				Unlike prompt injection or hidden text (already banned and grounds for desk rejection), these
				edits are <b>legitimate, visible, and within normal writing practice.</b> That makes them far
				harder to guard against.
			</p>
		</div>

		<!-- editing zones -->
		<div class="right" use:reveal={{ delay: 120 }}>
			<div class="zones-head mono">
				<span>EDITING ZONES</span>
				<span class="grad-key">framing → evidence</span>
			</div>
			<div class="stack">
				<div class="spine" aria-hidden="true"></div>
				{#each zones as z}
					<div class="zone z-{z.key}">
						<div class="zhead">
							<div class="zname">
								<span class="badge" aria-hidden="true">
									{#if z.lock === 'open'}
										<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"
											><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 7.5-2" /></svg
										>
									{:else if z.lock === 'half'}
										<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"
											><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0" /></svg
										>
									{:else}
										<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"
											><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg
										>
									{/if}
								</span>
								<div>
									<b>{z.name}</b>
									<i>{z.sub}</i>
								</div>
							</div>
							<span class="perm">{z.perm}</span>
						</div>
						<div class="zitems mono">{z.items}</div>
						<p class="zdetail">{z.detail}</p>
						<div class="meter" aria-hidden="true">
							{#each [0, 1, 2] as s}
								<span class="seg" class:on={s < z.lvl}></span>
							{/each}
							<span class="meter-lab mono">{z.lvl > 0 ? 'editable' : 'locked'}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(28px, 5vw, 60px);
		align-items: stretch;
	}
	.right {
		display: flex;
		flex-direction: column;
	}
	.sec-head {
		margin-bottom: 26px;
	}
	/* statement */
	.statement {
		position: relative;
		padding: 22px 22px 20px;
		margin: 0;
		border-left: 3px solid var(--weak);
		background: linear-gradient(180deg, var(--card), var(--card-2));
	}
	.statement .q {
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--weak-2);
	}
	.statement p {
		margin-top: 10px;
		font-family: var(--f-display);
		font-size: clamp(18px, 2.2vw, 22px);
		font-weight: 420;
		line-height: 1.38;
		letter-spacing: -0.01em;
	}
	.statement strong {
		font-weight: 600;
		color: var(--weak-2);
	}
	.statement footer {
		margin-top: 16px;
		padding-top: 14px;
		border-top: 1px dashed var(--line-2);
		font-size: 15.5px;
		color: var(--ink-soft);
		line-height: 1.55;
	}
	.statement .hl {
		color: var(--weak-2);
		font-weight: 600;
	}
	.aside {
		margin-top: 22px;
		font-size: 14.5px;
		color: var(--ink-soft);
		line-height: 1.6;
	}
	.aside b {
		color: var(--ink);
	}

	/* zones */
	.zones-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 11px;
		letter-spacing: 0.14em;
		color: var(--muted);
		margin-bottom: 14px;
	}
	.grad-key {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 3px 10px;
		border-radius: 999px;
		color: var(--ink-soft);
		background: linear-gradient(90deg, var(--up-bg), var(--soft-bg), var(--weak-bg));
		border: 1px solid var(--line-2);
		font-size: 10px;
	}
	.stack {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-left: 18px;
		flex: 1;
		justify-content: space-between;
	}
	.spine {
		position: absolute;
		left: 4px;
		top: 8px;
		bottom: 8px;
		width: 3px;
		border-radius: 3px;
		background: linear-gradient(180deg, var(--up), var(--soft) 50%, var(--weak));
	}
	.zone {
		position: relative;
		padding: 16px 17px;
		border-radius: 13px;
		border: 1px solid var(--line);
		background: var(--card);
		box-shadow: var(--sh-1);
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.zone:hover {
		transform: translateX(3px);
		box-shadow: var(--sh-2);
	}
	.zone::before {
		content: '';
		position: absolute;
		left: -18px;
		top: 22px;
		width: 14px;
		height: 2px;
		background: var(--line-strong);
	}
	.z-free {
		border-left: 3px solid var(--up);
	}
	.z-limited {
		border-left: 3px solid var(--soft);
	}
	.z-fixed {
		border-left: 3px solid var(--weak);
		background: repeating-linear-gradient(-45deg, var(--card) 0 12px, var(--weak-bg) 12px 13px);
	}
	.zhead {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
	.zname {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.badge {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: var(--card-2);
		border: 1px solid var(--line-2);
	}
	.z-free .badge {
		color: var(--up-2);
		background: var(--up-bg);
		border-color: var(--up-line);
	}
	.z-limited .badge {
		color: var(--soft);
		background: var(--soft-bg);
		border-color: var(--soft-line);
	}
	.z-fixed .badge {
		color: var(--weak-2);
		background: var(--weak-bg);
		border-color: var(--weak-line);
	}
	.zname b {
		font-family: var(--f-display);
		font-size: 17px;
		font-weight: 580;
		display: block;
		line-height: 1.1;
	}
	.zname i {
		font-style: normal;
		font-size: 11.5px;
		color: var(--muted);
		font-family: var(--f-mono);
	}
	.perm {
		font-family: var(--f-mono);
		font-size: 11px;
		font-weight: 500;
		padding: 4px 9px;
		border-radius: 7px;
		white-space: nowrap;
	}
	.z-free .perm {
		color: var(--up-2);
		background: var(--up-bg);
	}
	.z-limited .perm {
		color: var(--soft);
		background: var(--soft-bg);
	}
	.z-fixed .perm {
		color: var(--weak-2);
		background: var(--weak-bg);
	}
	.zitems {
		margin-top: 11px;
		font-size: 11.5px;
		color: var(--ink-soft);
		letter-spacing: 0.01em;
	}
	.zdetail {
		margin-top: 8px;
		font-size: 13px;
		color: var(--muted);
		line-height: 1.5;
	}
	.meter {
		margin-top: 12px;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.seg {
		width: 26px;
		height: 4px;
		border-radius: 99px;
		background: var(--paper-3);
	}
	.z-free .seg.on {
		background: var(--up);
	}
	.z-limited .seg.on {
		background: var(--soft);
	}
	.meter-lab {
		margin-left: 8px;
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
