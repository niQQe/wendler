<script lang="ts">
	import { enhance } from '$app/forms';

	type ExerciseInfoType = {
		id: string;
		name: string;
		max_weight: number;
	};

	interface ExerciseProps {
		exercise: ExerciseInfoType;
		showDeleteButton: boolean;
		currentWeights: any;
		handleUpdateMaxWeight: (
			id: string,
			maxWeight: number,
			action: 'increment' | 'decrement',
			index: number
		) => void;
		i: number;
		weightPercentagesAndReps: Record<string, Record<string, any[]>>;
		selectedWeek: string;
	}

	const {
		exercise,
		showDeleteButton,
		currentWeights,
		handleUpdateMaxWeight,
		i: wi,
		weightPercentagesAndReps,
		selectedWeek
	}: ExerciseProps = $props();
</script>

<div
	class="border-gray-100 relative flex gap-3 overflow-hidden rounded-xl border bg-white"
	style="box-shadow:0px 2px 2px #00000008"
>
	<div class="flex w-full flex-col">
		<div class="flex w-full items-center justify-between gap-1 p-4">
			<div class="flex-1 truncate text-[18px] font-bold">
				{exercise.name}
			</div>
			<div class="left-0 flex items-center justify-center gap-3 text-center font-semibold">
				<div class="flex items-center">
					<button
						onclick={() => handleUpdateMaxWeight(exercise.id, exercise.max_weight, 'decrement', wi)}
						class="flex rounded rounded-br-none rounded-tr-none border border-gray-200 bg-gray-100 p-1.5"
					>
						<span class="material-symbols-outlined m-auto text-[22px]"> Remove </span>
					</button>
					<div
						class="flex h-[36px] min-w-[80px] items-center justify-center gap-1 border-b border-t border-gray-200 font-bold"
						style="font-variant-numeric:tabular-nums;line-height:15px;"
					>
						{exercise.max_weight} <span class="mt-[3px] text-xs font-normal text-gray-500">KG</span>
					</div>
					<button
						onclick={() => handleUpdateMaxWeight(exercise.id, exercise.max_weight, 'increment', wi)}
						class=" flex rounded rounded-bl-none rounded-tl-none border border-gray-200 bg-gray-100 p-1.5"
					>
						<span class="material-symbols-outlined m-auto text-[22px]"> Add </span>
					</button>
				</div>
				{#if showDeleteButton}
					<form
						method="post"
						action="?/deleteExercise"
						use:enhance={({ formData }) => {
							formData.set('id', exercise.id);
						}}
					>
						<button type="submit" class="rounded border bg-opacity-10 p-1.5">
							<span class="material-symbols-outlined text-[20px] text-red-600"> delete </span>
						</button>
					</form>
				{/if}
			</div>
		</div>
		<div class="flex divide-x divide-gray-300 border-t py-4 font-medium">
			{#each currentWeights()[wi] as weight, i}
				<div class="flex flex-1 items-center justify-center">
					<div class="flex flex-col items-center gap-1.5">
						<div
							class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#18181b] bg-opacity-10 text-[13px] font-semibold text-[#18181b]"
							style="line-height:15px"
						>
							{weightPercentagesAndReps[selectedWeek].reps[i]}
						</div>
						<div class="flex items-end gap-1 text-2xl" style="font-weight:800;">
							{weight}
							<span class="block pb-[4px] text-sm font-[500] tracking-wider text-gray-500">KG</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
