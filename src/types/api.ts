// src/types/api.ts
export interface AddFundsResponse {
  success: boolean;
  message: string;
  transactionRef?: string;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  withdrawal?: any;
}

export interface ProfitAccrueResponse {
  success: boolean;
  message: string;
}
