export type DeclarationStatus = 'Cleared' | 'Under Review' | 'Held' | 'Rejected';

export type DeclarationMovement = 'Import' | 'Export' | 'Transit';

export interface CustomsDeclaration {
  reference: string;
  trader: string;
  port: string;
  movement: DeclarationMovement;
  status: DeclarationStatus;
  valueOmr: number;
  submittedOn: string;
}

/**
 * Static sample rows. Like the rest of this template there is no backend —
 * the point of the fixture is to give sorting, filtering and pagination
 * enough rows to be worth demonstrating.
 */
export const CUSTOMS_DECLARATIONS: CustomsDeclaration[] = [
  { reference: 'DEC-2026-0101', trader: 'Majan Trading LLC', port: 'Sohar Port', movement: 'Import', status: 'Cleared', valueOmr: 48250.5, submittedOn: '2026-09-02' },
  { reference: 'DEC-2026-0102', trader: 'Gulf Steel Industries', port: 'Salalah Port', movement: 'Export', status: 'Under Review', valueOmr: 112900, submittedOn: '2026-09-03' },
  { reference: 'DEC-2026-0103', trader: 'Oman Fisheries Co.', port: 'Duqm Port', movement: 'Export', status: 'Cleared', valueOmr: 23400.75, submittedOn: '2026-09-04' },
  { reference: 'DEC-2026-0104', trader: 'Al Buraimi Logistics', port: 'Al Buraimi', movement: 'Transit', status: 'Held', valueOmr: 9875.25, submittedOn: '2026-09-06' },
  { reference: 'DEC-2026-0105', trader: 'Nizwa Dates Export', port: 'Sohar Port', movement: 'Export', status: 'Cleared', valueOmr: 15600, submittedOn: '2026-09-08' },
  { reference: 'DEC-2026-0106', trader: 'Muscat Electronics', port: 'Muscat Airport', movement: 'Import', status: 'Rejected', valueOmr: 67420.4, submittedOn: '2026-09-09' },
  { reference: 'DEC-2026-0107', trader: 'Dhofar Cattle Feed', port: 'Salalah Port', movement: 'Import', status: 'Cleared', valueOmr: 31200, submittedOn: '2026-09-11' },
  { reference: 'DEC-2026-0108', trader: 'Sultan Marble Works', port: 'Khasab Port', movement: 'Export', status: 'Under Review', valueOmr: 88150.9, submittedOn: '2026-09-12' },
  { reference: 'DEC-2026-0109', trader: 'Barka Cement Supply', port: 'Sohar Port', movement: 'Import', status: 'Cleared', valueOmr: 205600, submittedOn: '2026-09-14' },
  { reference: 'DEC-2026-0110', trader: 'Oman Pharma Depot', port: 'Muscat Airport', movement: 'Import', status: 'Held', valueOmr: 43980.6, submittedOn: '2026-09-15' },
  { reference: 'DEC-2026-0111', trader: 'Ibri Agri Holdings', port: 'Al Buraimi', movement: 'Transit', status: 'Cleared', valueOmr: 12750.3, submittedOn: '2026-09-17' },
  { reference: 'DEC-2026-0112', trader: 'Duqm Petro Services', port: 'Duqm Port', movement: 'Import', status: 'Under Review', valueOmr: 319400, submittedOn: '2026-09-18' },
  { reference: 'DEC-2026-0113', trader: 'Seeb Textile House', port: 'Muscat Airport', movement: 'Import', status: 'Cleared', valueOmr: 27310.8, submittedOn: '2026-09-20' },
  { reference: 'DEC-2026-0114', trader: 'Musandam Seafood', port: 'Khasab Port', movement: 'Export', status: 'Cleared', valueOmr: 18960, submittedOn: '2026-09-21' },
  { reference: 'DEC-2026-0115', trader: 'Rustaq Auto Parts', port: 'Sohar Port', movement: 'Import', status: 'Rejected', valueOmr: 54200.45, submittedOn: '2026-09-23' },
  { reference: 'DEC-2026-0116', trader: 'Salalah Free Zone Co.', port: 'Salalah Port', movement: 'Transit', status: 'Cleared', valueOmr: 143700, submittedOn: '2026-09-24' },
  { reference: 'DEC-2026-0117', trader: 'Wadi Kabir Chemicals', port: 'Muscat Airport', movement: 'Import', status: 'Held', valueOmr: 76540.2, submittedOn: '2026-09-25' },
  { reference: 'DEC-2026-0118', trader: 'Oman Copper Refinery', port: 'Sohar Port', movement: 'Export', status: 'Under Review', valueOmr: 487300, submittedOn: '2026-09-27' },
  { reference: 'DEC-2026-0119', trader: 'Bidbid Poultry Farms', port: 'Al Buraimi', movement: 'Import', status: 'Cleared', valueOmr: 21840.65, submittedOn: '2026-09-28' },
  { reference: 'DEC-2026-0120', trader: 'Thumrait Solar Supply', port: 'Salalah Port', movement: 'Import', status: 'Cleared', valueOmr: 96250, submittedOn: '2026-09-29' },
  { reference: 'DEC-2026-0121', trader: 'Khoula Medical Imports', port: 'Muscat Airport', movement: 'Import', status: 'Under Review', valueOmr: 58990.1, submittedOn: '2026-09-30' },
  { reference: 'DEC-2026-0122', trader: 'Sur Shipyard Services', port: 'Duqm Port', movement: 'Export', status: 'Cleared', valueOmr: 37450.5, submittedOn: '2026-10-01' },
  { reference: 'DEC-2026-0123', trader: 'Samail Plastic Works', port: 'Sohar Port', movement: 'Export', status: 'Held', valueOmr: 29180.9, submittedOn: '2026-10-02' },
  { reference: 'DEC-2026-0124', trader: 'Haima Transport Co.', port: 'Duqm Port', movement: 'Transit', status: 'Cleared', valueOmr: 64720.35, submittedOn: '2026-10-03' },
];
