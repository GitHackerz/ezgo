import {
	ArrowRight,
	Bus,
	Clock,
	CreditCard,
	MapPin,
	Shield,
	Smartphone,
	Star,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
	const features = [
		{
			icon: Smartphone,
			title: "Easy Booking",
			description:
				"Book your bus tickets in seconds with our intuitive mobile and web apps.",
		},
		{
			icon: MapPin,
			title: "Real-Time Tracking",
			description:
				"Track your bus location in real-time and never miss your ride.",
		},
		{
			icon: CreditCard,
			title: "Secure Payments",
			description:
				"Pay safely with multiple payment options including cards and mobile wallets.",
		},
		{
			icon: Clock,
			title: "Flexible Schedules",
			description: "Choose from hundreds of daily trips across Tunisia.",
		},
		{
			icon: Shield,
			title: "Safe & Reliable",
			description:
				"Travel with confidence on our verified and well-maintained fleet.",
		},
		{
			icon: Star,
			title: "Rated Service",
			description:
				"Rate your trips and help us maintain the highest quality standards.",
		},
	];

	const routes = [
		{ from: "Tunis", to: "Sousse", price: "15 TND", duration: "2h 30m" },
		{ from: "Sfax", to: "Gabès", price: "12 TND", duration: "2h" },
		{ from: "Bizerte", to: "Tunis", price: "8 TND", duration: "1h 15m" },
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Navigation */}
			<nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center gap-2">
							<Bus className="h-8 w-8 text-blue-600" />
							<span className="text-2xl font-bold text-gray-900">EZGO</span>
						</div>
						<div className="hidden md:flex items-center gap-8">
							<a
								href="#features"
								className="text-gray-700 hover:text-blue-600 transition"
							>
								Features
							</a>
							<a
								href="#routes"
								className="text-gray-700 hover:text-blue-600 transition"
							>
								Routes
							</a>
							<a
								href="#download"
								className="text-gray-700 hover:text-blue-600 transition"
							>
								Download
							</a>
							<Link
								href="http://localhost:3000/auth/login"
								className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
							>
								Sign In
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
								Travel Smart Across{" "}
								<span className="text-blue-600">Tunisia</span>
							</h1>
							<p className="text-xl text-gray-600 mb-8">
								Book bus tickets online, track your bus in real-time, and enjoy
								a seamless travel experience.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link
									href="http://localhost:3000/auth/register"
									className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-center font-semibold text-lg"
								>
									Get Started Free
								</Link>
								<a
									href="#features"
									className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition text-center font-semibold text-lg"
								>
									Learn More
								</a>
							</div>
							<div className="mt-8 flex items-center gap-8">
								<div>
									<div className="text-3xl font-bold text-gray-900">10K+</div>
									<div className="text-gray-600">Happy Travelers</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-gray-900">50+</div>
									<div className="text-gray-600">Routes</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-gray-900">4.8★</div>
									<div className="text-gray-600">Rating</div>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="bg-white rounded-2xl shadow-2xl p-8">
								<div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
									<Bus className="h-32 w-32 text-white" />
								</div>
								<div className="mt-6 space-y-4">
									<div className="flex items-center gap-3">
										<div className="bg-green-100 p-2 rounded-lg">
											<MapPin className="h-5 w-5 text-green-600" />
										</div>
										<div>
											<div className="font-semibold">Real-Time Tracking</div>
											<div className="text-sm text-gray-600">
												Know exactly where your bus is
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="bg-blue-100 p-2 rounded-lg">
											<CreditCard className="h-5 w-5 text-blue-600" />
										</div>
										<div>
											<div className="font-semibold">Secure Payments</div>
											<div className="text-sm text-gray-600">
												Multiple payment options
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Why Choose EZGO?
						</h2>
						<p className="text-xl text-gray-600">
							Everything you need for a perfect journey
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div
								key={index}
								className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition"
							>
								<div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
									<feature.icon className="h-6 w-6 text-blue-600" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Popular Routes */}
			<section id="routes" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Popular Routes
						</h2>
						<p className="text-xl text-gray-600">Book your next trip today</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6">
						{routes.map((route, index) => (
							<div
								key={index}
								className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
							>
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<MapPin className="h-5 w-5 text-blue-600" />
										<span className="font-semibold text-gray-900">
											{route.from}
										</span>
									</div>
									<ArrowRight className="h-5 w-5 text-gray-400" />
									<div className="flex items-center gap-2">
										<MapPin className="h-5 w-5 text-red-600" />
										<span className="font-semibold text-gray-900">
											{route.to}
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<div className="text-sm text-gray-600">Duration</div>
										<div className="font-semibold">{route.duration}</div>
									</div>
									<div className="text-right">
										<div className="text-sm text-gray-600">From</div>
										<div className="text-2xl font-bold text-blue-600">
											{route.price}
										</div>
									</div>
								</div>
								<button className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
									Book Now
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section
				id="download"
				className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700"
			>
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl font-bold text-white mb-6">
						Ready to Start Your Journey?
					</h2>
					<p className="text-xl text-blue-100 mb-8">
						Join thousands of travelers who trust EZGO for their daily commute
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="http://localhost:3000/auth/register"
							className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
						>
							Create Free Account
						</Link>
						<a
							href="#"
							className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition font-semibold text-lg"
						>
							Download App
						</a>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<div className="flex items-center gap-2 mb-4">
								<Bus className="h-8 w-8 text-blue-500" />
								<span className="text-2xl font-bold text-white">EZGO</span>
							</div>
							<p className="text-gray-400">
								Smart bus transportation for modern Tunisia.
							</p>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Company</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="hover:text-white transition">
										About Us
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition">
										Careers
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition">
										Press
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Support</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="hover:text-white transition">
										Help Center
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition">
										Contact Us
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition">
										Terms of Service
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Connect</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="hover:text-white transition">
										Facebook
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition">
										Twitter
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition">
										Instagram
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
						<p>© 2025 EZGO. All rights reserved.</p>
					</div>
				</div>
			</footer>

			{/* Structured Data (JSON-LD) for SEO */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "EZGO",
						description: "Smart bus transportation platform for Tunisia",
						url: "https://ezgo.tn",
						logo: "https://ezgo.tn/logo.png",
						sameAs: [
							"https://facebook.com/ezgo",
							"https://twitter.com/ezgo",
							"https://instagram.com/ezgo",
						],
						contactPoint: {
							"@type": "ContactPoint",
							telephone: "+216-XX-XXX-XXX",
							contactType: "customer service",
							areaServed: "TN",
							availableLanguage: ["en", "fr", "ar"],
						},
					}),
				}}
			/>
		</div>
	);
}
