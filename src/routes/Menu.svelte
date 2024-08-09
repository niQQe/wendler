<script lang="ts">
	let {
		weeks,
		selectedWeek = $bindable(),
		showDeleteButton = $bindable(),
		handleShowExerciseForm
	}: {
		weeks: string[];
		selectedWeek: string;
		showDeleteButton: boolean;
		handleShowExerciseForm: () => void;
	} = $props();

	const handleSelectWeek = (week: string) => {
		selectedWeek = week;
		localStorage.setItem('selectedWeek', week);
	};
</script>

<div class="flex">
	<div class="flex w-full items-center justify-between gap-3">
		<div class="flex">
			{#each weeks as week, i}
				<button
					class="bg-w flex h-[44px]
				 items-center justify-center rounded border text-sm bg-white font-normal capitalize {week === selectedWeek
						? 'border-[#18181b] !bg-[#18181b] text-white'
						: 'border border-gray-100'} {i === 0
						? 'rounded-r-none'
						: i === 1
							? 'rounded-none !border-l-0 !border-r-0'
							: 'rounded-l-none'}"
					onclick={() => handleSelectWeek(week)}
				>
					{week}
				</button>
			{/each}
		</div>
		<div class="flex gap-3">
			<button
				class="flex h-[44px] w-[44px] items-center justify-center rounded border bg-white border-gray-100 text-sm capitalize {showDeleteButton
					? 'bg-gray-100 text-white'
					: ''}"
				onclick={() => (showDeleteButton = !showDeleteButton)}
			>
				<span class="material-symbols-outlined m-auto text-[22px] text-gray-700"> settings </span>
			</button>
			<button
				type="submit"
				class="flex h-[44px] w-[44px] items-center justify-center rounded bg-[#18181b] text-sm capitalize"
				onclick={() => handleShowExerciseForm()}
			>
				<span class="material-symbols-outlined m-auto text-[24px] text-white"> Add </span>
			</button>
		</div>
	</div>
</div>
