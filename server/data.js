// Original data. The server works on a copy, so "reset" can restore any item.
// parLevel is the stock level a restock order tops the item up to.
export const seedMaterials = [
  { id: 1, materialNumber: '1023456', description: 'Exam Gloves, Nitrile, Medium, Powder-Free', manufacturer: 'Medline Industries', manufacturerItem: '6MDS600', uom: 'CS', quantity: 10, parLevel: 40, onOrder: 0, risk: 'Severe', status: 'Active' },
  { id: 2, materialNumber: '1045210', description: 'Gauze Sponges, 4x4in, Non-Sterile, 200/Pack', manufacturer: 'Medline Industries', manufacturerItem: 'NON25452', uom: 'CS', quantity: 25, parLevel: 60, onOrder: 0, risk: 'High', status: 'Active' },
  { id: 3, materialNumber: '1078932', description: 'IV Catheter, 20G x 1in, Safety', manufacturer: 'BD Medical', manufacturerItem: '381534', uom: 'BX', quantity: 50, parLevel: 120, onOrder: 0, risk: 'Moderate', status: 'Active' },
  { id: 4, materialNumber: '1091284', description: 'Alcohol Prep Pads, Medium, Sterile', manufacturer: 'BD Medical', manufacturerItem: '326895', uom: 'BX', quantity: 200, parLevel: 400, onOrder: 0, risk: 'Low', status: 'Active' },
  { id: 5, materialNumber: '1108765', description: 'Surgical Face Mask, ASTM Level 3', manufacturer: 'Kimberly-Clark', manufacturerItem: '47107', uom: 'CS', quantity: 300, parLevel: 500, onOrder: 0, risk: 'Severe', status: 'Active' },
  { id: 6, materialNumber: '1124590', description: 'Isolation Gown, Level 2, Yellow, XL', manufacturer: 'Medline Industries', manufacturerItem: 'NONYT200XL', uom: 'CS', quantity: 50, parLevel: 100, onOrder: 0, risk: 'High', status: 'Active' },
  { id: 7, materialNumber: '1136721', description: 'Syringe, 10mL, Luer Lock', manufacturer: 'Covidien', manufacturerItem: '8881510125', uom: 'BX', quantity: 100, parLevel: 250, onOrder: 0, risk: 'Moderate', status: 'Active' },
  { id: 8, materialNumber: '1147832', description: 'Wound Dressing, Foam, 4x4in', manufacturer: '3M Health Care', manufacturerItem: '90444', uom: 'BX', quantity: 10, parLevel: 30, onOrder: 0, risk: 'Low', status: 'Active' },
  { id: 9, materialNumber: '1159043', description: 'Suction Catheter, 14FR', manufacturer: 'Cardinal Health', manufacturerItem: '31614', uom: 'CS', quantity: 50, parLevel: 80, onOrder: 0, risk: 'Severe', status: 'Active' },
  { id: 10, materialNumber: '1162154', description: 'Blood Collection Tube, EDTA, 4mL', manufacturer: 'BD Medical', manufacturerItem: '368861', uom: 'BX', quantity: 100, parLevel: 200, onOrder: 0, risk: 'High', status: 'Active' },
]
