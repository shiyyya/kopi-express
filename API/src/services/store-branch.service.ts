import { CustomerAddress as CustomerAddressModel, StoreBranch as StoreBranchModel } from "../models/index.js";
import { StoreBranch } from "../models/StoreBranch.js";
import { ApiError } from "../utils/ApiError.js";

function getDistanceSquared(lat1: number, lon1: number, lat2: number, lon2: number) {
    const latDiff = lat2 - lat1;
    const lonDiff = lon2 - lon1;
    return latDiff * latDiff + lonDiff * lonDiff;
}

function normalizeArea(value: unknown) {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/^barangay\s+/i, "");
}

function parseDeliveryAreas(value: unknown): string[] {
    if (Array.isArray(value)) return value as string[];

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
    }

    return [];
}

export async function getStoreBranches() {
    return StoreBranchModel.findAll({
        where: { status: "open" },
        attributes: ["id", "name", "address", "phoneNumber", "status"],
    });
}

export async function getBranchesForArea(barangay: string | null) {
    if (!barangay) return [];

    const branches = await StoreBranchModel.findAll({
        where: { status: "open" },
    });

    const target = normalizeArea(barangay);

    return branches.filter((branch) =>
        parseDeliveryAreas(branch.deliveryAreas).some(
            (area) => normalizeArea(area) === target,
        ),
    );
}

export async function getClosestBranch(
    customerAddressId: string,
    branches: StoreBranch[],
): Promise<{ closestBranchId: string }> {
    const customerAddress = await CustomerAddressModel.findByPk(customerAddressId);

    if (!customerAddress) {
        throw new ApiError(
            404,
            "Customer address not found",
            "CUSTOMER_ADDRESS_NOT_FOUND",
        );
    }

    if (branches.length === 0) {
        throw new ApiError(
            404,
            "Address is outside our delivery area",
            "AREA_NOT_WITHIN_REACH",
        );
    }

    const customerLat = Number(customerAddress.latitude);
    const customerLon = Number(customerAddress.longitude);

    if (!Number.isFinite(customerLat) || !Number.isFinite(customerLon)) {
        throw new ApiError(
            400,
            "Customer address coordinates are invalid",
            "INVALID_ADDRESS_COORDINATES",
        );
    }

    let closestBranchId = branches[0]!.id;

    const firstBranchLat = Number(branches[0]!.latitude);
    const firstBranchLon = Number(branches[0]!.longitude);

    if (!Number.isFinite(firstBranchLat) || !Number.isFinite(firstBranchLon)) {
        throw new ApiError(
            500,
            "Store branch coordinates are invalid",
            "INVALID_BRANCH_COORDINATES",
        );
    }

    let closestDistance = getDistanceSquared(
        customerLat,
        customerLon,
        firstBranchLat,
        firstBranchLon,
    );

    for (const branch of branches.slice(1)) {
        const branchLat = Number(branch.latitude);
        const branchLon = Number(branch.longitude);

        if (!Number.isFinite(branchLat) || !Number.isFinite(branchLon)) {
            continue;
        }

        const distance = getDistanceSquared(
            customerLat,
            customerLon,
            branchLat,
            branchLon,
        );

        if (distance < closestDistance) {
            closestDistance = distance;
            closestBranchId = branch.id;
        }
    }

    return { closestBranchId };
}