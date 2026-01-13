/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component } from '@angular/core';

// project import
import { SharedModule } from '../../shared.module';

// third party
import { NgApexchartsModule } from 'ng-apexcharts';
import { OnInit } from '@angular/core';
import { PollService } from '../../service/poll.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-polls-table',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './polls-table.component.html',
  styleUrl: './polls-table.component.scss'
})
export class PollsTableComponent implements OnInit {
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
    this.pollService.getAll(this.buildingId).subscribe({
      next: (data) => (this.polls = data || []),
      error: (err) => console.error(err)
    });
  }

  viewPoll(poll: any) {
    console.log('View poll', poll);
    // θα κάνουμε modal αργότερα
  }

  deactivatePoll(poll: any) {
    if (!confirm('Είστε σίγουροι ότι θέλετε να απενεργοποιήσετε τη ψηφοφορία;')) return;

    this.pollService.deactivate(poll.id).subscribe({
      next: () => this.loadPolls(),
      error: (err) => console.error(err)
    });
  }

  openPollsPage() {
    this.router.navigate(['/polls']);
  }
}
