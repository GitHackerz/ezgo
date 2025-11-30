"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";

type Language = "en" | "fr" | "ar";
type Translations = typeof en;

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: Translations;
	dir: "ltr" | "rtl";
}

const translations = { en, fr, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguageState] = useState<Language>("en");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const stored = localStorage.getItem("language") as Language | null;
		const browserLang = navigator.language.split("-")[0] as Language;
		const initialLang =
			stored || (["en", "fr", "ar"].includes(browserLang) ? browserLang : "en");
		setLanguageState(initialLang);
		document.documentElement.lang = initialLang;
		document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";
	}, []);

	const setLanguage = (lang: Language) => {
		setLanguageState(lang);
		localStorage.setItem("language", lang);
		document.documentElement.lang = lang;
		document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
	};

	if (!mounted) {
		return null;
	}

	return (
		<LanguageContext.Provider
			value={{
				language,
				setLanguage,
				t: translations[language],
				dir: language === "ar" ? "rtl" : "ltr",
			}}
		>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}
