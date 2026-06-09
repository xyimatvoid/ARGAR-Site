<script lang="ts">
	import meta from '$lib/data/meta.json';
	import { reveal } from '$lib/actions';
</script>

<header id="top" class="hero">
	<div class="wrap">
		<h1 class="title" use:reveal style="--d:60ms">
			Adversarial <span class="accent">Repackaging</span> Is Enough
		</h1>

		<p class="tagline" use:reveal style="--d:140ms">{meta.subtitle}</p>

		<div class="meta-row" use:reveal style="--d:200ms">
			{#each meta.links as l}
				<a class="link" href={l.href} target="_blank" rel="noopener">{l.label} ↗</a>
			{/each}
		</div>

		<!-- Abstract hidden for now (too long). Restore by un-commenting:
		<div id="abstract" class="abstract" use:reveal style="--d:120ms">
			<span class="abs-label mono">Abstract</span>
			<p>{meta.abstract}</p>
		</div>
		-->
	</div>
</header>

<style>
	.hero {
		padding-top: clamp(36px, 6vw, 76px);
		padding-bottom: clamp(28px, 4vw, 52px);
		text-align: center;
	}
	.title {
		font-size: clamp(36px, 5.6vw, 68px);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.04;
		max-width: 16ch;
		margin: 16px auto 0;
	}
	.title .accent {
		font-style: italic;
		font-weight: 500;
		color: var(--weak);
	}
	.tagline {
		font-size: clamp(16px, 1.6vw, 19px);
		color: var(--ink-soft);
		max-width: 44ch;
		margin: 16px auto 0;
		line-height: 1.5;
	}
	.meta-row {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 12px;
		margin-top: 18px;
		font-size: 13.5px;
	}
	.link {
		font-family: var(--f-mono);
		font-size: 13px;
		font-weight: 500;
		color: var(--weak);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--weak) 35%, transparent);
		padding-bottom: 1px;
		transition: color 0.2s ease, border-color 0.2s ease;
	}
	.link:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	.abstract {
		max-width: 680px;
		margin: clamp(30px, 4vw, 48px) auto 0;
		text-align: left;
		padding-top: 22px;
		border-top: 1px solid var(--line);
	}
	.abs-label {
		display: block;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 12px;
	}
	.abstract p {
		margin: 0;
		font-size: 15.5px;
		line-height: 1.7;
		color: var(--ink-soft);
	}

	@media (max-width: 600px) {
		.title {
			max-width: none;
		}
	}
</style>
