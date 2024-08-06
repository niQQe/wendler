import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/db/index.js';
import { eq } from 'drizzle-orm';
import { exerciseTable } from '$lib/db/schema.js';

export const load = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		return { user: null };
	}

	const exercises = await db.query.exerciseTable.findMany();

	return { user, exercises };
};

export const actions: Actions = {
	addExercise: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			return null;
		}

		const formData = await request.formData();

		const formObject: Record<string, string | number> = {};

		formData.forEach((value: FormDataEntryValue, key: string) => {
			formObject[key] = value as string;
		});

		const newExercise = {
			userid: user.id,
			max_weight: (formObject.max_weight as number) || 0,
			name: (formObject.name as string) || ''
		};

		try {
			const response = await db
				.insert(exerciseTable)
				.values({ ...newExercise, userid: user.id } as any)
				.returning({ id: exerciseTable.id });

			return response[0].id;
		} catch (error) {
			return {
				success: false
			};
		}
	},
	deleteExercise: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			return null;
		}

		const formData = await request.formData();
		const formObject: Record<string, string | number> = {};

		formData.forEach((value: FormDataEntryValue, key: string) => {
			formObject[key] = value as string;
		});
		try {
			const response = await db
				.delete(exerciseTable)
				.where(eq(exerciseTable.id, String(formObject.id)));

			console.log(response);

			return formObject.id;
		} catch (error) {
			return {
				success: false
			};
		}
	},
	upateMaxWeight: async ({ request, locals }) => {
		const { user } = await locals.safeGetSession();
		if (!user) {
			return null;
		}

		const formData = await request.formData();

		const formObject: Record<string, string | number> = {};

		formData.forEach((value: FormDataEntryValue, key: string) => {
			formObject[key] = value as string;
		});

		const response = await db
			.update(exerciseTable)
			.set({ max_weight: +formObject.max_weight })
			.where(eq(exerciseTable.id, String(formObject.id)));
	}
};
