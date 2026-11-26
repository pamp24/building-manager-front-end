import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { readSheet } from 'read-excel-file/browser';
import writeXlsxFile from 'write-excel-file/browser';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { ApartmentRequest } from 'src/app/theme/shared/models/apartmentRequest';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { checkArchive } from '../../property-manager-panel/buildings/bulk-buildings.component';

const columns = [
  'ownerFirstName',
  'ownerLastName',
  'number',
  'floor',
  'sqMetersApart',
  'commonPercent',
  'elevatorPercent',
  'heatingPercent',
  'isRented',
  'residentFirstName',
  'residentLastName',
  'parkingSpace',
  'parkingSlot',
  'apStorageExist',
  'storageSlot'
];
const headings = [
  'Όνομα ιδιοκτήτη',
  'Επώνυμο ιδιοκτήτη',
  'Αριθμός διαμερίσματος',
  'Όροφος',
  'Τ.μ. διαμερίσματος',
  'Χιλιοστά κοινοχρήστων',
  'Χιλιοστά ασανσέρ',
  'Χιλιοστά θέρμανσης',
  'Ενοικιασμένο',
  'Όνομα ενοικιαστή',
  'Επώνυμο ενοικιαστή',
  'Θέση πάρκινγκ',
  'Αριθμός θέσης πάρκινγκ',
  'Αποθήκη',
  'Αριθμός αποθήκης'
];

@Component({
  selector: 'app-bulk-apartments',
  imports: [TranslateModule, CommonModule],
  templateUrl: './bulk-apartments.component.html',
  styles: [
    `
      .btn-outline-primary {
        --bs-btn-color: var(--bs-primary);
        --bs-btn-border-color: var(--bs-primary);
        --bs-btn-hover-bg: var(--bs-primary);
        --bs-btn-hover-border-color: var(--bs-primary);
      }
    `
  ]
})
export class BulkApartmentsComponent {
  private readonly uiLocale = inject(UiLocaleService);

  @Input({ required: true }) building!: BuildingDTO;
  @Output() uploaded = new EventEmitter<void>();
  @Output() sendingChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  private service = inject(ApartmentService);
  private version = 0;
  private validated: { payload: ApartmentRequest[]; rows: number[] } | null = null;
  file: File | null = null;
  errors: string[] = [];
  success = false;
  busy = false;
  sending = false;
  uploadedCount = 0;
  get canUpload(): boolean {
    return !!this.validated && !this.busy && !this.sending && !this.uploadedCount;
  }
  get floors(): string[] {
    const floors = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ΣΤ', 'Ζ', 'Η', 'Θ', 'Ι', 'ΙΑ', 'ΙΒ', 'ΙΓ', 'ΙΔ', 'ΙΕ'];
    return [
      ...(this.building.undergroundFloorExist ? [this.uiLocale.text('Basement')] : []),
      this.uiLocale.text('Ground Floor'),
      ...(this.building.halfFloorExist ? [this.uiLocale.text('Mezzanine')] : []),
      ...floors.slice(0, this.building.floors || 0),
      ...(this.building.overTopFloorExist ? [this.uiLocale.text('Roof')] : [])
    ];
  }

  async download(): Promise<void> {
    const lists = [this.floors, [this.uiLocale.text('Yes'), this.uiLocale.text('Nope')]];
    const sample = [
      this.uiLocale.text('Maria'),
      this.uiLocale.text('Papadopoulou'),
      this.uiLocale.text('A1'),
      this.uiLocale.text('Ground Floor'),
      '75',
      100,
      100,
      100,
      this.uiLocale.text('Nope'),
      '',
      '',
      this.uiLocale.text('Nope'),
      '',
      this.uiLocale.text('Nope'),
      ''
    ];
    const blob = await writeXlsxFile([
      {
        sheet: this.uiLocale.text('Apartments'),
        data: [headings.map((value) => ({ value, fontWeight: 'bold' as const })), sample.map((value) => ({ value }))]
      },
      {
        sheet: this.uiLocale.text('Options'),
        data: Array.from({ length: Math.max(...lists.map((l) => l.length)) }, (_, i) => lists.map((l) => ({ value: l[i] ?? null })))
      }
    ]).toBlob();
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    const sheet = strFromU8(files['xl/worksheets/sheet1.xml']);
    const rules = (
      [
        ['D', 0],
        ['I', 1],
        ['L', 1],
        ['N', 1]
      ] as [string, number][]
    )
      .map(
        ([col, list]) =>
          `<dataValidation type="list" allowBlank="1" showErrorMessage="1" errorStyle="stop" sqref="${col}2:${col}1001"><formula1>INDIRECT(&quot;'Επιλογές'!$${String.fromCharCode(65 + list)}$1:$${String.fromCharCode(65 + list)}$${lists[list].length}&quot;)</formula1></dataValidation>`
      )
      .join('');
    files['xl/worksheets/sheet1.xml'] = strToU8(
      sheet.replace('</worksheet>', `<dataValidations count="4">${rules}</dataValidations></worksheet>`)
    );
    const url = URL.createObjectURL(
      new Blob([zipSync(files)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'protypo-diamerismaton.xlsx';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  select(event: Event): void {
    if (this.sending) return;
    this.version++;
    this.busy = false;
    this.validated = null;
    this.success = false;
    this.errors = [];
    this.file = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  async check(): Promise<void> {
    if (this.busy || this.sending || this.uploadedCount) return;
    const version = ++this.version;
    this.validated = null;
    this.errors = [];
    this.success = false;
    const file = this.file;
    if (!file || !/\.xlsx$/i.test(file.name)) {
      this.errors = [this.uiLocale.text('Select file .xlsx.')];
      return;
    }
    if (!file.size || file.size > 2 * 1024 * 1024) {
      this.errors = [this.uiLocale.text('The file must be up to 2 MB in size and not be empty.')];
      return;
    }
    this.busy = true;
    try {
      checkArchive(new Uint8Array(await file.arrayBuffer()));
      const rows = await readSheet(file);
      if (version !== this.version) return;
      const header = (rows[0] || []).map((v) => String(v ?? '').trim());
      const mapped = header.map((v) => (columns.includes(v) ? v : columns[headings.indexOf(v)]));
      const missing = columns.filter((c) => !mapped.includes(c)).map((c) => headings[columns.indexOf(c)]);
      const unknown = header.filter((v, i) => v && !mapped[i]);
      const duplicate = mapped.filter((v, i) => v && mapped.indexOf(v) !== i).map((v) => headings[columns.indexOf(v)]);
      if (missing.length) this.errors.push(`Λείπουν στήλες: ${missing.join(', ')}.`);
      if (unknown.length) this.errors.push(`Άγνωστες στήλες: ${unknown.join(', ')}.`);
      if (duplicate.length) this.errors.push(`Διπλές στήλες: ${duplicate.join(', ')}.`);
      if (this.errors.length) return;
      const payload: ApartmentRequest[] = [];
      const rowNumbers: number[] = [];
      const seen = new Map<string, number>();
      rows.slice(1).forEach((cells, index) => {
        if (!cells.some((v) => v != null && String(v).trim())) return;
        const row = Object.fromEntries(columns.map((c) => [c, String(cells[mapped.indexOf(c)] ?? '').trim()]));
        const issue = (field: string, text: string) =>
          this.errors.push(`Γραμμή ${index + 2}, ${headings[columns.indexOf(field)]}: ${text}`);
        for (const field of columns) if (row[field].length > 255) issue(field, this.uiLocale.text('Up to 255 characters are allowed.'));
        for (const field of ['ownerFirstName', 'ownerLastName', 'number', 'floor', 'sqMetersApart'])
          if (!row[field]) issue(field, this.uiLocale.text('Mandatory field.'));
        if (row['floor'] && !this.floors.includes(row['floor']))
          issue('floor', this.uiLocale.text('Select available floor of the building.'));
        const decimal = (v: string) => (/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(v) ? Number(v.replace(',', '.')) : NaN);
        if (row['sqMetersApart'] && (!Number.isFinite(decimal(row['sqMetersApart'])) || decimal(row['sqMetersApart']) <= 0))
          issue('sqMetersApart', this.uiLocale.text('A number greater than 0 is required.'));
        for (const field of ['commonPercent', 'elevatorPercent', 'heatingPercent'])
          if (!Number.isFinite(decimal(row[field])) || decimal(row[field]) < 0 || decimal(row[field]) > 1000)
            issue(field, this.uiLocale.text('A number from 0 to 1000 is required.'));
        for (const field of ['isRented', 'parkingSpace', 'apStorageExist'])
          if (row[field] && ![this.uiLocale.text('Yes'), this.uiLocale.text('Nope')].includes(row[field]))
            issue(field, this.uiLocale.text('use Yes or No.'));
        for (const [flag, fields] of [
          ['isRented', ['residentFirstName', 'residentLastName']],
          ['parkingSpace', ['parkingSlot']],
          ['apStorageExist', ['storageSlot']]
        ] as [string, string[]][]) {
          if (row[flag] === 'Ναι') for (const field of fields) if (!row[field]) issue(field, this.uiLocale.text('Mandatory field.'));
        }
        const key = JSON.stringify([row['floor'].toLowerCase(), row['number'].toLowerCase()]);
        if (row['floor'] && row['number']) {
          if (seen.has(key)) issue('number', `διπλότυπο της γραμμής ${seen.get(key)}.`);
          else seen.set(key, index + 2);
        }
        const flag = (field: string) => row[field] === 'Ναι';
        payload.push({
          ownerFirstName: row['ownerFirstName'],
          ownerLastName: row['ownerLastName'],
          number: row['number'],
          floor: row['floor'],
          sqMetersApart: row['sqMetersApart'],
          commonPercent: decimal(row['commonPercent']),
          elevatorPercent: decimal(row['elevatorPercent']),
          heatingPercent: decimal(row['heatingPercent']),
          isRented: flag('isRented'),
          residentFirstName: flag('isRented') ? row['residentFirstName'] : null,
          residentLastName: flag('isRented') ? row['residentLastName'] : null,
          parkingSpace: flag('parkingSpace'),
          parkingSlot: flag('parkingSpace') ? row['parkingSlot'] : null,
          apStorageExist: flag('apStorageExist'),
          storageSlot: flag('apStorageExist') ? row['storageSlot'] : null,
          isManagerHouse: false,
          active: true,
          enable: true,
          buildingId: this.building.id
        });
        rowNumbers.push(index + 2);
      });
      if (!payload.length) this.errors.push('Το αρχείο δεν περιέχει γραμμές δεδομένων.');
      if (payload.length > 500) this.errors.push('Επιτρέπονται έως 500 γραμμές δεδομένων.');
      if (!this.errors.length) {
        this.validated = { payload, rows: rowNumbers };
        this.success = true;
      }
    } catch {
      if (version === this.version)
        this.errors = [this.uiLocale.text('The file is invalid .xlsx, is corrupted, or exceeds decompression limits.')];
    } finally {
      if (version === this.version) this.busy = false;
    }
  }

  close(): void {
    if (!this.sending) this.closed.emit();
  }

  upload(): void {
    if (!this.canUpload || !this.validated) return;
    const batch = this.validated;
    this.sending = true;
    this.sendingChange.emit(true);
    this.errors = [];
    this.service.createBulk(this.building.id, batch.payload).subscribe({
      next: (ids) => {
        this.sending = false;
        this.sendingChange.emit(false);
        this.validated = null;
        this.success = false;
        if (
          !Array.isArray(ids) ||
          ids.length !== batch.payload.length ||
          !ids.every((id) => typeof id === 'number' && Number.isFinite(id))
        ) {
          this.errors = [
            this.uiLocale.text('An unexpected answer. The status of the admission is unknown. Check the list before trying again.')
          ];
        } else this.uploadedCount = ids.length;
        this.uploaded.emit();
      },
      error: (err) => {
        this.sending = false;
        this.sendingChange.emit(false);
        this.validated = null;
        this.success = false;
        const details = err?.error?.errors;
        this.errors =
          Array.isArray(details) && details.length
            ? details.map((item: { row: number; field: string; message: string }) => {
                const row = Number.isInteger(item.row) && item.row > 0 ? batch.rows[item.row - 1] : undefined;
                const field = headings[columns.indexOf(item.field)] || item.field || '';
                const message = String(item.message ?? '').replace(/\(row (\d+)\)/g, (match, n) =>
                  batch.rows[Number(n) - 1] ? `(γραμμή ${batch.rows[Number(n) - 1]})` : match
                );
                return `${row ? `Γραμμή ${row}` : this.uiLocale.text('Archive')}${field ? `, ${field}` : ''}: ${message}`;
              })
            : [
                err?.status === 0 || err?.status >= 500
                  ? this.uiLocale.text('The status of the admission is unknown. Check the list before trying again.')
                  : err?.error?.message || this.uiLocale.text('The introduction failed.')
              ];
        if (err?.status === 0 || err?.status >= 500) this.uploaded.emit();
      }
    });
  }
}
