import Service from '../models/Service.js';

const defaults = [
  ['Engine diagnostics', 'Identify warning lights, noises, and performance issues.', 1800, 90, 'diagnostics'],
  ['Oil change', 'Oil and filter service using vehicle-appropriate products.', 1400, 60, 'oil'],
  ['Battery replacement', 'Battery health check and on-site replacement.', 2200, 45, 'battery'],
  ['Tyre and puncture', 'Puncture repair and tyre condition inspection.', 650, 40, 'tyre'],
  ['Brake repair', 'Brake pad, rotor, and fluid inspection.', 1600, 90, 'brakes'],
  ['AC service', 'Air-conditioning inspection and performance service.', 1200, 75, 'ac'],
  ['General servicing', 'Routine maintenance and multi-point inspection.', 2800, 150, 'service'],
  ['Roadside assistance', 'Urgent on-road help and vehicle recovery.', 900, 60, 'roadside']
];

export async function seedServices() {
  await Promise.all(defaults.map(([name, description, basePrice, durationMinutes, icon]) =>
    Service.updateOne({ name }, { $setOnInsert: { name, description, basePrice, durationMinutes, icon } }, { upsert: true })
  ));
}