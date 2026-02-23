<script lang="ts">
	import type { PageProps } from '../../[protected]/dashboard/$types';

	let { data }: PageProps = $props();
</script>

<p>{data.plans.length} plans available</p>
	<!-- render plans -->

