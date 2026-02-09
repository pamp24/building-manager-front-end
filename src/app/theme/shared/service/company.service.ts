import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyDTO } from '../models/companyDTO';



@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = 'http://localhost:8080/api/v1/companies';

  constructor(private http: HttpClient) {}

  createCompany(company: CompanyDTO): Observable<CompanyDTO> {
    return this.http.post<CompanyDTO>(`${this.baseUrl}`, company);
  }

  getMyCompany(): Observable<CompanyDTO> {
    return this.http.get<CompanyDTO>(`${this.baseUrl}/my/company`);
  }
}