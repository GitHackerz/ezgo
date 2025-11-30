import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";

// Load environment variables
dotenv.config({ path: ".env" });

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle("EzGo API")
		.setDescription("Bus booking and management system API")
		.setVersion("1.0")
		.addBearerAuth()
		.addTag("auth", "Authentication endpoints")
		.addTag("users", "User management")
		.addTag("companies", "Company management")
		.addTag("buses", "Bus fleet management")
		.addTag("routes", "Route management")
		.addTag("trips", "Trip scheduling and management")
		.addTag("bookings", "Booking management")
		.addTag("payments", "Payment processing")
		.addTag("ratings", "Rating and review system")
		.addTag("notifications", "Notification system")
		.addTag("analytics", "Analytics and reporting")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, document);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.enableCors({ origin: "*" });

	await app.listen(4050);
	console.log("🚀 API running on http://localhost:4050");
	console.log("📚 Swagger docs available at http://localhost:4050/api/docs");
}
bootstrap();
