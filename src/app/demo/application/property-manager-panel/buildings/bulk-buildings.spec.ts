import { expect, test } from '@playwright/test';
import readXlsxFile from 'read-excel-file/node';
import writeXlsxFile from 'write-excel-file/node';
import { readFile } from 'node:fs/promises';
import { unzipSync, strFromU8 } from 'fflate';
import { BUILDING_COUNTRIES, BUILDING_HEATING_TYPES, BUILDING_YES_NO } from './building-options';
import { mockAuthenticatedSession, mockUserApis, sampleUser } from '../../professionals/professionals.spec-helpers';

const greekHeaders = ['Όνομα κτιρίου', 'Οδός', 'Αριθμός οδού', 'Δεύτερη οδός', 'Αριθμός δεύτερης οδού', 'Χώρα', 'Νομός', 'Πόλη', 'Περιοχή', 'Τ.Κ.',
  'Όροφοι', 'Αριθμός διαμερισμάτων', 'Συνολικά τ.μ.', 'Τ.μ. κοινόχρηστων χώρων', 'Περιγραφή κτιρίου', 'Υπάρχει πάρκινγκ', 'Αριθμός θέσεων πάρκινγκ',
  'Υπάρχει αποθήκη', 'Αριθμός αποθηκών', 'Υπάρχει υπόγειο', 'Υπάρχει ημιώροφος', 'Υπάρχει δώμα', 'Υπάρχει κεντρική θέρμανση', 'Τύπος θέρμανσης', 'Χωρητικότητα θέρμανσης (λίτρα)'];
const englishHeaders = ['name', 'street1', 'stNumber1', 'street2', 'stNumber2', 'country', 'state', 'city', 'region', 'postalCode',
  'floors', 'apartmentsNum', 'sqMetersTotal', 'sqMetersCommonSpaces', 'buildingDescription', 'parkingExist', 'parkingSpacesNum',
  'storageExist', 'storageNum', 'undergroundFloorExist', 'halfFloorExist', 'overTopFloorExist', 'hasCentralHeating', 'heatingType', 'heatingCapacityLitres'];

test('checks the downloaded sample and reports invalid and corrupt files without writes', async ({ page }) => {
  await mockAuthenticatedSession(page, { ...sampleUser, role: 'PropertyManager' });
  await mockUserApis(page);
  let writes = 0;
  await page.route('**/api/v1/buildings/**', route => {
    if (route.request().method() !== 'GET') writes++;
    return route.fulfill({ json: [] });
  });
  await page.goto('/pm/buildings');
  await page.getByRole('button', { name: 'Μαζική Προσθήκη' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Λήψη προτύπου Excel' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  if (!path) throw new Error('Missing download');
  const archive = unzipSync(await readFile(path));
  const xml = strFromU8(archive['xl/worksheets/sheet1.xml']);
  expect(xml).toContain('<dataValidations count="9">');
  for (const col of ['F', 'G', 'P', 'R', 'T', 'U', 'V', 'W', 'X']) expect(xml).toContain(`sqref="${col}2:${col}1001"`);
  expect(xml).toContain('INDIRECT(&quot;\'Επιλογές\'!$B$1:$B$');
  const input = page.locator('#bulk-file');
  await input.setInputFiles({ name: 'sample.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: await readFile(path) });
  await page.getByRole('button', { name: 'Έλεγχος αρχείου' }).click();
  await expect(page.getByRole('status')).toContainText('επιτυχώς');

  const sheets = await readXlsxFile(path);
  expect(sheets).toHaveLength(2);
  const options = sheets[1].data;
  expect(options.map(row => row[0]).filter(Boolean)).toEqual(BUILDING_COUNTRIES);
  expect(options.map(row => row[2]).filter(Boolean)).toEqual(BUILDING_YES_NO);
  expect(options.map(row => row[3]).filter(Boolean)).toEqual(BUILDING_HEATING_TYPES.map(type => type.label));
  const rows = sheets[0].data;
  const header = rows[0] as string[];
  expect(header).toEqual(greekHeaders);
  const checkRows = async (data: unknown[][]) => {
    const buffer = await writeXlsxFile(data.map(row => row.map(value => ({ value: value as string | number | boolean | null })))).toBuffer();
    await input.setInputFiles({ name: 'test.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer });
    await page.getByRole('button', { name: 'Έλεγχος αρχείου' }).click();
  };
  await checkRows([englishHeaders, rows[1]]);
  await expect(page.getByRole('status')).toContainText('επιτυχώς');
  const localized = [...rows[1]];
  localized[header.indexOf('Υπάρχει κεντρική θέρμανση')] = 'Ναι';
  localized[header.indexOf('Τύπος θέρμανσης')] = 'Πετρέλαιο';
  await checkRows([greekHeaders, localized]);
  await expect(page.getByRole('status')).toContainText('επιτυχώς');
  localized[header.indexOf('Υπάρχει κεντρική θέρμανση')] = 'Όχι';
  await checkRows([greekHeaders, localized]);
  await expect(page.getByRole('alert')).toContainText('χωρίς κεντρική θέρμανση');
  await checkRows([[...greekHeaders, 'postalCode'], rows[1]]);
  await expect(page.getByRole('alert')).toContainText('Διπλές στήλες: Τ.Κ.');
  await checkRows([greekHeaders.map(h => h === 'Τ.Κ.' ? 'Άγνωστο' : h), rows[1]]);
  await expect(page.getByRole('alert')).toContainText('Λείπουν στήλες: Τ.Κ.');
  await expect(page.getByRole('alert')).toContainText('Άγνωστες στήλες: Άγνωστο');
  rows[1][header.indexOf('Τ.Κ.')] = '123';
  rows[1][header.indexOf('Υπάρχει πάρκινγκ')] = 'Ναι';
  await checkRows(rows);
  await expect(page.getByRole('alert')).toContainText('Γραμμή 2, Τ.Κ.');
  await expect(page.getByRole('alert')).toContainText('Αριθμός θέσεων πάρκινγκ');
  await input.setInputFiles({ name: 'broken.xlsx', mimeType: 'application/octet-stream', buffer: Buffer.from('broken') });
  await page.getByRole('button', { name: 'Έλεγχος αρχείου' }).click();
  await expect(page.getByRole('alert')).toContainText('κατεστραμμένο');
  expect(writes).toBe(0);
});

test('uploads validated rows, maps server errors to Excel rows and refreshes after success', async ({ page }) => {
  await mockAuthenticatedSession(page, { ...sampleUser, role: 'PropertyManager' });
  await mockUserApis(page);
  let gets = 0;
  let posts = 0;
  let payload: any[] = [];
  await page.route('**/api/v1/buildings/**', async route => {
    if (route.request().method() === 'GET') { gets++; await route.fulfill({ json: [] }); return; }
    posts++;
    payload = route.request().postDataJSON();
    if (posts === 1) await route.fulfill({ status: 400, json: { errors: [{ row: 2, field: 'floors', message: 'Invalid' }] } });
    else await route.fulfill({ json: [11, 12] });
  });
  await page.goto('/pm/buildings');
  await page.getByRole('button', { name: 'Μαζική Προσθήκη' }).click();
  const upload = page.getByRole('button', { name: 'Ανέβασμα', exact: true });
  await expect(upload).toBeDisabled();
  const row = ['First', 'Street', '1', '', '', 'Ελλάδα', 'Νομός Αττικής', 'Αθήνα', 'Κέντρο', '12345', 2, 3, 100, 10, '', 'Ναι', 2, 'Ναι', 1, 'Ναι', 'Όχι', 'Ναι', 'Ναι', 'Πετρέλαιο', 20];
  const second = [...row]; second[0] = 'Second'; second[2] = '2';
  const buffer = await writeXlsxFile([englishHeaders, row, [], second].map(r => r.map(value => ({ value: value as string | number | boolean | null })))).toBuffer();
  await page.locator('#bulk-file').setInputFiles({ name: 'test.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer });
  await page.getByRole('button', { name: 'Έλεγχος αρχείου' }).click();
  await expect(upload).toBeEnabled();
  await upload.click();
  await expect(page.getByRole('alert')).toContainText('Γραμμή 4, Όροφοι: Invalid');
  await expect(upload).toBeDisabled();
  expect(payload).toHaveLength(2);
  expect(payload[0]).toMatchObject({ active: true, enable: true, floors: 2, sqMetersTotal: 100, parkingExist: true, parkingSpacesNum: 2, storageExist: true, storageNum: 1, undergroundFloorExist: true, halfFloorExist: false, overTopFloorExist: true, hasCentralHeating: true, heatingType: 'OIL', heatingCapacityLitres: 20 });
  expect(payload[0]).not.toHaveProperty('id');
  expect(payload[0]).not.toHaveProperty('managerId');
  await page.getByRole('button', { name: 'Έλεγχος αρχείου' }).click();
  await upload.click();
  await expect(page.getByRole('status')).toContainText('2 κτίρια');
  await expect(upload).toBeDisabled();
  const before = gets;
  await page.getByRole('button', { name: 'Κλείσιμο', exact: true }).last().click();
  await expect.poll(() => gets).toBeGreaterThan(before);
  expect(posts).toBe(2);
});
