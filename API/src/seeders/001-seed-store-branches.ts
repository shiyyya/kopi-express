import type { QueryInterface } from 'sequelize';

export async function up({ context }: { context: QueryInterface }) {
  const now = new Date();
  await context.bulkInsert('store_branches', [
    {
      id: '01M34B40SEJKXD58FB337RY1RD',
      name: 'Kopi-Express Poblacion Branch',
      address: 'Poblacion, Pandi, Bulacan',
      phone_number: '+639123456789',
      status: 'open',
      latitude: 14.8648,
      longitude: 120.9578,
      delivery_areas: JSON.stringify([
        'Poblacion',
        'San Roque',
        'Baka-Bakahan',
        'Mapulang Lupa',
        'Bunsuran I',
        'Sto. Niño',
      ]),
      created_at: now,
      updated_at: now,
    },
    {
      id: '01M34B3AZHBT272V4H49CWZZ4E',
      name: 'Kopi-Express Bunsuran II Branch',
      address: 'Bunsuran II, Pandi, Bulacan',
      phone_number: '+639123456789',
      status: 'open',
      latitude: 14.86015,
      longitude: 120.92688,
      delivery_areas: JSON.stringify([
        'Bunsuran II',
        'Bunsuran III',
        'Malibong Bata',
        'Malibong Matanda',
        'Manatal',
        'Masuso',
        'Masagana',
      ]),
      created_at: now,
      updated_at: now,
    },
    {
      id: '01M34B2F2M5GH5EHJA2PARV0TK',
      name: 'Kopi-Express Siling Bata Branch',
      address: 'Siling Bata, Pandi, Bulacan',
      phone_number: '+639123456789',
      status: 'open',
      latitude: 14.8958,
      longitude: 120.9495,
      delivery_areas: JSON.stringify([
        'Cacarong Bata',
        'Bagong Barrio',
        'Bagbaguin',
        'Cacarong Matanda',
        'Cupang',
        'Pinagkuartelan',
        'Real de Cacarong',
        'Siling Bata',
        'Siling Matanda',
      ]),
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down({ context }: { context: QueryInterface }) {
  await context.bulkDelete('store_branches', {});
}