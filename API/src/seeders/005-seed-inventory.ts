import { Op, type QueryInterface } from 'sequelize';
import { ulid } from 'ulid';

const ingredientIds = [
    '01M3GYH1QZKXW8T5RJ9F0C2VF1',
    '01M3GYH1QZKXW8T5RJ9F0C2VF2',
    '01M3GYH1QZKXW8T5RJ9F0C2VF3',
    '01M3GYH1QZKXW8T5RJ9F0C2VF4',
    '01M3GYH1QZKXW8T5RJ9F0C2VF5',
    '01M3GYH1QZKXW8T5RJ9F0C2VF6',
    '01M3GYH1QZKXW8T5RJ9F0C2VF7',
    '01M3GYH1QZKXW8T5RJ9F0C2VF8',
    '01M3GYH1QZKXW8T5RJ9F0C2VF9',
    '01M3GYH1QZKXW8T5RJ9F0C2VFA',
];

const branchIds = [
    '01M34B40SEJKXD58FB337RY1RD',
    '01M34B3AZHBT272V4H49CWZZ4E',
    '01M34B2F2M5GH5EHJA2PARV0TK',
];

const quantities = [
    25000,
    15000,
    40000,
    20000,
    10000,
    10000,
    8000,
    15000,
    5000,
    5000,
];

const expirationDates = [
    '2027-01-15',
    '2027-01-15',
    '2026-10-15',
    '2027-02-01',
    '2027-03-01',
    '2027-03-01',
    '2027-03-01',
    '2027-02-15',
    '2027-04-01',
    '2027-04-01',
];

export async function up({ context }: { context: QueryInterface }) {
    const now = new Date();

    const inventoryItems = branchIds.flatMap((branchId) =>
        ingredientIds.map((ingredientId, ingredientIndex) => ({
            id: ulid(),
            store_branch_id: branchId,
            ingredient_id: ingredientId,
            quantity: quantities[ingredientIndex]!,
            purchased_at: now,
            expires_at: new Date(expirationDates[ingredientIndex]!),
        })),
    );

    await context.bulkInsert('inventory_items', inventoryItems);
}

export async function down({ context }: { context: QueryInterface }) {
    await context.bulkDelete('inventory_items', {
        store_branch_id: {
            [Op.in]: branchIds,
        },
    });
}