import { request } from "./apiClient";

export interface YearlyBreakdown {
  year: number;
  invested: number;
  balance: number;
}

export interface CompoundApiResponse {
  projected_patrimony: number;
  total_invested: number;
  total_interest: number;
  yearly_breakdown: YearlyBreakdown[];
}

export interface CompoundRequestParams {
  initial: number;
  monthly: number;
  rate_annual: number;
  years: number;
}

export interface MonthlyBreakdown {
  month: number;
  interest: number;
  remaining_balance: number;
}

export interface LoanApiResponse {
  monthly_payment: number;
  total_cost: number;
  total_interest_paid: number;
  monthly_breakdown: MonthlyBreakdown[];
}

export interface LoanRequestParams {
  amount: number;
  rate_annual: number;
  months: number;
}

export interface SelicApiResponse {
  indicator: string;
  selic_annual_rate: number;
  reference_date: string;
  is_fallback: boolean;
}

export async function calculateCompoundInterest(
  params: CompoundRequestParams,
  signal?: AbortSignal
): Promise<CompoundApiResponse> {
  return request<CompoundApiResponse>("/api/calculator/compound-interest", {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });
}

export async function simulateLoan(
  params: LoanRequestParams,
  signal?: AbortSignal
): Promise<LoanApiResponse> {
  return request<LoanApiResponse>("/api/calculator/loan-simulation", {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });
}

export async function getMarketSelicRate(): Promise<SelicApiResponse> {
  return request<SelicApiResponse>("/api/market/selic");
}

