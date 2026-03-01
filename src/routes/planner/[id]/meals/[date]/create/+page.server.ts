export const load = async ({ params }: { params: Record<string, any> }) => {
        const date = params.date as string
		const familyPlanId = params.id as string
	return {
        date,
		familyPlanId
	};
};
