import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"; // Added SwaggerModule and DocumentBuilder
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule); // Keep this line to define 'app'

	const config = new DocumentBuilder() // Define 'config' for Swagger
		.setTitle("API Documentation")
		.setDescription("The API description")
		.setVersion("1.0")
		.addTag("api")
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/docs", app, document);

	await app.listen(4050);
	console.log("🚀 API running on http://localhost:4050");
	console.log("📚 Swagger docs available at http://localhost:4050/api/docs");
}
bootstrap();
