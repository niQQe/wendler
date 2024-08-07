<script lang="ts">
	import { enhance } from '$app/forms';
	import Exercise from './exercise.svelte';
	import { tick } from 'svelte';
	const { data } = $props();

	type ExerciseInfoType = {
		id?: string;
		name: string;
		max_weight: number;
	};

	type WeekType = 'light' | 'medium' | 'heavy';

	let selectedWeek: WeekType = $state('light');
	let showNewExerciseForm = $state(false);
	let showDeleteButton = $state(false);
	let exerciseForm: ExerciseInfoType = $state({
		name: '',
		max_weight: 0
	});
	let inputElement = $state();

	const weeks: WeekType[] = ['light', 'medium', 'heavy'];

	const weightPercentagesAndReps = $state({
		light: {
			reps: [5, 5, 5],
			percentages: [0.65, 0.7, 0.75]
		},
		medium: {
			reps: [3, 3, 3],
			percentages: [0.75, 0.8, 0.85]
		},
		heavy: {
			reps: [5, 3, 1],
			percentages: [0.85, 0.9, 0.95]
		}
	});

	const handleAddExercise = async (id: any) => {
		const newExercise = { ...exerciseForm, max_weight: +exerciseForm.max_weight, id };
		exercises = [...exercises, newExercise];
		console.log('ADD EXERCISE');
	};

	const handleDeleteExercise = (id: string) => {
		const index = exercises.findIndex((exercise) => exercise.id === id);
		exercises.splice(index, 1);
		if (index !== -1) {
			exercises = [...exercises];
		}
	};

	const handleShowExerciseForm = async () => {
		showNewExerciseForm = true;
		await tick();
		inputElement.focus();
	};

	let exercises: ExerciseInfoType[] = $state([]);

	const currentWeights = $derived(() => {
		return exercises.map((exercise) => {
			return weightPercentagesAndReps[selectedWeek].percentages.map((percentage) =>
				(exercise.max_weight * percentage).toFixed(1)
			);
		});
	});

	
	$effect(() => {
		if (data.exercises) {
			exercises = [...data.exercises];
		}
	});
</script>

{#if data.user}
	<div class="p-3">
		{#if showNewExerciseForm}
			<div class="fixed left-0 top-0 z-[999] flex h-full w-full bg-black bg-opacity-60">
				<div class="m-auto w-[350px] rounded-lg bg-white p-6">
					<div class="flex flex-col gap-3">
						<div class="text-xl font-bold">Add new exercise</div>
						<div class="flex gap-3">
							<form
								action="?/addExercise"
								class="flex flex-col gap-6"
								method="post"
								use:enhance={({ formData }) => {
									formData.set('name', exerciseForm.name);
									formData.set('max_weight', String(exerciseForm.max_weight));
									return ({ result }) => {
										if (result.type === 'success') {
											handleAddExercise(result.data);
											showNewExerciseForm = false;
										} else {
											alert('ERROR!');
										}
									};
								}}
							>
								<div class="flex gap-3">
									<div class="flex flex-1 flex-col gap-1">
										<label for="exerciseName" class="text-sm font-medium">Exercise name</label>
										<input
											id="exerciseName"
											bind:this={inputElement}
											placeholder="Benchpress"
											bind:value={exerciseForm.name}
											type="text"
											class="w-full"
										/>
									</div>
									<div class="flex flex-col gap-1">
										<label for="maxWeight" class="text-sm font-medium">Max(kg)</label>
										<input
											id="maxWeight"
											placeholder="Max weight"
											bind:value={exerciseForm.max_weight}
											type="number"
											step="0.01"
											class="max-w-[60px]"
										/>
									</div>
								</div>
								<div class="flex justify-end gap-3 text-sm">
									<button
										class="rounded border px-6 py-2.5"
										onclick={() => (showNewExerciseForm = false)}>Cancel</button
									>
									<button
										class="rounded bg-[#18181b] px-6 py-2.5 text-sm font-medium text-white"
										type="submit">Add</button
									>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		{/if}
		<div class="flex flex-col gap-3">
			<div class="w-full">
				<div class="flex flex-col gap-5">
					<div class="flex items-center justify-between border-b border-gray-200 pb-3">
						<div class="text-2xl font-bold">Wendler</div>
						{data?.user?.email}
						<a
							href="/auth/logout"
							class="flex h-[44px] w-[44px] items-center justify-center rounded border p-1.5"
							><span class="material-symbols-outlined"> logout </span></a
						>
					</div>
					<div class="flex flex-col">
						<div class="grid grid-cols-1 gap-3">
							<div class="flex">
								<div class="flex w-full items-center justify-between gap-3">
									<div class="flex gap-3">
										{#each weeks as week}
											<button
												class="flex h-[44px]
											 items-center justify-center rounded border text-sm font-normal capitalize {week === selectedWeek
													? 'border-[#18181b] bg-[#18181b] text-white'
													: 'border'}"
												onclick={() => (selectedWeek = week)}
											>
												{week}
											</button>
										{/each}
									</div>
									<div class="flex gap-3">
										<button
											class="flex h-[44px] w-[44px] items-center justify-center rounded border border-gray-200 text-sm capitalize {showDeleteButton
												? 'bg-gray-100 text-white'
												: ''}"
											onclick={() => (showDeleteButton = !showDeleteButton)}
										>
											<span class="material-symbols-outlined m-auto text-[22px] text-gray-700">
												settings
											</span>
										</button>
										<button
											type="submit"
											class="flex h-[44px] w-[44px] items-center justify-center rounded bg-[#18181b] text-sm capitalize"
											onclick={() => handleShowExerciseForm()}
										>
											<span class="material-symbols-outlined m-auto text-[24px] text-white">
												Add
											</span>
										</button>
									</div>
								</div>
							</div>
							{#if data?.exercises?.length === 0}
								<div class="flex h-[200px] items-center justify-center">
									<div class="text-gray-500">No exercises added</div>
								</div>
							{:else}
								<div class="flex flex-col gap-3">
									{#each exercises as exercise, i}
										<Exercise
											{exercise}
											{i}
											{showDeleteButton}
											on:deletedExerciseId={({ detail: { id } }) => handleDeleteExercise(id)}
											on:increment={() => (exercise.max_weight += 2.5)}
											on:decrement={() => (exercise.max_weight -= 2.5)}
											{currentWeights}
											{weightPercentagesAndReps}
											{selectedWeek}
										/>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex h-full items-center justify-center">
		<!-- <div
			class="fixed left-0 top-0 h-full w-full opacity-20"
			style="background-image:url({logo});background-position:50%"
		></div> -->
		<div class="z-[99] flex w-[300px] flex-col gap-3">
			<div></div>
			<div class="text-3xl">Wendler 531</div>

			<a
				href="/auth/login/github"
				class="flex items-center gap-3 rounded bg-[#18181b] px-6 py-3 pl-3 text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-github"
					><path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
					/><path d="M9 18c-4.51 2-5-2-7-2" /></svg
				>
				Sign in with Github
			</a>
		</div>
	</div>
{/if}
