import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SupportTicketCategory, SupportTicketResponse } from 'src/app/theme/shared/models/supportTicket';
import { SupportTicketService } from 'src/app/theme/shared/service/supportTicket.service';

import { IconService } from '@ant-design/icons-angular';
import { AppstoreOutline, BarsOutline, CalendarOutline, EyeOutline, MenuOutline } from '@ant-design/icons-angular/icons';
import { FormsModule } from '@angular/forms';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { AuthenticationService } from 'src/app/theme/shared/service';

type TicketCategorySummary = {
  name: string;
  number: number;
  background: string;
};

type PropertyAgentSummary = {
  id: number;
  name: string;
  src: string;
  openTickets: number;
  totalTickets: number;
  background?: string;
};

type TicketBuildingOption = {
  id: number;
  name: string;
  street1?: string | null;
  stNumber1?: string | null;
  city?: string | null;
};

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss'
})
export class TicketListComponent implements OnInit {
  private iconService = inject(IconService);
  private supportTicketService = inject(SupportTicketService);

  selectedView = 'md-view';
  loading = false;
  errorMessage = '';

  ticketCards: SupportTicketResponse[] = [];
  categorySummary: TicketCategorySummary[] = [];

  assignedAgentId?: number | null;
  assignedAgentName?: string | null;
  buildings: TicketBuildingOption[] = [];
  selectedBuildingId: number | null = null;

  constructor(private buildingService: BuildingService, private authenticationService: AuthenticationService) {
    this.iconService.addIcon(...[AppstoreOutline, BarsOutline, MenuOutline, CalendarOutline, EyeOutline]);
  }

  ngOnInit(): void {
    if (this.canSelectBuilding()) {
      this.loadBuildings();
    } else {
      this.loadListTickets();
    }
  }

  loadListTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.supportTicketService
      .getListViewTickets()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: SupportTicketResponse[]) => {
          this.ticketCards = response ?? [];
          this.categorySummary = this.buildCategorySummary(this.ticketCards);

          this.agents = this.buildAgentSummary(this.ticketCards, [
            { id: 1, name: 'Property Agent 1', src: 'assets/images/user/avatar-1.jpg' },
            { id: 2, name: 'Property Agent 2', src: 'assets/images/user/avatar-2.jpg' },
            { id: 3, name: 'Property Agent 3', src: 'assets/images/user/avatar-3.jpg' }
          ]);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία φόρτωσης tickets.';
          this.ticketCards = [];
          this.categorySummary = [];
        }
      });
  }

  loadTicketsByBuilding(buildingId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.supportTicketService
      .getListViewTickets()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: SupportTicketResponse[]) => {
          const filtered = (response ?? []).filter((ticket) => ticket.buildingId === buildingId);

          this.ticketCards = filtered;
          this.categorySummary = this.buildCategorySummary(this.ticketCards);

          this.agents = this.buildAgentSummary(this.ticketCards, [
            { id: 1, name: 'Property Agent 1', src: 'assets/images/user/avatar-1.jpg' },
            { id: 2, name: 'Property Agent 2', src: 'assets/images/user/avatar-2.jpg' },
            { id: 3, name: 'Property Agent 3', src: 'assets/images/user/avatar-3.jpg' }
          ]);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία φόρτωσης tickets.';
          this.ticketCards = [];
          this.categorySummary = [];
          this.agents = [];
        }
      });
  }
  getCurrentUserRole(): string | null {
  const currentUser = this.authenticationService.currentUserValue;
  const role = currentUser?.role ?? null;
  return role ? role.trim().toUpperCase().replace(' ', '_') : null;
}

  canSelectBuilding(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'PROPERTYMANAGER' || role === 'PROPERTY_MANAGER' || role === 'ADMIN';
  }

  getSelectedBuildingAddress(): string {
    const building = this.buildings.find((b) => b.id === this.selectedBuildingId);

    if (!building) {
      return '-';
    }

    return `${building.street1 || ''} ${building.stNumber1 || ''}, ${building.city || ''}`.trim();
  }

  onBuildingChange(): void {
    if (this.selectedBuildingId == null) {
      return;
    }

    this.loadTicketsByBuilding(this.selectedBuildingId);
  }

  loadBuildings(): void {
    this.buildingService.getMyCompanyBuildings().subscribe({
      next: (response) => {
        this.buildings = response ?? [];

        if (this.buildings.length > 0) {
          this.selectedBuildingId = this.buildings[0].id;
          this.loadTicketsByBuilding(this.selectedBuildingId);
        }
      },
      error: () => {
        this.buildings = [];
      }
    });
  }

  getCardClass(ticket: SupportTicketResponse): string {
    if (ticket.status === 'CLOSED' || ticket.status === 'RESOLVED') {
      return 'close-ticket';
    }

    if (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_FOR_RESIDENT') {
      return 'open-ticket';
    }

    return '';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'bg-light-primary';
      case 'IN_PROGRESS':
        return 'bg-light-warning';
      case 'WAITING_FOR_RESIDENT':
        return 'bg-light-info';
      case 'RESOLVED':
        return 'bg-light-success';
      case 'CLOSED':
        return 'bg-light-secondary';
      case 'REJECTED':
        return 'bg-light-danger';
      default:
        return 'bg-light-secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'bg-light-secondary';
      case 'MEDIUM':
        return 'bg-light-info';
      case 'HIGH':
        return 'bg-light-warning';
      case 'URGENT':
        return 'bg-light-danger';
      default:
        return 'bg-light-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'Ανοιχτό';
      case 'IN_PROGRESS':
        return 'Σε Εξέλιξη';
      case 'WAITING_FOR_RESIDENT':
        return 'Αναμονή από κάτοικο';
      case 'RESOLVED':
        return 'Επιλύθηκε';
      case 'CLOSED':
        return 'Κλειστό';
      case 'REJECTED':
        return 'Απορρίφθηκε';
      default:
        return status;
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'Χαμηλή';
      case 'MEDIUM':
        return 'Μεσαία';
      case 'HIGH':
        return 'Υψηλή';
      case 'URGENT':
        return 'Επείγουσα';
      default:
        return priority;
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'MAINTENANCE':
        return 'Συντήρηση';
      case 'PAYMENTS':
        return 'Πληρωμές';
      case 'DOCUMENTS':
        return 'Έγγραφα';
      case 'COMPLAINT':
        return 'Παράπονο';
      case 'CLEANING':
        return 'Καθαρισμός';
      case 'HEATING':
        return 'Θέρμανση';
      case 'ELEVATOR':
        return 'Ασανσέρ';
      case 'PLUMBING':
        return 'Υδραυλικά';
      case 'ELECTRICAL':
        return 'Ηλεκτρολογικά';
      case 'OTHER':
        return 'Άλλο';
      default:
        return category;
    }
  }

  private readonly allCategories: SupportTicketCategory[] = [
    'MAINTENANCE',
    'PAYMENTS',
    'DOCUMENTS',
    'COMPLAINT',
    'CLEANING',
    'HEATING',
    'ELEVATOR',
    'PLUMBING',
    'ELECTRICAL',
    'OTHER'
  ];

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return '-';
    }

    return new Date(dateString).toLocaleString('el-GR');
  }

  private buildCategorySummary(items: SupportTicketResponse[]): TicketCategorySummary[] {
    const openTickets = items.filter((ticket) => ticket.status === 'OPEN');

    const categoryMap = new Map<SupportTicketCategory, number>();

    openTickets.forEach((ticket) => {
      categoryMap.set(ticket.category, (categoryMap.get(ticket.category) ?? 0) + 1);
    });

    return this.allCategories.map((category) => {
      const count = categoryMap.get(category) ?? 0;

      return {
        name: this.getCategoryLabel(category),
        number: count,
        background: count > 0 ? 'bg-light-primary' : 'bg-light-secondary'
      };
    });
  }

  agents: PropertyAgentSummary[] = [
    {
      id: 1,
      name: 'Property Agent 1',
      src: 'assets/images/user/avatar-1.jpg',
      openTickets: 0,
      totalTickets: 0,
      background: 'bg-light-primary'
    },
    {
      id: 2,
      name: 'Property Agent 2',
      src: 'assets/images/user/avatar-2.jpg',
      openTickets: 0,
      totalTickets: 0,
      background: 'bg-light-warning'
    },
    {
      id: 3,
      name: 'Property Agent 3',
      src: 'assets/images/user/avatar-3.jpg',
      openTickets: 0,
      totalTickets: 0,
      background: 'bg-light-success'
    }
  ];

  private buildAgentSummary(
    tickets: SupportTicketResponse[],
    baseAgents: { id: number; name: string; src: string }[]
  ): PropertyAgentSummary[] {
    return baseAgents.map((agent) => {
      const agentTickets = tickets.filter((ticket) => ticket.assignedAgentId === agent.id);
      const openTickets = agentTickets.filter(
        (ticket) => ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_FOR_RESIDENT'
      ).length;

      return {
        id: agent.id,
        name: agent.name,
        src: agent.src,
        openTickets,
        totalTickets: agentTickets.length,
        background: openTickets > 0 ? 'bg-light-primary' : 'bg-light-secondary'
      };
    });
  }
}
