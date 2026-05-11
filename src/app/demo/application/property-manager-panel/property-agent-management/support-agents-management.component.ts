import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { SharedModule } from 'src/app/theme/shared/shared.module';

import { PropertyAgentManagementService } from 'src/app/theme/shared/service/property-agent-management.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { AuthenticationService, UserService } from 'src/app/theme/shared/service';
import { PropertyAgentManagementResponse } from 'src/app/theme/shared/models/property-agent-management';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';

@Component({
  selector: 'app-support-agents-management',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './support-agents-management.component.html',
  styleUrl: './support-agents-management.component.scss'
})
export class SupportAgentsManagementComponent implements OnInit {
  private agentService = inject(PropertyAgentManagementService);
  private buildingService = inject(BuildingService);
  private userService = inject(UserService);
  private authenticationService = inject(AuthenticationService);
  loading = false;
  errorMessage = '';

  agents: PropertyAgentManagementResponse[] = [];

  // assign modal
  showModal = false;
  selectedAgent: PropertyAgentManagementResponse | null = null;

  buildings: BuildingDTO[] = [];
  selectedBuildingIds: number[] = [];

  // invite modal
  showInviteModal = false;
  inviteEmail = '';
  inviteLoading = false;
  inviteErrorMessage = '';
  inviteSuccessMessage = '';

  ngOnInit(): void {
    this.loadAgents();
    this.loadBuildings();
  }

  loadAgents(): void {
    this.loading = true;

    this.agentService
      .getAgents()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.agents = res ?? [];
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Σφάλμα φόρτωσης agents';
          this.agents = [];
        }
      });
  }

  loadBuildings(): void {
    const role = this.getCurrentRole();

    if (role === 'ADMIN') {
      this.buildingService.getAllBuildingsForAdmin().subscribe({
        next: (res) => (this.buildings = res ?? []),
        error: () => (this.buildings = [])
      });
      return;
    }

    this.buildingService.getMyCompanyBuildings().subscribe({
      next: (res) => (this.buildings = res ?? []),
      error: () => (this.buildings = [])
    });
  }

  private getCurrentRole(): string | null {
    const currentUser = this.authenticationService.currentUserValue;
    const role = currentUser?.role ?? null;
    return role ? role.trim().toUpperCase().replace(/\s+/g, '_') : null;
  }

  openAssignModal(agent: PropertyAgentManagementResponse): void {
    this.selectedAgent = agent;
    this.showModal = true;
    this.selectedBuildingIds = agent.assignedBuildings.map((b) => b.id);
  }

  closeAssignModal(): void {
    this.showModal = false;
    this.selectedAgent = null;
    this.selectedBuildingIds = [];
  }

  toggleBuilding(buildingId: number): void {
    if (this.selectedBuildingIds.includes(buildingId)) {
      this.selectedBuildingIds = this.selectedBuildingIds.filter((id) => id !== buildingId);
    } else {
      this.selectedBuildingIds = [...this.selectedBuildingIds, buildingId];
    }
  }

  saveAssignments(): void {
    if (!this.selectedAgent) {
      return;
    }

    this.agentService
      .updateAgentBuildings(this.selectedAgent.id, {
        buildingIds: this.selectedBuildingIds
      })
      .subscribe({
        next: () => {
          this.loadAgents();
          this.closeAssignModal();
        },
        error: (err) => {
          alert(err?.error?.message || 'Σφάλμα αποθήκευσης');
        }
      });
  }

  openInviteModal(): void {
    this.showInviteModal = true;
    this.inviteEmail = '';
    this.inviteErrorMessage = '';
    this.inviteSuccessMessage = '';
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
    this.inviteEmail = '';
    this.inviteLoading = false;
    this.inviteErrorMessage = '';
    this.inviteSuccessMessage = '';
  }

  sendInvite(): void {
    this.inviteErrorMessage = '';
    this.inviteSuccessMessage = '';

    const email = this.inviteEmail.trim();

    if (!email) {
      this.inviteErrorMessage = 'Το email είναι υποχρεωτικό.';
      return;
    }

    this.inviteLoading = true;

    this.userService
      .inviteUserToBuilding({
        email,
        role: this.getInviteRole(),
        apartmentId: null
      })
      .pipe(finalize(() => (this.inviteLoading = false)))
      .subscribe({
        next: () => {
          this.inviteSuccessMessage = 'Η πρόσκληση στάλθηκε επιτυχώς.';
          this.inviteEmail = '';
        },
        error: (err) => {
          this.inviteErrorMessage = err?.error?.message || 'Αποτυχία αποστολής πρόσκλησης.';
        }
      });
  }

  removeAgent(agentId: number): void {
    if (!confirm('Σίγουρα θέλεις να αφαιρέσεις τον agent;')) {
      return;
    }

    this.agentService.removeAgent(agentId).subscribe({
      next: () => this.loadAgents(),
      error: () => alert('Αποτυχία διαγραφής')
    });
  }

  getBuildingsLabel(agent: PropertyAgentManagementResponse): string {
    if (!agent.assignedBuildings?.length) {
      return 'Καμία ανάθεση';
    }

    return agent.assignedBuildings.map((b) => b.name).join(', ');
  }

  isSelected(buildingId: number): boolean {
    return this.selectedBuildingIds.includes(buildingId);
  }

  trackByAgentId(_: number, agent: PropertyAgentManagementResponse): number {
    return agent.id;
  }

  private getInviteRole(): 'AdminAgent' | 'PropertyAgent' {
    const currentUser = this.authenticationService.currentUserValue;
    const role = currentUser?.role?.trim().toUpperCase().replace(/\s+/g, '_');

    return role === 'ADMIN' ? 'AdminAgent' : 'PropertyAgent';
  }
}
