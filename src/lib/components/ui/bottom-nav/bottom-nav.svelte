<script lang="ts">
	import { page } from '$app/state';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Users from '@lucide/svelte/icons/users';
	import UtensilsCrossed from '@lucide/svelte/icons/utensils-crossed';
	import CheckSquare from '@lucide/svelte/icons/check-square';
	import ShoppingCart from '@lucide/svelte/icons/shopping-cart';
	import Book from '@lucide/svelte/icons/book';
	import { cn } from '#lib/utils.js';

	interface Props {
		class?: string;
		familyId?: string;
	}

	let { class: className, familyId }: Props = $props();

	let lastScrollY = 0;
	let visible = $state(true);

	function handleScroll() {
		const currentScrollY = window.scrollY;

		if (currentScrollY < lastScrollY) {
			visible = true;
		} else if (currentScrollY > lastScrollY && currentScrollY >= 100) {
			visible = false;
		}

		lastScrollY = currentScrollY;
	}

	function isActive(href: string): boolean {
		return page.url.pathname.includes(href);
	}

	interface NavItem {
		href: string;
		label: string;
		icon: typeof LayoutDashboard;
		disabled?: boolean;
	}

	let navItems: NavItem[] = $derived([
		{ href: `/planner/${familyId}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
		{ href: `/planner/${familyId}/meals`, label: 'Meals', icon: UtensilsCrossed },
		{ href: `/planner/${familyId}/tasks`, label: 'Tasks', icon: CheckSquare },
		{ href: `/planner/${familyId}/grocery`, label: 'Grocery', icon: ShoppingCart, disabled: true },
		{ href: `/planner/${familyId}/contacts`, label: 'Contacts', icon: Book, disabled: true },
		{ href: `/planner/${familyId}/family`, label: 'Family', icon: Users }
	]);
</script>

<svelte:window onscroll={handleScroll} />

<nav
	class={cn(
		'fixed right-0 bottom-0 left-0 z-50 flex justify-around border-t bg-background/95 px-2 py-2 backdrop-blur transition-transform duration-300 ease-in-out',
		!visible && 'translate-y-full',
		className
	)}
	style="padding-bottom: env(safe-area-inset-bottom);"
>
	{#each navItems as item (item.href)}
		{@const Icon = item.icon}
		{@const active = isActive(item.href)}
		<a
			href={item.disabled ? '#' : item.href}
			class={cn(
				'flex flex-col items-center gap-1 rounded-md px-3 py-1 text-xs transition-colors',
				active ? 'text-primary' : 'text-muted-foreground',
				item.disabled && 'pointer-events-none opacity-50'
			)}
			aria-current={active ? 'page' : undefined}
		>
			<Icon class={cn('size-5', active && 'fill-current')} />
			<span>{item.label}</span>
		</a>
	{/each}
</nav>
