// import { CustomerAddress as CustomerAddressModel, StoreBranch as StoreBranchModel } from "../models/index.js";
// import { StoreBranch } from "../models/StoreBranch.js";
// import { ApiError } from "../utils/ApiError.js";

// const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// export async function geocodeAddress(address: string) {
//   const url = new URL(NOMINATIM_URL);

//   url.searchParams.set('q', address);
//   url.searchParams.set('format', 'jsonv2');
//   url.searchParams.set('addressdetails', '1');
//   url.searchParams.set('limit', '1');
//   url.searchParams.set('countrycodes', 'ph');

//   const response = await fetch(url, { headers: { 'User-Agent': 'KopiCafeSystem/1.0', } });
//   if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);

//   const results = await response.json();
//   if (results.length === 0) return null;

//   const result = results[0];

//   return {
//     latitude: Number(result.lat),
//     longitude: Number(result.lon),
//     address: result.address,
//     barangay:
//       result.address?.barangay ??
//       result.address?.village ??
//       result.address?.suburb ??
//       null,
//   };
// }

// function getDistanceSquared(
//   lat1: number,
//   lon1: number,
//   lat2: number,
//   lon2: number,
// ) {
//   const latDiff = lat2 - lat1;
//   const lonDiff = lon2 - lon1;

//   return latDiff * latDiff + lonDiff * lonDiff;
// }

// export async function getBranchesForArea(barangay: string) {
//   const branches = await StoreBranchModel.findAll({ where: { status: 'open', } });

//   return branches.filter(branch => branch.deliveryAreas.some(
//     area => area.toLowerCase() === barangay.toLowerCase(),
//   ));
// }

// export async function getClosestBranch(customerAddressId: string, branches: StoreBranch[]): Promise<{closestBranchId: string}> {
//   const customerAddress = await CustomerAddressModel.findByPk(customerAddressId);
//   if (!customerAddress) throw new ApiError( 404, 'Customer address not found', 'CUSTOMER_ADDRESS_NOT_FOUND', );

//   if (branches.length === 0) throw new ApiError(404, 'Address is outside our delivery area', 'AREA_NOT_WITHIN_REACH');

//   const customerLat = Number(customerAddress.latitude);
//   const customerLon = Number(customerAddress.longitude);

//   let closestBranchId = branches[0]!.id;
//   let closestDistance = getDistanceSquared(
//     customerLat,
//     customerLon,
//     Number(branches[0]!.latitude),
//     Number(branches[0]!.longitude),
//   );

//   for (const branch of branches.slice(1)) {
//     const distance = getDistanceSquared(
//       customerLat,
//       customerLon,
//       Number(branch.latitude),
//       Number(branch.longitude),
//     );

//     if (distance < closestDistance) {
//       closestDistance = distance;
//       closestBranchId = branch.id;
//     }
//   }

//   return { closestBranchId };
// }
import { CustomerAddress as CustomerAddressModel, StoreBranch as StoreBranchModel } from "../models/index.js";
import { StoreBranch } from "../models/StoreBranch.js";
import { ApiError } from "../utils/ApiError.js";

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeAddress(address: string) {
  const url = new URL(NOMINATIM_URL);

  url.searchParams.set('q', address);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'ph');

  const response = await fetch(url, { headers: { 'User-Agent': 'KopiCafeSystem/1.0', } });
  if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);

  const results = await response.json();
  if (results.length === 0) return null;

  const result = results[0];

  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    address: result.address,
    barangay:
      result.address?.barangay ??
      result.address?.village ??
      result.address?.suburb ??
      null,
  };
}

function getDistanceSquared(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const latDiff = lat2 - lat1;
  const lonDiff = lon2 - lon1;

  return latDiff * latDiff + lonDiff * lonDiff;
}

function parseDeliveryAreas(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export async function getBranchesForArea(barangay: string | null) {
  if (!barangay) return [];

  const branches = await StoreBranchModel.findAll({ where: { status: 'open' } });
  const target = barangay.toLowerCase();

  return branches.filter((branch) =>
    parseDeliveryAreas(branch.deliveryAreas).some(
      (area) => String(area).toLowerCase() === target,
    ),
  );
}

export async function getClosestBranch(customerAddressId: string, branches: StoreBranch[]): Promise<{closestBranchId: string}> {
  const customerAddress = await CustomerAddressModel.findByPk(customerAddressId);
  if (!customerAddress) throw new ApiError( 404, 'Customer address not found', 'CUSTOMER_ADDRESS_NOT_FOUND', );

  if (branches.length === 0) throw new ApiError(404, 'Address is outside our delivery area', 'AREA_NOT_WITHIN_REACH');

  const customerLat = Number(customerAddress.latitude);
  const customerLon = Number(customerAddress.longitude);

  let closestBranchId = branches[0]!.id;
  let closestDistance = getDistanceSquared(
    customerLat,
    customerLon,
    Number(branches[0]!.latitude),
    Number(branches[0]!.longitude),
  );

  for (const branch of branches.slice(1)) {
    const distance = getDistanceSquared(
      customerLat,
      customerLon,
      Number(branch.latitude),
      Number(branch.longitude),
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestBranchId = branch.id;
    }
  }

  return { closestBranchId };
}