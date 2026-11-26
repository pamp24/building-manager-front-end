import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  private readonly uiLocale = inject(UiLocaleService);

  @Input() rows: AgentWorkloadTableRow[] = [];
  @Input() title = 'Support Agents Workload';
  @Input() emptyMessage = this.uiLocale.text('There are no agent data.');

  trackByAgentId(_: number, agent: AgentWorkloadTableRow): number {
    return agent.agentId;
  }
}
