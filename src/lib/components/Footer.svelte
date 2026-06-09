<script lang="ts">
	import meta from '$lib/data/meta.json';
	import { reveal } from '$lib/actions';

	const bibtex = `@article{adversarial_repackaging,
  title = {${meta.title}: ${meta.subtitle}},
  year  = {2026},
  note  = {Under review},
  url   = {${meta.links[0].href}}
}`;

	let copied = $state(false);
	function copy() {
		navigator.clipboard?.writeText(bibtex).then(() => {
			copied = true;
			setTimeout(() => (copied = false), 1800);
		});
	}
</script>

<!-- closing statement -->
<section class="sec closing">
	<div class="wrap">
		<div class="close-inner" use:reveal>
			<span class="kicker">Conclusion</span>
			<h2 class="close-title">
				If presentation alone can flip the verdict, the incentive shifts from
				<em>improving the research</em> to <span class="sig">optimizing the repackaging</span>.
			</h2>
			<p class="close-lead">
				Current AI reviewers fail the necessary condition: with the science held fixed, presentation
				edits alone raise scores across models and templates. The deficiency is structural, and as
				AI review scales, it could distort the incentive structure of peer review itself.
			</p>
		</div>
	</div>
</section>

<footer class="foot">
	<div class="wrap">
		<div class="cite-block" use:reveal>
			<div class="cite-head">
				<h3 class="cite-title">Cite this work</h3>
				<button class="copy mono" onclick={copy}>{copied ? '✓ copied' : 'copy bibtex'}</button>
			</div>
			<pre class="bib mono">{bibtex}</pre>
			<p class="cite-note">
				Reviewer quotes are real campaign outputs, edited only by selection. Target paper anonymized.
				<a href={meta.links[0].href} target="_blank" rel="noopener">Read on arXiv ↗</a>
			</p>
		</div>

		<div class="foot-bottom mono">
			<span>© 2026 · {meta.title}</span>
			<span>Built with SvelteKit · D3</span>
		</div>
	</div>
</footer>

<style>
	.closing {
		border-top: 1px solid var(--line);
		background:
			radial-gradient(ellipse 80% 60% at 50% 100%, rgba(var(--weak-rgb), 0.05), transparent 70%),
			var(--paper);
	}
	.close-inner {
		max-width: 880px;
	}
	.close-title {
		margin-top: 16px;
		font-size: clamp(28px, 4.4vw, 50px);
		font-weight: 460;
		line-height: 1.12;
		letter-spacing: -0.02em;
	}
	.close-title em {
		font-style: italic;
	}
	.close-title .sig {
		color: var(--weak-2);
		font-style: italic;
	}
	.close-lead {
		margin-top: 22px;
		font-size: clamp(16px, 1.7vw, 19px);
		color: var(--ink-soft);
		line-height: 1.6;
		max-width: 70ch;
	}

	.foot {
		background: var(--paper-2);
		border-top: 1px solid var(--line);
		padding-block: 52px 28px;
		position: relative;
		z-index: 2;
	}
	.cite-block {
		width: 100%;
	}
	.cite-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 14px;
	}
	.cite-title {
		font-family: var(--f-display);
		font-size: 23px;
		font-weight: 600;
		color: var(--ink);
	}
	.copy {
		font-size: 12px;
		color: var(--weak-2);
		background: var(--weak-bg);
		border: 1px solid var(--weak-line);
		padding: 6px 13px;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.18s;
	}
	.copy:hover {
		background: rgba(var(--weak-rgb), 0.16);
	}
	.bib {
		margin: 0;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 22px 24px;
		font-size: 14px;
		line-height: 1.7;
		color: var(--ink-soft);
		white-space: pre-wrap;
		word-break: break-word;
		overflow-x: auto;
		box-shadow: var(--sh-1);
	}
	.cite-note {
		margin-top: 16px;
		font-size: 13.5px;
		line-height: 1.6;
		color: var(--muted);
	}
	.cite-note a {
		color: var(--weak-2);
		white-space: nowrap;
		font-weight: 500;
	}
	.cite-note a:hover {
		text-decoration: underline;
	}
	.foot-bottom {
		display: flex;
		justify-content: space-between;
		gap: 14px;
		flex-wrap: wrap;
		margin-top: 40px;
		padding-top: 20px;
		border-top: 1px solid var(--line);
		font-size: 12px;
		color: var(--faint);
	}
</style>
