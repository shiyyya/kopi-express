import type { QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  const now = new Date();
  await context.bulkInsert('store_branches', [
    {
      id: '01M34B40SEJKXD58FB337RY1RD',
      name: 'Kopi-Express Poblacion Branch',
      address: 'Poblacion, Pandi, Bulacan',
      phone_number: '+639123456789',
      status: 'closed',
      latitude: 14.8648,
      longitude: 120.9578,
      delivery_areas: [
        'Poblacion',
      ],
      created_at: now,
      updated_at: now,
    },
    {
      id: '01M34B3AZHBT272V4H49CWZZ4E',
      name: 'Kopi-Express Bunsuran II Branch',
      address: 'Bunsuran II, Pandi, Bulacan',
      phone_number: '+639123456789',
      status: 'closed',
      latitude: 14.86015,
      longitude: 120.92688,
      delivery_areas: [
        'Bunsuran II',
      ],
      created_at: now,
      updated_at: now,
    },
    {
      id: '01M34B2F2M5GH5EHJA2PARV0TK',
      name: 'Kopi-Express Cacarong Bata Branch',
      address: 'Cacarong Bata, Pandi, Bulacan',
      phone_number: '+639123456789',
      status: 'closed',
      latitude: 14.8958,
      longitude: 120.9495,
      delivery_areas: [
        'Cacarong Bata',
      ],
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down({ context }: { context: QueryInterface }) {
  await context.bulkDelete('store_branches', {});
}