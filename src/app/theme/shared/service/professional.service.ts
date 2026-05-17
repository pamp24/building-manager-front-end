import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ProfessionalBusinessDTO,
  ProfessionalBusinessRequest,
  ProfessionalCategory,
  ProfessionalAdminStatsDTO
} from '../models/professional.model';
import { ProfessionalReviewDTO, ProfessionalReviewRequest } from '../models/professional-review.model';
import { ProfessionalImageDTO } from '../models/professional-image.model';
import { PageResponse } from '../models/professional-page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = 'http://localhost:8080/api/v1/professionals';

  constructor(private http: HttpClient) {}

  search(category?: ProfessionalCategory, city?: string): Observable<ProfessionalBusinessDTO[]> {
    let params = new HttpParams();

    if (category) {
      params = params.set('category', category);
    }

    if (city) {
      params = params.set('city', city);
    }

    return this.http.get<ProfessionalBusinessDTO[]>(this.apiUrl, { params });
  }

  register(request: ProfessionalBusinessRequest): Observable<ProfessionalBusinessDTO> {
    return this.http.post<ProfessionalBusinessDTO>(`${this.apiUrl}/register`, request);
  }

  getMyBusinesses(): Observable<ProfessionalBusinessDTO[]> {
    return this.http.get<ProfessionalBusinessDTO[]>(`${this.apiUrl}/my`);
  }

  getPendingApproval(): Observable<ProfessionalBusinessDTO[]> {
    return this.http.get<ProfessionalBusinessDTO[]>(`${this.apiUrl}/pending`);
  }

  approve(id: number): Observable<ProfessionalBusinessDTO> {
    return this.http.patch<ProfessionalBusinessDTO>(`${this.apiUrl}/${id}/approve`, {});
  }

  deactivate(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {});
  }

  getReviews(professionalId: number) {
    return this.http.get<ProfessionalReviewDTO[]>(`${this.apiUrl}/${professionalId}/reviews`);
  }

  createReview(professionalId: number, request: ProfessionalReviewRequest) {
    return this.http.post<ProfessionalReviewDTO>(`${this.apiUrl}/${professionalId}/reviews`, request);
  }

  deleteReview(reviewId: number) {
    return this.http.delete(`${this.apiUrl}/reviews/${reviewId}`);
  }

  uploadImage(professionalId: number, file: File, primaryImage = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('primaryImage', String(primaryImage));

    return this.http.post<ProfessionalImageDTO>(`${this.apiUrl}/${professionalId}/images`, formData);
  }

  getImages(professionalId: number) {
    return this.http.get<ProfessionalImageDTO[]>(`${this.apiUrl}/${professionalId}/images`);
  }

  deleteImage(imageId: number) {
    return this.http.delete<void>(`${this.apiUrl}/images/${imageId}`);
  }

  setPrimaryImage(imageId: number) {
    return this.http.patch<ProfessionalImageDTO>(`${this.apiUrl}/images/${imageId}/primary`, {});
  }

  getById(id: number) {
    return this.http.get<ProfessionalBusinessDTO>(`${this.apiUrl}/${id}`);
  }

  update(id: number, payload: Partial<ProfessionalBusinessDTO>) {
    return this.http.put<ProfessionalBusinessDTO>(`${this.apiUrl}/${id}`, payload);
  }

  hasMyBusiness(): Observable<boolean> {
    return this.getMyBusinesses().pipe(map((businesses) => businesses.length > 0));
  }

  getAdminStats(): Observable<ProfessionalAdminStatsDTO> {
    return this.http.get<ProfessionalAdminStatsDTO>(`${this.apiUrl}/admin/stats`);
  }

  getAdminBusinesses(page: number, size: number) {
  return this.http.get<PageResponse<ProfessionalBusinessDTO>>(
    `${this.apiUrl}/admin/businesses?page=${page}&size=${size}`
  );
}

deleteBusiness(id: number) {
  return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
}
}
