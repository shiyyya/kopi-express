const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

function cleanAddress(address: string) {
    return address
        .replace(/\s+/g, " ")
        .replace(/\s*,\s*/g, ", ")
        .replace(/\.\s+/g, ". ")
        .replace(/,\s*,+/g, ", ")
        .replace(/\s+,/g, ",")
        .trim();
}

function extractArea(address: string) {
    const value = cleanAddress(address);
    const streetMatch = value.match(/\b(?:st|street|rd|road|ave|avenue|blvd|boulevard|dr|drive|ln|lane|ct|court|hwy|highway)\.?\s+(.+)$/i);
    if (streetMatch?.[1]) {
        const area = streetMatch[1]
            .replace(/,\s*(?:pandi|bulacan|philippines)\s*$/i, "")
            .trim();
        if (area) return area;
    }
    const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) {
        const area = parts[parts.length - 1];
        if (area && !/^(pandi|bulacan|philippines)$/i.test(area)) return area;
    }
    return null;
}

async function searchNominatim(query: string) {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "ph");
    const response = await fetch(url, {
        headers: {
            "User-Agent": "KopiCafeSystem/1.0",
            "Accept": "application/json",
        },
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Nominatim returned ${response.status}: ${body}`);
    }
    const results = await response.json();
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
}

function parseLocation(result: any) {
    if (!result) return null;
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    const addressDetails = result.address ?? {};
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    return {
        latitude,
        longitude,
        address: addressDetails,
        barangay:
            addressDetails.barangay ??
            addressDetails.village ??
            addressDetails.suburb ??
            addressDetails.neighbourhood ??
            addressDetails.quarter ??
            null,
        municipality:
            addressDetails.municipality ??
            addressDetails.town ??
            addressDetails.city ??
            null,
        province: addressDetails.province ?? null,
    };
}

export async function geocodeAddress(address: string) {
    const value = cleanAddress(address);
    if (!value) return null;
    const area = extractArea(value);
    const queries = [
        `${value}, Pandi, Bulacan, Philippines`,
        value,
        ...(area
            ? [
                  `${area}, Pandi, Bulacan, Philippines`,
                  `Barangay ${area}, Pandi, Bulacan, Philippines`,
              ]
            : []),
    ];
    const uniqueQueries = [...new Set(queries)];
    for (const query of uniqueQueries) {
        const result = await searchNominatim(query);
        const location = parseLocation(result);
        if (location) return location;
    }
    return null;
}

export async function checkDeliveryEligibility(address: string) {
    const cleanedAddress = cleanAddress(address);
    if (!cleanedAddress) {
        return {
            eligible: false,
            municipality: null,
            province: null,
            barangay: null,
        };
    }
    const location = await geocodeAddress(cleanedAddress);
    const municipality = location?.municipality?.trim().toLowerCase();
    return {
        eligible: municipality === "pandi",
        municipality: location?.municipality ?? null,
        province: location?.province ?? null,
        barangay: location?.barangay ?? null,
    };
}