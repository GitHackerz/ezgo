import { join } from "node:path";
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: process.env.SMTP_HOST || "smtp.gmail.com",
				port: parseInt(process.env.SMTP_PORT || "587", 10),
				secure: false,
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			},
			defaults: {
				from: `"EZGO" <${process.env.SMTP_FROM || "noreply@ezgo.tn"}>`,
			},
			template: {
				dir: join(__dirname, "templates"),
				adapter: new HandlebarsAdapter(),
				options: {
					strict: true,
				},
			},
		}),
	],
	exports: [MailerModule],
})
export class EmailModule {}
