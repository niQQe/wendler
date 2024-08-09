<script lang="ts">
	import { enhance } from '$app/forms';

	type ExerciseInfoType = {
		name: string;
		max_weight: number;
	};

	let { showNewExerciseForm = $bindable() } = $props();

	let exerciseForm: ExerciseInfoType = $state({
		id: '',
		name: '',
		max_weight: 0
	});
</script>

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
						showNewExerciseForm = false;
					}}
				>
					<div class="flex gap-3">
						<div class="flex flex-1 flex-col gap-1">
							<label for="exerciseName" class="text-sm font-medium">Exercise name</label>
							<input
								id="exerciseName"
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
						<button class="rounded border px-6 py-2.5" onclick={() => (showNewExerciseForm = false)}
							>Cancel</button
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
