import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnInit } from '@angular/core';
/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import

// project import
import { SharedModule } from '../../shared.module';

// third party
import { NgApexchartsModule } from 'ng-apexcharts';

import { PollService } from '../../service/poll.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-polls-table',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './polls-table.component.html',
  styleUrl: './polls-table.component.scss'
})
export class PollsTableComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  polls: any[] = [];
  buildingId!: number;
  isManager: any;
  activePolls: any[] = [];

  constructor(
    private pollService: PollService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildingId = Number(localStorage.getItem('buildingId'));
    this.loadPolls();
  }

  loadPolls() {
    if (!this.buildingId) {
      this.polls = [];
      return;
    }
    this.pollService.getByBuilding(this.buildingId).subscribe({
      next: (data) => (this.polls = data || []),
      error: (err) => console.error(err)
    });
  }

  viewPoll(poll: any) {
    console.log('View poll', poll);
    // θα κάνουμε modal αργότερα
  }

  deactivatePoll(poll: any) {
    if (!confirm(this.uiLocale.text('Are you sure you want to disable voting?'))) return;

    this.pollService.deactivate(poll.id).subscribe({
      next: () => this.loadPolls(),
      error: (err) => console.error(err)
    });
  }

  openPollsPage() {
    this.router.navigate(['/polls']);
  }
}
