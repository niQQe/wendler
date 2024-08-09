<script lang="ts">
	import { browser } from '$app/environment';
	import Exercise from './Exercise.svelte';
	import Login from './Login.svelte';
	import NewExerciseModal from './NewExerciseModal.svelte';
	import TopNav from './TopNav.svelte';
	import Menu from './Menu.svelte';
	import { tick } from 'svelte';
	const { data } = $props();

	type ExerciseInfoType = {
		id: string;
		name: string;
		max_weight: number;
	};

	type WeekType = 'light' | 'medium' | 'heavy';

	const currentWeek: WeekType | null = browser
		? (localStorage.getItem('selectedWeek') as WeekType)
		: null;

	let selectedWeek: WeekType = $state(currentWeek ?? 'light');
	let showNewExerciseForm = $state(false);
	let showDeleteButton = $state(false);
	let inputElement: HTMLInputElement | null | undefined = $state();
	const weeks: WeekType[] = ['light', 'medium', 'heavy'];

	const weightPercentagesAndReps = {
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
	};

	const handleShowExerciseForm = async () => {
		showNewExerciseForm = true;
		await tick();
		inputElement?.focus();
	};

	let exercises: ExerciseInfoType[] = $state(data.exercises ? [...data.exercises] : []);

	let debounceId: ReturnType<typeof setTimeout> | null = null;

	const currentWeights = $derived(() => {
		return exercises.map((exercise) => {
			return weightPercentagesAndReps[selectedWeek].percentages.map((percentage) =>
				(exercise.max_weight * percentage).toFixed(1)
			);
		});
	});

	const updateMaxWeightLocally = (value: number, index: number) => {
		exercises[index].max_weight = value;
	};

	const handleUpdateMaxWeight = async (
		id: string,
		maxWeight: number,
		action: 'increment' | 'decrement',
		index: number
	) => {
		const newMaxWeight = action === 'increment' ? (maxWeight += 2.5) : (maxWeight -= 2.5);
		updateMaxWeightLocally(newMaxWeight, index);

		if (debounceId) {
			clearTimeout(debounceId);
		}
		debounceId = setTimeout(async () => {
			const formData = new FormData();
			formData.append('id', id);
			formData.append('max_weight', newMaxWeight.toString());
			const res = await fetch('?/updateMaxWeight', {
				method: 'POST',
				body: formData
			});
		}, 500);
	};

	$effect(() => {
		if (data.exercises) {
			exercises = [...data.exercises];
		}
	});
</script>

{#if data.user}
	<div class="p-3">
		{#if showNewExerciseForm}
			<NewExerciseModal bind:showNewExerciseForm />
		{/if}
		<div class="flex flex-col gap-3">
			<div class="w-full">
				<div class="flex flex-col gap-5">
					<TopNav email={data.user.email} />
					<div class="flex flex-col">
						<div class="grid grid-cols-1 gap-3">
							<Menu {weeks} bind:selectedWeek bind:showDeleteButton {handleShowExerciseForm} />
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
											{handleUpdateMaxWeight}
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
	<Login />
{/if}
