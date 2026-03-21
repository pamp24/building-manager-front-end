import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';

export interface AgentWorkloadTableRow {
  agentId: number;
  agentName: string;
  activeTickets: number;
  completedTickets: number;
  totalTickets: number;
}

@Component({
  selector: 'app-agent-workload-table',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './agent-workload-table.component.html',
  styleUrl: './agent-workload-table.component.scss'
})
export class AgentWorkloadTableComponent {
  @Input() rows: AgentWorkloadTableRow[] = [];
  @Input() title = 'Support Agents Workload';
  @Input() emptyMessage = 'Δεν υπάρχουν δεδομένα agents.';

  trackByAgentId(_: number, agent: AgentWorkloadTableRow): number {
    return agent.agentId;
  }
}