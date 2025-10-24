# Phase 5 — Frontend Integration & Polish

## Primary objective: Seamless, resilient UX for all flows.

## Tasks

### Replace placeholder data with SWR hooks for /dashboard, /rewards, /transaction, etc. (src/lib/hooks/*)
- [ ] Update dashboard/page.tsx to use useDashboard hook instead of manual fetch
- [ ] Update transaction/page.tsx to use useDashboard hook for transaction data
- [ ] Update depositHistory/page.tsx to use useDashboard hook
- [ ] Update withdrawalHistory/page.tsx to use a new useWithdrawals hook
- [ ] Create useWithdrawals hook in src/lib/hooks/
- [ ] Create useTransactions hook if needed for transaction page
- [ ] Update any other pages using manual fetches to use SWR hooks

### Add loading, empty, and error states to all forms and pages
- [ ] Add loading states to dashboard/page.tsx
- [ ] Add empty states to all history pages
- [ ] Add error states with retry buttons to all pages
- [ ] Add loading states to addFunds/page.tsx
- [ ] Add loading states to investmentPlans/page.tsx
- [ ] Add loading states to withdrawal/page.tsx
- [ ] Add loading states to all forms

### Validate forms client-side with the same Zod schemas or TypeScript types
- [ ] Add Zod validation to addFunds/page.tsx using addFundsSchema
- [ ] Add Zod validation to investmentPlans/page.tsx using investmentSchema
- [ ] Add Zod validation to withdrawal/page.tsx using withdrawalSchema
- [ ] Add Zod validation to signup/page.tsx using signupSchema
- [ ] Add Zod validation to signin/page.tsx using signinSchema

### Implement optimistic UI where safe (e.g., temporary deposit UI) with rollback on failure
- [ ] Implement optimistic updates in addFunds/page.tsx for deposit submission
- [ ] Implement optimistic updates in investmentPlans/page.tsx for investments
- [ ] Implement optimistic updates in withdrawal/page.tsx for withdrawals
- [ ] Add rollback logic on API failure

### Ensure auth state persistence and token expiry handling in AuthContext.tsx
- [ ] Add token expiry check in AuthContext.tsx
- [ ] Add automatic logout on token expiry
- [ ] Add token refresh logic if applicable
- [ ] Update login/signup to handle tokens properly

### Add real-time updates or polling for admin approval-sensitive pages
- [ ] Add polling to dashboard for pending deposits
- [ ] Add polling to transaction history for status updates
- [ ] Add polling to withdrawal history for approval updates
- [ ] Add real-time updates for balance changes

### Accessibility checks and mobile responsive polish
- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Add focus indicators
- [ ] Test mobile responsiveness on all pages
- [ ] Fix any responsive issues

### End-to-end smoke tests for flows: signup -> deposit -> approval -> invest -> profit -> withdraw
- [ ] Write E2E tests for signup flow
- [ ] Write E2E tests for deposit flow
- [ ] Write E2E tests for approval flow
- [ ] Write E2E tests for investment flow
- [ ] Write E2E tests for profit accrual
- [ ] Write E2E tests for withdrawal flow

## Key APIs/Components to Implement/Test

/dashboard, /addFunds, /investmentPlans, /withdrawal, SWR hooks useDashboard, useRewards, AuthContext.tsx.

## Definition of Done

All pages call real APIs and handle states properly.

Full user flows work without manual backend manipulation.

E2E tests pass and UX handles error states cleanly.
