"use client";

import {
	ArrowRight,
	Bus,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Clock,
	CreditCard,
	MapPin,
	Shield,
	Smartphone,
	Star,
	TrendingUp,
	Users,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLanguage } from "@/lib/providers/language-provider";

function FAQSection() {
	const { t } = useLanguage();
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-foreground mb-4">
						{t.faq.title}
					</h2>
					<p className="text-xl text-muted-foreground">{t.faq.subtitle}</p>
				</div>
				<div className="space-y-4">
					{t.faq.items.map((item, index) => (
						<div
							key={item.question}
							className="glass-card rounded-xl overflow-hidden"
						>
							<button
								type="button"
								onClick={() => setOpenIndex(openIndex === index ? null : index)}
								className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition"
							>
								<span className="font-semibold text-foreground">
									{item.question}
								</span>
								{openIndex === index ? (
									<ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
								) : (
									<ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
								)}
							</button>
							{openIndex === index && (
								<div className="px-6 pb-4 text-muted-foreground">
									{item.answer}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function LandingPageContent() {
	const { t } = useLanguage();

	const features = [
		{
			icon: Smartphone,
			title: t.features.items.booking.title,
			description: t.features.items.booking.description,
		},
		{
			icon: MapPin,
			title: t.features.items.tracking.title,
			description: t.features.items.tracking.description,
		},
		{
			icon: CreditCard,
			title: t.features.items.payments.title,
			description: t.features.items.payments.description,
		},
		{
			icon: Clock,
			title: t.features.items.schedules.title,
			description: t.features.items.schedules.description,
		},
		{
			icon: Shield,
			title: t.features.items.safety.title,
			description: t.features.items.safety.description,
		},
		{
			icon: Star,
			title: t.features.items.rating.title,
			description: t.features.items.rating.description,
		},
	];

	const routes = [
		{ from: "Tunis", to: "Sousse", price: "15 TND", duration: "2h 30m" },
		{ from: "Sfax", to: "Gabès", price: "12 TND", duration: "2h" },
		{ from: "Bizerte", to: "Tunis", price: "8 TND", duration: "1h 15m" },
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Navigation */}
			<nav className="fixed top-0 w-full glass border-b border-border z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link href="/" className="flex items-center gap-2">
							<Image
								src="/images/logo-icon.png"
								alt="EZGO Logo"
								width={40}
								height={40}
								className="dark:hidden"
							/>
							<Image
								src="/images/logo-icon-w.png"
								alt="EZGO Logo"
								width={40}
								height={40}
								className="hidden dark:block"
							/>
							<Image
								src="/images/logo.png"
								alt="EZGO"
								width={80}
								height={30}
								className="dark:hidden"
							/>
							<Image
								src="/images/logo-w.png"
								alt="EZGO"
								width={80}
								height={30}
								className="hidden dark:block"
							/>
						</Link>
						<div className="hidden md:flex items-center gap-6">
							<a
								href="#features"
								className="text-muted-foreground hover:text-primary transition"
							>
								{t.nav.features}
							</a>
							<a
								href="#routes"
								className="text-muted-foreground hover:text-primary transition"
							>
								{t.nav.routes}
							</a>
							<a
								href="#download"
								className="text-muted-foreground hover:text-primary transition"
							>
								{t.nav.download}
							</a>
							<div className="flex items-center gap-2">
								<ThemeToggle />
								<LanguageToggle />
							</div>
							<Link
								href="http://localhost:3000/auth/login"
								className="gradient-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
							>
								{t.nav.signIn}
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[oklch(0.62_0.22_40/0.1)] to-[oklch(0.58_0.2_20/0.15)]">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
								{t.hero.title}{" "}
								<span className="gradient-text">{t.hero.titleHighlight}</span>
							</h1>
							<p className="text-xl text-muted-foreground mb-8">
								{t.hero.subtitle}
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link
									href="http://localhost:3000/auth/register"
									className="gradient-primary text-primary-foreground px-8 py-4 rounded-lg hover:opacity-90 transition text-center font-semibold text-lg"
								>
									{t.hero.getStarted}
								</Link>
								<a
									href="#features"
									className="border-2 border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary/10 transition text-center font-semibold text-lg"
								>
									{t.hero.learnMore}
								</a>
							</div>
							<div className="mt-8 flex items-center gap-8">
								<div>
									<div className="text-3xl font-bold text-foreground">10K+</div>
									<div className="text-muted-foreground">
										{t.hero.stats.travelers}
									</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-foreground">50+</div>
									<div className="text-muted-foreground">
										{t.hero.stats.routes}
									</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-foreground">4.8★</div>
									<div className="text-muted-foreground">
										{t.hero.stats.rating}
									</div>
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="glass-card rounded-2xl p-8">
								<div className="aspect-video gradient-primary rounded-xl flex items-center justify-center">
									<Bus className="h-32 w-32 text-primary-foreground" />
								</div>
								<div className="mt-6 space-y-4">
									<div className="flex items-center gap-3">
										<div className="bg-[oklch(0.65_0.18_145/0.2)] p-2 rounded-lg">
											<MapPin className="h-5 w-5 text-[oklch(0.65_0.18_145)]" />
										</div>
										<div>
											<div className="font-semibold text-foreground">
												{t.hero.features.tracking.title}
											</div>
											<div className="text-sm text-muted-foreground">
												{t.hero.features.tracking.description}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="bg-primary/20 p-2 rounded-lg">
											<CreditCard className="h-5 w-5 text-primary" />
										</div>
										<div>
											<div className="font-semibold text-foreground">
												{t.hero.features.payments.title}
											</div>
											<div className="text-sm text-muted-foreground">
												{t.hero.features.payments.description}
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
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t.features.title}
						</h2>
						<p className="text-xl text-muted-foreground">
							{t.features.subtitle}
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((feature, index) => (
							<div key={index} className="glass-card p-6 rounded-xl">
								<div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
									<feature.icon className="h-6 w-6 text-primary" />
								</div>
								<h3 className="text-xl font-semibold text-foreground mb-2">
									{feature.title}
								</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Popular Routes */}
			<section
				id="routes-section"
				className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50"
			>
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t.routes.title}
						</h2>
						<p className="text-xl text-muted-foreground">{t.routes.subtitle}</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6">
						{routes.map((route, index) => (
							<div key={index} className="glass-card p-6 rounded-xl">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center gap-2">
										<MapPin className="h-5 w-5 text-primary" />
										<span className="font-semibold text-foreground">
											{route.from}
										</span>
									</div>
									<ArrowRight className="h-5 w-5 text-muted-foreground" />
									<div className="flex items-center gap-2">
										<MapPin className="h-5 w-5 text-destructive" />
										<span className="font-semibold text-foreground">
											{route.to}
										</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<div className="text-sm text-muted-foreground">
											{t.routes.duration}
										</div>
										<div className="font-semibold text-foreground">
											{route.duration}
										</div>
									</div>
									<div className="text-right">
										<div className="text-sm text-muted-foreground">
											{t.routes.from}
										</div>
										<div className="text-2xl font-bold text-primary">
											{route.price}
										</div>
									</div>
								</div>
								<button
									type="button"
									className="w-full mt-4 gradient-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-semibold"
								>
									{t.routes.bookNow}
								</button>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t.howItWorks.title}
						</h2>
						<p className="text-xl text-muted-foreground">
							{t.howItWorks.subtitle}
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-primary-foreground text-2xl font-bold mb-4">
								1
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3">
								{t.howItWorks.steps.step1.title}
							</h3>
							<p className="text-muted-foreground">
								{t.howItWorks.steps.step1.description}
							</p>
						</div>
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-primary-foreground text-2xl font-bold mb-4">
								2
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3">
								{t.howItWorks.steps.step2.title}
							</h3>
							<p className="text-muted-foreground">
								{t.howItWorks.steps.step2.description}
							</p>
						</div>
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-primary-foreground text-2xl font-bold mb-4">
								3
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-3">
								{t.howItWorks.steps.step3.title}
							</h3>
							<p className="text-muted-foreground">
								{t.howItWorks.steps.step3.description}
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t.testimonials.title}
						</h2>
						<p className="text-xl text-muted-foreground">
							{t.testimonials.subtitle}
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-8">
						{t.testimonials.items.map((testimonial, index) => (
							<div key={testimonial.name} className="glass-card p-6 rounded-xl">
								<div className="flex items-center gap-1 mb-4">
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star
											key={i}
											className="h-5 w-5 fill-primary text-primary"
										/>
									))}
								</div>
								<p className="text-foreground mb-6 italic">
									"{testimonial.content}"
								</p>
								<div>
									<div className="font-semibold text-foreground">
										{testimonial.name}
									</div>
									<div className="text-sm text-muted-foreground">
										{testimonial.role}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t.pricing.title}
						</h2>
						<p className="text-xl text-muted-foreground">
							{t.pricing.subtitle}
						</p>
					</div>
					<div className="max-w-2xl mx-auto glass-card p-8 rounded-2xl">
						<div className="text-center mb-8">
							<div className="text-5xl font-bold gradient-text mb-2">
								{t.pricing.perTrip}
							</div>
							<p className="text-muted-foreground">{t.pricing.note}</p>
						</div>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-foreground">
									{t.pricing.features.booking}
								</span>
							</div>
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-foreground">
									{t.pricing.features.tracking}
								</span>
							</div>
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-foreground">
									{t.pricing.features.support}
								</span>
							</div>
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-foreground">
									{t.pricing.features.refund}
								</span>
							</div>
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-foreground">{t.pricing.features.qr}</span>
							</div>
							<div className="flex items-center gap-3">
								<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
								<span className="text-foreground">
									{t.pricing.features.insurance}
								</span>
							</div>
						</div>
						<Link
							href="http://localhost:3000/auth/register"
							className="w-full mt-8 gradient-primary text-primary-foreground px-8 py-4 rounded-lg hover:opacity-90 transition text-center font-semibold text-lg block"
						>
							{t.hero.getStarted}
						</Link>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<FAQSection />

			{/* Partners Section */}
			<section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-foreground mb-4">
							{t.partners.title}
						</h2>
						<p className="text-xl text-muted-foreground">
							{t.partners.subtitle}
						</p>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
						<div className="glass-card p-6 rounded-lg w-full h-24 flex items-center justify-center">
							<Users className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="glass-card p-6 rounded-lg w-full h-24 flex items-center justify-center">
							<TrendingUp className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="glass-card p-6 rounded-lg w-full h-24 flex items-center justify-center">
							<Zap className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="glass-card p-6 rounded-lg w-full h-24 flex items-center justify-center">
							<Shield className="h-12 w-12 text-muted-foreground" />
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section
				id="download"
				className="py-20 px-4 sm:px-6 lg:px-8 gradient-primary"
			>
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl font-bold text-primary-foreground mb-6">
						{t.cta.title}
					</h2>
					<p className="text-xl text-primary-foreground/80 mb-8">
						{t.cta.subtitle}
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="http://localhost:3000/auth/register"
							className="bg-white text-primary px-8 py-4 rounded-lg hover:bg-white/90 transition font-semibold text-lg"
						>
							{t.cta.createAccount}
						</Link>
						<a
							href="#"
							className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition font-semibold text-lg"
						>
							{t.cta.downloadApp}
						</a>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-[oklch(0.1_0_0)] text-[oklch(0.7_0_0)] py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-4 gap-8">
						<div>
							<Link href="/" className="flex items-center gap-2 mb-4">
								<Image
									src="/images/logo-icon-w.png"
									alt="EZGO Logo"
									width={40}
									height={40}
								/>
								<Image
									src="/images/logo-w.png"
									alt="EZGO"
									width={80}
									height={30}
								/>
							</Link>
							<p className="text-[oklch(0.6_0_0)]">{t.footer.tagline}</p>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">
								{t.footer.company.title}
							</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.company.aboutUs}
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.company.careers}
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.company.press}
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">
								{t.footer.support.title}
							</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.support.helpCenter}
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.support.contactUs}
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.support.terms}
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">
								{t.footer.connect.title}
							</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.connect.facebook}
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.connect.twitter}
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-primary transition">
										{t.footer.connect.instagram}
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-[oklch(0.2_0_0)] mt-8 pt-8 text-center text-[oklch(0.5_0_0)]">
						<p>{t.footer.copyright}</p>
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
