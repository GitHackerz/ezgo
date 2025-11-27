import { createIntl, createIntlCache } from "@formatjs/intl";

const cache = createIntlCache();

export const messages = {
	en: {
		"nav.home": "Home",
		"nav.search": "Search",
		"nav.myTrips": "My Trips",
		"nav.profile": "Profile",
		"home.welcome": "Welcome Back!",
		"home.findTrip": "Find your next trip",
		"home.searchPlaceholder": "Where do you want to go?",
		"home.nearbyBuses": "Nearby Buses",
		"home.viewAll": "View All",
		"booking.confirm": "Confirm & Pay",
		"booking.price": "Price",
		"booking.seat": "Seat",
		"trip.departure": "Departure",
		"trip.arrival": "Arrival",
		"trip.duration": "Duration",
	},
	fr: {
		"nav.home": "Accueil",
		"nav.search": "Rechercher",
		"nav.myTrips": "Mes Voyages",
		"nav.profile": "Profil",
		"home.welcome": "Bienvenue!",
		"home.findTrip": "Trouvez votre prochain voyage",
		"home.searchPlaceholder": "Où voulez-vous aller?",
		"home.nearbyBuses": "Bus à Proximité",
		"home.viewAll": "Voir Tout",
		"booking.confirm": "Confirmer et Payer",
		"booking.price": "Prix",
		"booking.seat": "Siège",
		"trip.departure": "Départ",
		"trip.arrival": "Arrivée",
		"trip.duration": "Durée",
	},
	ar: {
		"nav.home": "الرئيسية",
		"nav.search": "بحث",
		"nav.myTrips": "رحلاتي",
		"nav.profile": "الملف الشخصي",
		"home.welcome": "مرحبا بك!",
		"home.findTrip": "ابحث عن رحلتك القادمة",
		"home.searchPlaceholder": "إلى أين تريد الذهاب؟",
		"home.nearbyBuses": "الحافلات القريبة",
		"home.viewAll": "عرض الكل",
		"booking.confirm": "تأكيد والدفع",
		"booking.price": "السعر",
		"booking.seat": "المقعد",
		"trip.departure": "المغادرة",
		"trip.arrival": "الوصول",
		"trip.duration": "المدة",
	},
};

export function getIntl(locale: string = "en") {
	return createIntl(
		{
			locale,
			messages: messages[locale as keyof typeof messages] || messages.en,
		},
		cache,
	);
}
