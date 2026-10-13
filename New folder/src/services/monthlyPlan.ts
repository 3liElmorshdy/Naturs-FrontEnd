import api from "./api";

export type MonthlyPlanItem = {
  month: number;
  numToursStart: number;
  tours: string[];
};

type MonthlyPlanResponse = {
  status: "success";
  data: {
    plan: MonthlyPlanItem[];
  };
};

export async function getMonthlyPlan(year: number) {
  const response = await api.get<MonthlyPlanResponse>(
    `/tours/monthly-plan/${year}`,
  );

  return response.data.data.plan;
}