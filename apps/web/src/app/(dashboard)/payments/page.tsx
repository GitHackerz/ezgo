import { getPayments } from "@/actions/payments";
import { handleServerActionResult } from "@/lib/server-action-handler";
import { PaymentsClient } from "./payments-client";

export default async function PaymentsPage() {
	const paymentsResult = await getPayments();
	const payments = handleServerActionResult(paymentsResult) || [];

	return <PaymentsClient initialPayments={payments} />;
}
