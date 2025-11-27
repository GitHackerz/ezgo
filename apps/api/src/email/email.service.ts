import { Injectable } from "@nestjs/common";
import type { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class EmailService {
	constructor(private mailerService: MailerService) {}

	async sendBookingConfirmation(to: string, bookingDetails: any) {
		await this.mailerService.sendMail({
			to,
			subject: "Booking Confirmation - EZGO",
			template: "./booking-confirmation",
			context: {
				name: bookingDetails.userName,
				route: bookingDetails.route,
				date: bookingDetails.date,
				seat: bookingDetails.seat,
				qrCode: bookingDetails.qrCode,
			},
		});
	}

	async sendTripReminder(to: string, tripDetails: any) {
		await this.mailerService.sendMail({
			to,
			subject: "Trip Reminder - EZGO",
			template: "./trip-reminder",
			context: {
				name: tripDetails.userName,
				route: tripDetails.route,
				departureTime: tripDetails.departureTime,
				seat: tripDetails.seat,
			},
		});
	}

	async sendPasswordReset(to: string, resetToken: string) {
		await this.mailerService.sendMail({
			to,
			subject: "Password Reset - EZGO",
			template: "./password-reset",
			context: {
				resetLink: `${process.env.WEB_URL}/auth/reset-password?token=${resetToken}`,
			},
		});
	}

	async sendWelcomeEmail(to: string, name: string) {
		await this.mailerService.sendMail({
			to,
			subject: "Welcome to EZGO!",
			template: "./welcome",
			context: {
				name,
			},
		});
	}
}
