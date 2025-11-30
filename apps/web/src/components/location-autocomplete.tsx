"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { type Location, searchLocations } from "@/actions/locations";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface LocationAutocompleteProps {
	value?: string;
	onChange: (value: string, location?: Location) => void;
	placeholder?: string;
	label?: string;
	className?: string;
	disabled?: boolean;
}

export function LocationAutocomplete({
	value,
	onChange,
	placeholder = "Search location...",
	label,
	className,
	disabled = false,
}: LocationAutocompleteProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [locations, setLocations] = React.useState<Location[]>([]);
	const [loading, setLoading] = React.useState(false);
	const [selectedLocation, setSelectedLocation] =
		React.useState<Location | null>(null);

	// Debounce search query to avoid too many API calls
	const debouncedSearch = useDebounce(searchQuery, 300);

	// Fetch locations when search query changes
	React.useEffect(() => {
		async function fetchLocations() {
			if (!debouncedSearch) {
				setLocations([]);
				return;
			}

			setLoading(true);
			try {
				const result = await searchLocations(debouncedSearch);
				if (result.success && result.data) {
					setLocations(result.data);
				}
			} catch (error) {
				console.error("Failed to search locations:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchLocations();
	}, [debouncedSearch]);

	// Fetch selected location details if value is provided but we don't have the object
	// This would typically be handled by a separate "getLocation" call if needed,
	// but for now we'll rely on the parent passing the location or the search finding it.
	// Ideally, the parent should pass the initial location object if available.

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			{label && <label className="text-sm font-medium">{label}</label>}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
						disabled={disabled}
					>
						{selectedLocation ? (
							<div className="flex flex-col items-start text-left">
								<span className="font-medium">{selectedLocation.name}</span>
								<span className="text-xs text-muted-foreground">
									{selectedLocation.city}, {selectedLocation.governorate}
								</span>
							</div>
						) : value ? (
							// If we have a value but no object, show "Selected" or try to find name
							// In a real app we might want to fetch the location by ID here
							"Location selected"
						) : (
							<span className="text-muted-foreground">{placeholder}</span>
						)}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[300px] p-0" align="start">
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search city, address..."
							value={searchQuery}
							onValueChange={setSearchQuery}
						/>
						<CommandList>
							{loading && (
								<div className="py-6 text-center text-sm text-muted-foreground">
									Searching...
								</div>
							)}
							{!loading && locations.length === 0 && searchQuery && (
								<CommandEmpty>No locations found.</CommandEmpty>
							)}
							{!loading && locations.length === 0 && !searchQuery && (
								<div className="py-6 text-center text-sm text-muted-foreground">
									Type to search locations
								</div>
							)}
							<CommandGroup>
								{locations.map((location) => (
									<CommandItem
										key={location.id}
										value={location.id}
										onSelect={() => {
											setSelectedLocation(location);
											onChange(location.id, location);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === location.id ? "opacity-100" : "opacity-0",
											)}
										/>
										<div className="flex flex-col">
											<span>{location.name}</span>
											<span className="text-xs text-muted-foreground">
												{location.city}, {location.governorate}
											</span>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
