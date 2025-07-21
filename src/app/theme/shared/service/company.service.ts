import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  companyName: string;
  afm: string;
  responsiblePerson: string;
  phoneNumber: string;
  email: string;
  address: string;
  addressNumber: string;
  postalCode: string;
  city: string;
  region: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = 'http://localhost:8080/api/companies';

  constructor(private http: HttpClient) {}

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}`, company);
  }
}