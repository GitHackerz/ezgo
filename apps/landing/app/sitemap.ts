export default function sitemap() {
	return [
		{
			url: "https://ezgo.tn",
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1,
		},
		{
			url: "https://ezgo.tn/about",
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.8,
		},
		{
			url: "https://ezgo.tn/routes",
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.9,
		},
		{
			url: "https://ezgo.tn/contact",
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
	];
}
