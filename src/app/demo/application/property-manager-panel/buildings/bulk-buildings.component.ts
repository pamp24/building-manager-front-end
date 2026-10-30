import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { Unzip, UnzipInflate, unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { readSheet } from 'read-excel-file/browser';
import writeXlsxFile from 'write-excel-file/browser';
import { BuildingsAddComponent } from './buildings-add/buildings-add.component';
import { BUILDING_COUNTRIES, BUILDING_HEATING_TYPES, BUILDING_YES_NO } from './building-options';

const columns = ['name', 'street1', 'stNumber1', 'street2', 'stNumber2', 'country', 'state', 'city', 'region', 'postalCode',
  'floors', 'apartmentsNum', 'sqMetersTotal', 'sqMetersCommonSpaces', 'buildingDescription', 'parkingExist', 'parkingSpacesNum',
  'storageExist', 'storageNum', 'undergroundFloorExist', 'halfFloorExist', 'overTopFloorExist', 'hasCentralHeating', 'heatingType', 'heatingCapacityLitres'];
const headings = ['Όνομα κτιρίου', 'Οδός', 'Αριθμός οδού', 'Δεύτερη οδός', 'Αριθμός δεύτερης οδού', 'Χώρα', 'Νομός', 'Πόλη', 'Περιοχή', 'Τ.Κ.',
  'Όροφοι', 'Αριθμός διαμερισμάτων', 'Συνολικά τ.μ.', 'Τ.μ. κοινόχρηστων χώρων', 'Περιγραφή κτιρίου', 'Υπάρχει πάρκινγκ', 'Αριθμός θέσεων πάρκινγκ',
  'Υπάρχει αποθήκη', 'Αριθμός αποθηκών', 'Υπάρχει υπόγειο', 'Υπάρχει ημιώροφος', 'Υπάρχει δώμα', 'Υπάρχει κεντρική θέρμανση', 'Τύπος θέρμανσης', 'Χωρητικότητα θέρμανσης (λίτρα)'];
const sample = ['Παράδειγμα κτιρίου', 'Οδός Παραδείγματος', '12', '', '', 'Ελλάδα', 'Νομός Αττικής', 'Αθήνα', 'Κέντρο', '12345',
  3, 6, 500, 50, 'Ενδεικτικά στοιχεία', 'Όχι', 0, 'Όχι', 0, 'Ναι', 'Όχι', 'Όχι', 'Όχι', 'NONE', 0];

export function validateBuildingRows(rows: unknown[][]): string[] {
  const errors: string[] = [];
  const header = (rows[0] || []).map(v => String(v ?? '').trim());
  const mapped = header.map(c => columns.includes(c) ? c : columns[headings.indexOf(c)]);
  const missing = columns.filter(c => !mapped.includes(c)).map(c => headings[columns.indexOf(c)]);
  const unknown = header.filter((c, i) => c && !mapped[i]);
  const repeated = mapped.filter((c, i) => c && mapped.indexOf(c) !== i).map(c => headings[columns.indexOf(c)]);
  if (missing.length) errors.push(`Λείπουν στήλες: ${missing.join(', ')}.`);
  if (unknown.length) errors.push(`Άγνωστες στήλες: ${unknown.join(', ')}.`);
  if (repeated.length) errors.push(`Διπλές στήλες: ${repeated.join(', ')}.`);
  if (errors.length) return errors;
  const seen = new Map<string, number>();
  let count = 0;
  rows.slice(1).forEach((cells, index) => {
    if (!cells.some(v => v !== null && v !== undefined && String(v).trim() !== '')) return;
    count++;
    const row = Object.fromEntries(columns.map(c => [c, String(cells[mapped.indexOf(c)] ?? '').trim()]));
    const issue = (field: string, message: string) => errors.push(`Γραμμή ${index + 2}, ${field.split('/').map(c => headings[columns.indexOf(c)]).join(' / ')}: ${message}`);
    for (const field of ['name', 'street1', 'stNumber1', 'street2', 'stNumber2', 'country', 'state', 'city', 'region', 'postalCode', 'buildingDescription']) {
      if (row[field].length > 255) issue(field, 'επιτρέπονται έως 255 χαρακτήρες.');
    }
    for (const field of ['name', 'street1', 'stNumber1', 'country', 'state', 'city', 'region']) {
      if (!row[field]) issue(field, 'υποχρεωτικό πεδίο.');
    }
    if (row['country'] && !BUILDING_COUNTRIES.includes(row['country'])) issue('country', 'επιλέξτε Ελλάδα.');
    if (row['state'] && !BuildingsAddComponent.states.includes(row['state'])) issue('state', 'μη διαθέσιμος νομός της φόρμας PM.');
    if (!/^\d{5}$/.test(row['postalCode'])) issue('postalCode', 'απαιτούνται ακριβώς 5 ψηφία (μορφή κειμένου στο Excel).');
    const number = (field: string, min: number, required: boolean, integer = false) => {
      const value = row[field];
      if (!value && !required) return;
      const n = Number(value);
      if (!value || !Number.isFinite(n) || n < min || (integer && !Number.isInteger(n))) {
        issue(field, `απαιτείται ${integer ? 'ακέραιος' : 'αριθμός'} μεγαλύτερος ή ίσος με ${min}.`);
      }
    };
    number('floors', 0, true, true); number('apartmentsNum', 1, true, true);
    number('sqMetersTotal', 1, true); number('sqMetersCommonSpaces', 0, false);
    if (row['sqMetersCommonSpaces'] && Number(row['sqMetersCommonSpaces']) > Number(row['sqMetersTotal'])) issue('sqMetersCommonSpaces', 'δεν μπορεί να υπερβαίνει τα συνολικά τ.μ.');
    const flags = ['parkingExist', 'storageExist', 'undergroundFloorExist', 'halfFloorExist', 'overTopFloorExist', 'hasCentralHeating'];
    for (const field of flags) if (row[field] && !BUILDING_YES_NO.includes(row[field])) issue(field, 'χρησιμοποιήστε Ναι ή Όχι.');
    number('parkingSpacesNum', row['parkingExist'] === 'Ναι' ? 1 : 0, row['parkingExist'] === 'Ναι', true);
    number('storageNum', row['storageExist'] === 'Ναι' ? 1 : 0, row['storageExist'] === 'Ναι', true);
    number('heatingCapacityLitres', 0, row['hasCentralHeating'] === 'Ναι');
    if (row['hasCentralHeating'] === 'Ναι' && !row['heatingType']) issue('heatingType', 'υποχρεωτικό με κεντρική θέρμανση.');
    row['heatingType'] = BUILDING_HEATING_TYPES.find(type => type.label === row['heatingType'])?.value ?? row['heatingType'];
    if (row['heatingType'] && !BUILDING_HEATING_TYPES.some(type => type.value === row['heatingType'])) issue('heatingType', 'επιλέξτε έναν διαθέσιμο τύπο θέρμανσης.');
    for (const [flag, field] of [['parkingExist', 'parkingSpacesNum'], ['storageExist', 'storageNum'], ['hasCentralHeating', 'heatingCapacityLitres']]) {
      if (row[flag] !== 'Ναι' && row[field] && Number(row[field]) !== 0) issue(field, 'πρέπει να είναι κενό ή 0 όταν η αντίστοιχη επιλογή είναι Όχι.');
    }
    if (row['hasCentralHeating'] !== 'Ναι' && row['heatingType'] && row['heatingType'] !== 'NONE') issue('heatingType', 'χωρίς κεντρική θέρμανση χρησιμοποιήστε NONE ή αφήστε κενό.');
    if (row['street1'] && row['stNumber1'] && row['city'] && row['postalCode']) {
      const key = JSON.stringify([row['street1'], row['stNumber1'], row['city'], row['postalCode'], row['country']].map(v => v.toLowerCase()));
      if (seen.has(key)) issue('street1/stNumber1/city/postalCode', `πιθανό διπλότυπο της γραμμής ${seen.get(key)} στο αρχείο.`);
      else seen.set(key, index + 2);
    }
  });
  if (!count) errors.push('Το αρχείο δεν περιέχει γραμμές δεδομένων.');
  if (count > 500) errors.push('Επιτρέπονται έως 500 γραμμές δεδομένων.');
  return errors;
}

// Limit actual expanded ZIP data, not just the easily forged ZIP size metadata.
export function checkArchive(bytes: Uint8Array): void {
  let total = 0;
  let entries = 0;
  const unzip = new Unzip(file => {
    if (++entries > 100) throw new Error('archive limit');
    const worksheet = /^xl\/worksheets\/sheet\d+\.xml$/i.test(file.name);
    let xml = '';
    const decoder = new TextDecoder();
    file.ondata = (error, data, final) => {
      if (error) throw error;
      total += data.length;
      if (total > 10 * 1024 * 1024) throw new Error('archive limit');
      if (worksheet) {
        xml += decoder.decode(data, { stream: !final });
        if (final) {
          for (const match of xml.matchAll(/\br\s*=\s*["'](?:([A-Z]+))?(\d+)["']/gi)) {
            const col = (match[1] || '').toUpperCase().split('').reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0);
            if (Number(match[2]) > 1001 || col > 100) throw new Error('sheet limit');
          }
        }
      }
    };
    file.start();
  });
  unzip.register(UnzipInflate);
  for (let i = 0; i < bytes.length; i += 4096) unzip.push(bytes.subarray(i, i + 4096), i + 4096 >= bytes.length);
  if (!entries) throw new Error('invalid archive');
}

@Component({
  selector: 'app-bulk-buildings',
  imports: [CommonModule],
  templateUrl: './bulk-buildings.component.html',
  styles: [`.btn-outline-primary { --bs-btn-color: var(--bs-primary); --bs-btn-border-color: var(--bs-primary); --bs-btn-hover-bg: var(--bs-primary); --bs-btn-hover-border-color: var(--bs-primary); --bs-btn-active-bg: var(--bs-primary); --bs-btn-active-border-color: var(--bs-primary); --bs-btn-disabled-color: var(--bs-primary); --bs-btn-disabled-border-color: var(--bs-primary); --bs-btn-focus-shadow-rgb: var(--bs-primary-rgb); }`]
})
export class BulkBuildingsComponent {
  private service = inject(BuildingService);
  private version = 0;
  private validated: { payload: Record<string, unknown>[]; rowNumbers: number[] } | null = null;
  @Output() uploaded = new EventEmitter<void>();
  @Output() sendingChange = new EventEmitter<boolean>();
  file: File | null = null;
  errors: string[] = [];
  success = false;
  busy = false;
  sending = false;
  uploadedCount = 0;

  get canUpload(): boolean { return !!this.validated && !this.busy && !this.sending && !this.uploadedCount; }

  async download(): Promise<void> {
    const lists = [BUILDING_COUNTRIES, BuildingsAddComponent.states, BUILDING_YES_NO, BUILDING_HEATING_TYPES.map(type => type.label)];
    const listRows = Array.from({ length: Math.max(...lists.map(list => list.length)) }, (_, i) => lists.map(list => ({ value: list[i] ?? null })));
    const blob = await writeXlsxFile([
      { sheet: 'Κτίρια', data: [headings.map(value => ({ value, fontWeight: 'bold' as const })), sample.map(value => ({ value }))] },
      { sheet: 'Επιλογές', data: listRows }
    ]).toBlob();
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const sheet = strFromU8(files['xl/worksheets/sheet1.xml']);
    const validations = [['F', 0], ['G', 1], ...['P', 'R', 'T', 'U', 'V', 'W'].map(col => [col, 2] as [string, number]), ['X', 3]] as [string, number][];
    const rules = validations.map(([col, list]) => `<dataValidation type="list" allowBlank="1" showErrorMessage="1" errorStyle="stop" sqref="${col}2:${col}1001"><formula1>INDIRECT(&quot;'Επιλογές'!$${String.fromCharCode(65 + list)}$1:$${String.fromCharCode(65 + list)}$${lists[list].length}&quot;)</formula1></dataValidation>`).join('');
    if (!sheet.includes('</worksheet>')) throw new Error('Invalid generated worksheet');
    files['xl/worksheets/sheet1.xml'] = strToU8(sheet.replace('</worksheet>', `<dataValidations count="${validations.length}">${rules}</dataValidations></worksheet>`));
    const url = URL.createObjectURL(new Blob([zipSync(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'protypo-ktirion.xlsx'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  select(event: Event): void {
    if (this.sending) return;
    this.version++;
    this.busy = false;
    this.validated = null;
    this.file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.errors = [];
    this.success = false;
  }

  async check(): Promise<void> {
    if (this.busy || this.sending || this.uploadedCount) return;
    const version = ++this.version;
    this.validated = null;
    this.errors = []; this.success = false;
    const file = this.file;
    if (!file || !/\.xlsx$/i.test(file.name)) { this.errors = ['Επιλέξτε αρχείο .xlsx.']; return; }
    if (!file.size || file.size > 2 * 1024 * 1024) { this.errors = ['Το αρχείο πρέπει να έχει μέγεθος έως 2 MB και να μην είναι κενό.']; return; }
    this.busy = true;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      checkArchive(bytes);
      const rows = await readSheet(file);
      if (version !== this.version) return;
      this.errors = validateBuildingRows(rows);
      this.success = !this.errors.length;
      if (this.success) {
        const mapped = rows[0].map(v => { const value = String(v ?? '').trim(); return columns.includes(value) ? value : columns[headings.indexOf(value)]; });
        const payload: Record<string, unknown>[] = [];
        const rowNumbers: number[] = [];
        rows.slice(1).forEach((cells, index) => {
          if (!cells.some(v => v !== null && v !== undefined && String(v).trim() !== '')) return;
          const row = Object.fromEntries(columns.map(c => [c, String(cells[mapped.indexOf(c)] ?? '').trim()]));
          const flag = (name: string) => row[name] === 'Ναι';
          payload.push({
            name: row['name'], street1: row['street1'], stNumber1: row['stNumber1'], street2: row['street2'] || null,
            stNumber2: row['stNumber2'] || null, country: row['country'], state: row['state'], city: row['city'], region: row['region'], postalCode: row['postalCode'],
            floors: Number(row['floors']), apartmentsNum: Number(row['apartmentsNum']), sqMetersTotal: Number(row['sqMetersTotal']), sqMetersCommonSpaces: Number(row['sqMetersCommonSpaces']),
            buildingDescription: row['buildingDescription'] || null, active: true, enable: true,
            parkingExist: flag('parkingExist'), parkingSpacesNum: flag('parkingExist') ? Number(row['parkingSpacesNum']) : 0,
            storageExist: flag('storageExist'), storageNum: flag('storageExist') ? Number(row['storageNum']) : 0,
            undergroundFloorExist: flag('undergroundFloorExist'), halfFloorExist: flag('halfFloorExist'), overTopFloorExist: flag('overTopFloorExist'),
            hasCentralHeating: flag('hasCentralHeating'), heatingType: flag('hasCentralHeating') ? (BUILDING_HEATING_TYPES.find(type => type.label === row['heatingType'])?.value ?? row['heatingType']) : 'NONE',
            heatingCapacityLitres: flag('hasCentralHeating') ? Number(row['heatingCapacityLitres']) : 0
          });
          rowNumbers.push(index + 2);
        });
        this.validated = { payload, rowNumbers };
      }
    } catch {
      if (version === this.version) this.errors = ['Το αρχείο δεν είναι έγκυρο .xlsx, είναι κατεστραμμένο ή υπερβαίνει τα όρια αποσυμπίεσης.'];
    } finally { if (version === this.version) this.busy = false; }
  }

  upload(): void {
    if (!this.canUpload || !this.validated) return;
    const batch = this.validated;
    this.sending = true;
    this.sendingChange.emit(true);
    this.errors = [];
    this.service.createCompanyBuildingsBulk(batch.payload).subscribe({
      next: ids => {
        this.sending = false; this.sendingChange.emit(false);
        if (!Array.isArray(ids) || ids.length !== batch.payload.length || !ids.every(id => typeof id === 'number' && Number.isFinite(id))) {
          this.validated = null; this.success = false;
          this.errors = ['Μη αναμενόμενη απάντηση. Η κατάσταση της εισαγωγής είναι άγνωστη. Ελέγξτε τη λίστα πριν δοκιμάσετε ξανά.'];
          this.uploaded.emit();
          return;
        }
        this.uploadedCount = ids.length; this.validated = null; this.success = false;
        this.uploaded.emit();
      },
      error: err => {
        this.sending = false; this.sendingChange.emit(false); this.success = false; this.validated = null;
        const details = err?.error?.errors;
        this.errors = Array.isArray(details) && details.length ? details.map((item: { row: number; field: string; message: string }) => {
          const row = batch.rowNumbers[item.row - 1];
          const field = headings[columns.indexOf(item.field)] || item.field || '';
          return `${row ? `Γραμμή ${row}` : 'Αρχείο'}${field ? `, ${field}` : ''}: ${item.message}`;
        }) : [err?.status === 0 || err?.status >= 500
          ? 'Η κατάσταση της εισαγωγής είναι άγνωστη. Ελέγξτε τη λίστα πριν δοκιμάσετε ξανά.'
          : (err?.error?.message || 'Η εισαγωγή απέτυχε. Ελέγξτε τα στοιχεία και δοκιμάστε ξανά.')];
        if (err?.status === 0 || err?.status >= 500) this.uploaded.emit();
      }
    });
  }
}
