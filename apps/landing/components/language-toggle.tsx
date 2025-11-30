"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/providers/language-provider";
import { useState, useRef, useEffect } from "react";

export function LanguageToggle() {
	const { language, setLanguage } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const languages = [
		{ code: "en" as const, name: "English", flag: "🇬🇧" },
		{ code: "fr" as const, name: "Français", flag: "🇫🇷" },
		{ code: "ar" as const, name: "العربية", flag: "🇹🇳" },
	];

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const currentLang = languages.find((l) => l.code === language);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
				aria-label="Select language"
			>
				<Languages className="h-5 w-5 text-foreground" />
				<span className="text-sm font-medium text-foreground">
					{currentLang?.flag}
				</span>
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-lg border border-border z-50">
					{languages.map((lang) => (
						<button
							key={lang.code}
							type="button"
							onClick={() => {
								setLanguage(lang.code);
								setIsOpen(false);
							}}
							className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
								language === lang.code
									? "bg-primary/10 text-primary"
									: "hover:bg-accent text-foreground"
							} first:rounded-t-lg last:rounded-b-lg`}
						>
							<span className="text-xl">{lang.flag}</span>
							<span className="font-medium">{lang.name}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
