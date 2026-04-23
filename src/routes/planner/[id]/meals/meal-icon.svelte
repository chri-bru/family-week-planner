<script lang="ts">
	import type { MealType } from '$lib/server/db/schema/meals';
	import ChefHatIcon from '@lucide/svelte/icons/chef-hat';
	import AppleIcon from '@lucide/svelte/icons/apple';
	import UtensilsIcon from '@lucide/svelte/icons/utensils';
	import CroissantIcon from '@lucide/svelte/icons/croissant';
	import CookingPotIcon from '@lucide/svelte/icons/cooking-pot';

    let { type }: { type: MealType } = $props();

    // mapping MealType to icon component, used in meal cards and meal item list
    const iconMap = new Map<MealType, any>([
        ['breakfast', CroissantIcon],
        ['dinner', UtensilsIcon],
        ['lunch', CookingPotIcon],
        ['special', ChefHatIcon],
        ['snack', AppleIcon]
    ]);
</script>

{#if iconMap.has(type)}
    {@const Icon = iconMap.get(type)}
    <Icon class="size-5" />
{:else}
    <ChefHatIcon class="size-5" />
{/if}

