import { and, eq, gte, lte, asc } from 'drizzle-orm';
import { db } from '../db';
import { meal, type MealType } from '../schema/meals';
import { toDateString } from '$lib/utils';

function toPgDate(date: Date): string {
	return toDateString(date);
}

export async function createMeal(data: {
	name: string;
	date: Date;
	type: MealType;
	family: number;
	link?: string;
}) {
	const [created] = await db
		.insert(meal)
		.values({
			name: data.name,
			date: toPgDate(data.date),
			type: data.type,
			family: data.family,
			link: data.link
		})
		.returning();
	return created;
}

export async function getMealById(id: number) {
	const [result] = await db.select().from(meal).where(eq(meal.id, id)).limit(1);
	return result || null;
}

export async function getMealsByFamily(familyId: number) {
	return await db.select().from(meal).where(eq(meal.family, familyId));
}

export async function updateMeal(
	id: number,
	data: {
		name?: string;
		date?: Date;
		type?: MealType[number];
		link?: string;
	}
) {
	const updateData: Record<string, unknown> = { ...data };
	if (updateData.date) {
		updateData.date = toPgDate(updateData.date as Date);
	}

	const [updated] = await db.update(meal).set(updateData).where(eq(meal.id, id)).returning();
	return updated;
}

export async function deleteMeal(id: number) {
	await db.delete(meal).where(eq(meal.id, id));
	return { ok: true };
}

function getWeekBounds(date: Date): { start: string; end: string } {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1);

	const start = new Date(d);
	start.setDate(diff);

	const end = new Date(start);
	end.setDate(start.getDate() + 6);

	return { start: toPgDate(start), end: toPgDate(end) };
}

export async function getMealsForWeek(familyId: number, weekStartDate: Date) {
	const { start, end } = getWeekBounds(weekStartDate);

	return await db
		.select()
		.from(meal)
		.where(and(eq(meal.family, familyId), gte(meal.date, start), lte(meal.date, end)))
		.orderBy(asc(meal.date));
}

export async function getMealsForCurrentWeek(familyId: number) {
	return getMealsForWeek(familyId, new Date());
}

export async function getMealsForNextWeek(familyId: number) {
	const today = new Date();
	const nextWeekStart = new Date(today);
	nextWeekStart.setDate(today.getDate() + 7);

	return getMealsForWeek(familyId, nextWeekStart);
}

export async function getMealsForPreviousWeek(familyId: number) {
	const today = new Date();
	const prevWeekStart = new Date(today);
	prevWeekStart.setDate(today.getDate() - 7);

	return getMealsForWeek(familyId, prevWeekStart);
}

export async function getMealsForDateRange(familyId: number, startDate: Date, endDate: Date) {
	return await db
		.select()
		.from(meal)
		.where(
			and(
				eq(meal.family, familyId),
				gte(meal.date, toPgDate(startDate)),
				lte(meal.date, toPgDate(endDate))
			)
		)
		.orderBy(asc(meal.date));
}
