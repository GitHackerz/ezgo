"use client";

import {
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Eye,
    MoreHorizontal,
    RefreshCcw,
    RotateCcw,
    Search,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { getPayments, type Payment, refundPayment } from "@/actions/payments";
import { handleActionResult } from "@/lib/action-handler";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface PaymentsClientProps {
	initialPayments: Payment[];
}

export function PaymentsClient({ initialPayments }: PaymentsClientProps) {
	const [payments, setPayments] = useState<Payment[]>(initialPayments);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
	const [showDetailsDialog, setShowDetailsDialog] = useState(false);
	const [showRefundDialog, setShowRefundDialog] = useState(false);
	const [isRefunding, setIsRefunding] = useState(false);
	const { toast } = useToast();

	const handleRefresh = async () => {
		setIsRefreshing(true);
		const result = await getPayments();
		setIsRefreshing(false);

		await handleActionResult(
			result,
			(data) => {
				setPayments(data);
				toast({
					title: "Refreshed",
					description: "Payment list has been updated",
				});
			},
			(error) => {
				toast({
					title: "Error",
					description: error,
					variant: "destructive",
				});
			},
		);
	};

	const handleRefund = async () => {
		if (!selectedPayment) return;

		setIsRefunding(true);
		const result = await refundPayment(selectedPayment.id);
		setIsRefunding(false);
		setShowRefundDialog(false);
		setSelectedPayment(null);

		await handleActionResult(
			result,
			() => {
				toast({
					title: "Refund Initiated",
					description: `Refund for ${selectedPayment.amount} ${selectedPayment.currency} has been initiated`,
				});
				handleRefresh();
			},
			(error) => {
				toast({
					title: "Error",
					description: error,
					variant: "destructive",
				});
			},
		);
	};

	const filteredPayments = payments.filter((payment) => {
		const matchesSearch =
			payment.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
			payment.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
			payment.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
			payment.user?.lastName?.toLowerCase().includes(search.toLowerCase());

		const matchesStatus =
			statusFilter === "all" ||
			payment.status.toLowerCase() === statusFilter.toLowerCase();

		return matchesSearch && matchesStatus;
	});

	const getStatusBadge = (status: string) => {
		switch (status.toLowerCase()) {
			case "completed":
			case "paid":
				return (
					<Badge className="bg-green-100 text-green-700">
						<CheckCircle className="mr-1 h-3 w-3" />
						Completed
					</Badge>
				);
			case "pending":
				return (
					<Badge className="bg-yellow-100 text-yellow-700">
						<Clock className="mr-1 h-3 w-3" />
						Pending
					</Badge>
				);
			case "failed":
				return (
					<Badge className="bg-red-100 text-red-700">
						<XCircle className="mr-1 h-3 w-3" />
						Failed
					</Badge>
				);
			case "refunded":
				return (
					<Badge className="bg-purple-100 text-purple-700">
						<RotateCcw className="mr-1 h-3 w-3" />
						Refunded
					</Badge>
				);
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const totalRevenue = payments
		.filter(
			(p) =>
				p.status.toLowerCase() === "completed" ||
				p.status.toLowerCase() === "paid",
		)
		.reduce((sum, p) => sum + p.amount, 0);

	const pendingAmount = payments
		.filter((p) => p.status.toLowerCase() === "pending")
		.reduce((sum, p) => sum + p.amount, 0);

	const refundedAmount = payments
		.filter((p) => p.status.toLowerCase() === "refunded")
		.reduce((sum, p) => sum + p.amount, 0);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Payments</h1>
					<p className="text-muted-foreground">
						Manage and track all payment transactions
					</p>
				</div>
				<Button
					variant="outline"
					onClick={handleRefresh}
					disabled={isRefreshing}
				>
					<RefreshCcw
						className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
					/>
					Refresh
				</Button>
			</div>

			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{totalRevenue.toFixed(2)} TND
						</div>
						<p className="text-xs text-muted-foreground">
							From completed payments
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending</CardTitle>
						<Clock className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-yellow-600">
							{pendingAmount.toFixed(2)} TND
						</div>
						<p className="text-xs text-muted-foreground">
							Awaiting confirmation
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Refunded</CardTitle>
						<RotateCcw className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-purple-600">
							{refundedAmount.toFixed(2)} TND
						</div>
						<p className="text-xs text-muted-foreground">
							Total refunds issued
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Transactions</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{payments.length}</div>
						<p className="text-xs text-muted-foreground">Total transactions</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Payment Transactions</CardTitle>
					<CardDescription>
						View and manage all payment transactions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
						<div className="relative flex-1">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search by transaction ID, email, or name..."
								className="pl-8"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="failed">Failed</SelectItem>
								<SelectItem value="refunded">Refunded</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Transaction ID</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Route</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Method</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Date</TableHead>
									<TableHead className="w-[50px]"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredPayments.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={8}
											className="text-center py-8 text-muted-foreground"
										>
											No payments found
										</TableCell>
									</TableRow>
								) : (
									filteredPayments.map((payment) => (
										<TableRow key={payment.id}>
											<TableCell className="font-mono text-sm">
												{payment.transactionId || payment.id.slice(0, 8)}
											</TableCell>
											<TableCell>
												{payment.user ? (
													<div>
														<p className="font-medium">
															{payment.user.firstName} {payment.user.lastName}
														</p>
														<p className="text-sm text-muted-foreground">
															{payment.user.email}
														</p>
													</div>
												) : (
													<span className="text-muted-foreground">Unknown</span>
												)}
											</TableCell>
											<TableCell>
												{payment.booking?.trip?.route?.name || "N/A"}
											</TableCell>
											<TableCell className="font-medium">
												{payment.amount.toFixed(2)} {payment.currency}
											</TableCell>
											<TableCell>{payment.paymentMethod || "N/A"}</TableCell>
											<TableCell>{getStatusBadge(payment.status)}</TableCell>
											<TableCell>
												{new Date(payment.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onClick={() => {
																setSelectedPayment(payment);
																setShowDetailsDialog(true);
															}}
														>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														{(payment.status.toLowerCase() === "completed" ||
															payment.status.toLowerCase() === "paid") && (
															<DropdownMenuItem
																onClick={() => {
																	setSelectedPayment(payment);
																	setShowRefundDialog(true);
																}}
																className="text-red-600"
															>
																<RotateCcw className="mr-2 h-4 w-4" />
																Refund
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Details Dialog */}
			<Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Payment Details</DialogTitle>
						<DialogDescription>
							Transaction ID:{" "}
							{selectedPayment?.transactionId || selectedPayment?.id}
						</DialogDescription>
					</DialogHeader>
					{selectedPayment && (
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Amount</p>
									<p className="font-medium">
										{selectedPayment.amount.toFixed(2)}{" "}
										{selectedPayment.currency}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Status</p>
									{getStatusBadge(selectedPayment.status)}
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Payment Method
									</p>
									<p className="font-medium">
										{selectedPayment.paymentMethod || "N/A"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Date</p>
									<p className="font-medium">
										{new Date(selectedPayment.createdAt).toLocaleString()}
									</p>
								</div>
							</div>

							{selectedPayment.user && (
								<div className="border-t pt-4">
									<h4 className="font-medium mb-2">Customer Information</h4>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-muted-foreground">Name</p>
											<p className="font-medium">
												{selectedPayment.user.firstName}{" "}
												{selectedPayment.user.lastName}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Email</p>
											<p className="font-medium">
												{selectedPayment.user.email}
											</p>
										</div>
									</div>
								</div>
							)}

							{selectedPayment.booking && (
								<div className="border-t pt-4">
									<h4 className="font-medium mb-2">Booking Information</h4>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-muted-foreground">Route</p>
											<p className="font-medium">
												{selectedPayment.booking.trip?.route?.name || "N/A"}
											</p>
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Seat</p>
											<p className="font-medium">
												{selectedPayment.booking.seatNumber || "N/A"}
											</p>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Refund Confirmation Dialog */}
			<AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Refund</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to refund{" "}
							<strong>
								{selectedPayment?.amount.toFixed(2)} {selectedPayment?.currency}
							</strong>{" "}
							to {selectedPayment?.user?.firstName}{" "}
							{selectedPayment?.user?.lastName}? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isRefunding}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleRefund}
							disabled={isRefunding}
							className="bg-red-600 hover:bg-red-700"
						>
							{isRefunding ? "Processing..." : "Confirm Refund"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
