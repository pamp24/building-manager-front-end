export interface ProfessionalReviewDTO {
  id: number;

  professionalId: number;

  rating: number;
  comment: string;

  reviewerId: number;
  reviewerName: string;

  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalReviewRequest {
  rating: number;
  comment: string;
}