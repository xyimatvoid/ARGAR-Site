<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import StatBand from '$lib/components/StatBand.svelte';
	import Condition from '$lib/components/Condition.svelte';
	import Method from '$lib/components/Method.svelte';
	import MainResults from '$lib/components/MainResults.svelte';
	import Asymmetry from '$lib/components/Asymmetry.svelte';
	import Strategy from '$lib/components/Strategy.svelte';
	import CaseStudy from '$lib/components/CaseStudy.svelte';
	import Dataset from '$lib/components/Dataset.svelte';
	import Transfer from '$lib/components/Transfer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import meta from '$lib/data/meta.json';
</script>

<svelte:head>
	<title>{meta.title}: {meta.subtitle}</title>
	<meta name="description" content={meta.thesis} />
</svelte:head>

<Nav />
<main>
	<Hero />
	<StatBand />
	<Condition />
	<Method />
	<MainResults />
	<div id="findings">
		<Asymmetry />
		<Strategy />
	</div>
	<CaseStudy />
	<Transfer />
	<Dataset />
</main>
<Footer />
