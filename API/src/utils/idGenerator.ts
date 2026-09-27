import { ulid } from 'ulid';

export function generateID(): string {
  return ulid();
}