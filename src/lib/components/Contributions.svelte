<script lang="ts">
	import contributions from '$lib/data/contributions.json';
	import { reveal } from '$lib/actions';
</script>

<section class="sec contrib">
	<div class="wrap">
		<div class="rule" use:reveal><span>What this paper contributes</span></div>
		<div class="grid">
			{#each contributions as c, idx}
				<a class="item card" href={c.href} use:reveal={{ delay: idx * 80 }}>
					<div class="top">
						<span class="n mono">{c.n}</span>
						<span class="chip tag">{c.tag}</span>
					</div>
					<h3 class="t">{c.title}</h3>
					<p class="b">{c.body}</p>
					<span class="go mono"
						>jump <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
							><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" /></svg
						></span
					>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.contrib {
		padding-block: clamp(54px, 8vw, 96px);
	}
	.grid {
		margin-top: 28px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}
	.item {
		position: relative;
		display: flex;
		flex-direction: column;
		padding: 20px 18px 18px;
		overflow: hidden;
		transition:
			transform 0.22s ease,
			box-shadow 0.22s ease,
			border-color 0.22s ease;
	}
	.item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: var(--weak);
		transform: scaleY(0);
		transform-origin: top;
		transition: transform 0.28s ease;
	}
	.item:hover {
		transform: translateY(-4px);
		box-shadow: var(--sh-2);
		border-color: var(--line-strong);
	}
	.item:hover::before {
		transform: scaleY(1);
	}
	.top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 14px;
	}
	.n {
		font-family: var(--f-display);
		font-size: 30px;
		font-weight: 600;
		color: var(--line-strong);
		line-height: 1;
		transition: color 0.22s;
	}
	.item:hover .n {
		color: var(--weak);
	}
	.tag {
		font-size: 10.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.t {
		font-size: 19px;
		font-weight: 520;
		line-height: 1.16;
		letter-spacing: -0.01em;
	}
	.b {
		margin-top: 11px;
		font-size: 13.5px;
		color: var(--ink-soft);
		line-height: 1.55;
		flex: 1;
	}
	.go {
		margin-top: 16px;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11.5px;
		letter-spacing: 0.06em;
		color: var(--muted);
		text-transform: uppercase;
		transition: gap 0.2s, color 0.2s;
	}
	.item:hover .go {
		gap: 9px;
		color: var(--weak-2);
	}
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 520px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
