import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/companyDTO';



@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = 'http://localhost:8080/api/v1/companies';

  constructor(private http: HttpClient) {}

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}`, company);
  }
}