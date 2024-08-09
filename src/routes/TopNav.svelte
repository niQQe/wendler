<script lang="ts">
	const { email }: { email: string } = $props();
</script>

<div class="flex items-center justify-between border-b border-gray-200 pb-3">
	<div class="text-2xl font-bold">Webdler</div>
	{email}
	<a
		href="/auth/logout"
		class="flex h-[44px] bg-white w-[44px] items-center justify-center rounded border-gray-100 border p-1.5"
		><span class="material-symbols-outlined"> logout </span></a
	>
</div>
