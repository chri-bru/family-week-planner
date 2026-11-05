import { toDateString } from '#lib/utils.js';
import type { ChoreFrequency } from '../schema/tasks.js';

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_CATCH_UP_STEPS = 1000;

type DateParts = {
	year: number;
	month: number;
	day: number;
};

export function todayDateString(): string {
	return toDateString(new Date());
}

export function parseDateOnly(value: string): DateParts {
	const match = DATE_ONLY_PATTERN.exec(value);

	if (!match) {
		throw new Error(`Invalid date: ${value}`);
	}

	const year = Number(match[1]);
	const month = Number(match[2]) - 1;
	const day = Number(match[3]);
	const date = new Date(Date.UTC(year, month, day));

	if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) {
		throw new Error(`Invalid date: ${value}`);
	}

	return { year, month, day };
}

export function formatDateOnly({ year, month, day }: DateParts): string {
	const paddedMonth = String(month + 1).padStart(2, '0');
	const paddedDay = String(day).padStart(2, '0');
	return `${year}-${paddedMonth}-${paddedDay}`;
}

export function normalizeDateOnly(value: string): string {
	return formatDateOnly(parseDateOnly(value));
}

export function assertTodayOrFuture(value: string): string {
	const normalized = normalizeDateOnly(value);

	if (normalized < todayDateString()) {
		throw new Error('startDate must be today or in the future');
	}

	return normalized;
}

function daysInMonth(year: number, month: number): number {
	return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function addDays(current: DateParts, days: number): string {
	const date = new Date(Date.UTC(current.year, current.month, current.day + days));

	return formatDateOnly({
		year: date.getUTCFullYear(),
		month: date.getUTCMonth(),
		day: date.getUTCDate()
	});
}

function addMonths(anchor: DateParts, current: DateParts, months: number): string {
	const totalMonths = current.year * 12 + current.month + months;
	const year = Math.floor(totalMonths / 12);
	const month = totalMonths % 12;

	return formatDateOnly({
		year,
		month,
		day: Math.min(anchor.day, daysInMonth(year, month))
	});
}

export function advanceOccurrence(
	startDate: string,
	currentDueDate: string,
	frequency: ChoreFrequency
): string {
	const anchor = parseDateOnly(startDate);
	const current = parseDateOnly(currentDueDate);

	switch (frequency) {
		case 'weekly':
			return addDays(current, 7);
		case 'monthly':
			return addMonths(anchor, current, 1);
		case 'quarterly':
			return addMonths(anchor, current, 3);
		case 'half_yearly':
			return addMonths(anchor, current, 6);
		case 'yearly':
			return addMonths(anchor, current, 12);
	}
}

export function nextOccurrence(
	startDate: string,
	currentDueDate: string,
	frequency: ChoreFrequency,
	notBefore = todayDateString()
): string {
	let next = advanceOccurrence(startDate, currentDueDate, frequency);
	let steps = 0;

	while (next <= notBefore) {
		next = advanceOccurrence(startDate, next, frequency);
		steps += 1;

		if (steps > MAX_CATCH_UP_STEPS) {
			throw new Error('Unable to calculate the next chore occurrence');
		}
	}

	return next;
}
