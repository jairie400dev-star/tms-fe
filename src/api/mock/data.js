// Seed data used as a fallback when no backend is reachable, so the UI is
// fully demoable out of the box. Mirrors the shape the Laravel API returns.

export const factories = [
  { id: 1, name: 'Meridian Steelworks', location: 'Pittsburgh, USA', email: 'ops@meridiansteel.com', website: 'meridiansteel.com', employees_count: 2 },
  { id: 2, name: 'Nordwerk Automotive', location: 'Stuttgart, Germany', email: 'kontakt@nordwerk.de', website: 'nordwerk.de', employees_count: 3 },
  { id: 3, name: 'Sakura Precision Tools', location: 'Nagoya, Japan', email: 'info@sakuraprecision.jp', website: 'sakuraprecision.jp', employees_count: 2 },
  { id: 4, name: 'Cedar Valley Textiles', location: 'Ahmedabad, India', email: 'hello@cedarvalley.in', website: 'cedarvalley.in', employees_count: 1 },
  { id: 5, name: 'Atlas Glassworks', location: 'Lyon, France', email: 'contact@atlasglass.fr', website: 'atlasglass.fr', employees_count: 2 },
  { id: 6, name: 'Halden Marine Engines', location: 'Bergen, Norway', email: 'post@haldenmarine.no', website: 'haldenmarine.no', employees_count: 1 },
  { id: 7, name: 'Cobalt Battery Systems', location: 'Reno, USA', email: 'team@cobaltbattery.com', website: 'cobaltbattery.com', employees_count: 2 },
  { id: 8, name: 'Pampas Food Packing', location: 'Rosario, Argentina', email: 'ventas@pampasfood.ar', website: 'pampasfood.ar', employees_count: 3 },
]

export const employees = [
  { id: 1, first_name: 'Amara', last_name: 'Mendez', factory_id: 1, factory: 'Meridian Steelworks', email: 'amara.mendez@meridiansteel.com', phone: '+38 281 113 779' },
  { id: 2, first_name: 'Hugo', last_name: 'Haddad', factory_id: 1, factory: 'Meridian Steelworks', email: 'hugo.haddad@meridiansteel.com', phone: '+75 202 226 768' },
  { id: 3, first_name: 'Camille', last_name: 'Lin', factory_id: 2, factory: 'Nordwerk Automotive', email: 'camille.lin@nordwerk.de', phone: '+32 283 339 137' },
  { id: 4, first_name: 'Oscar', last_name: 'Bauer', factory_id: 2, factory: 'Nordwerk Automotive', email: 'oscar.bauer@nordwerk.de', phone: '+69 204 452 516' },
  { id: 5, first_name: 'Nour', last_name: 'Sato', factory_id: 2, factory: 'Nordwerk Automotive', email: 'nour.sato@nordwerk.de', phone: '+26 205 565 891' },
  { id: 6, first_name: 'Yuki', last_name: 'Silva', factory_id: 3, factory: 'Sakura Precision Tools', email: 'yuki.silva@sakuraprecision.jp', phone: '+63 246 276 274' },
  { id: 7, first_name: 'Elena', last_name: 'Aziz', factory_id: 3, factory: 'Sakura Precision Tools', email: 'elena.aziz@sakuraprecision.jp', phone: '+28 207 791 653' },
  { id: 8, first_name: 'Diego', last_name: 'Carter', factory_id: 4, factory: 'Cedar Valley Textiles', email: 'diego.carter@cedarvalley.in', phone: '+57 208 904 332' },
]

export const activity = [
  {
    id: 1,
    action: 'updated',
    model: 'Factory',
    model_id: 7,
    summary: 'Cobalt Battery Systems updated',
    user_id: 1,
    user_email: 'admin@admin.com',
    created_at: '2026-06-04 09:41:22',
    changes: {
      location: { old: 'Carson City, USA', new: 'Reno, USA' },
      email: { old: 'info@cobaltbattery.com', new: 'team@cobaltbattery.com' },
    },
  },
  {
    id: 2,
    action: 'created',
    model: 'Employee',
    model_id: 41,
    summary: 'New employee added to Brightline Electronics',
    user_id: 1,
    user_email: 'admin@admin.com',
    created_at: '2026-06-04 06:58:10',
    changes: null,
  },
  {
    id: 3,
    action: 'created',
    model: 'Factory',
    model_id: 24,
    summary: 'Frontier Tractor Works created',
    user_id: 1,
    user_email: 'admin@admin.com',
    created_at: '2026-06-03 16:12:03',
    changes: null,
  },
]
