/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from 'src/app/theme/shared/service/poll.service';
import { BuildingMemberService } from '../../../theme/shared/service/buildingMember.service';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IconService } from '@ant-design/icons-angular';
import { inject } from '@angular/core';
import { CaretDownOutline, CaretUpOutline, DeleteOutline, EditOutline } from '@ant-design/icons-angular/icons';
import { SharedModule } from 'src/app/theme/shared/shared.module';
declare var bootstrap: any;

@Component({
  selector: 'app-polls',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, SharedModule],
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss']
})
export class PollsComponent implements OnInit {
  private iconService = inject(IconService);
  polls: any[] = [];
  buildingId!: number;
  userVotedPolls: Record<number, number[]> = {};
  isManager = false;
  notMember = false;
  voteError: string | null = null;
  toastMessage: string | null = null;
  sortedColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  expandedPollId: number | null = null;
  pollVotes: any[] = [];
  votesLoading = false;
  activePolls: any[] = [];

  newPoll = {
    title: '',
    description: '',
    options: [{ text: '' }, { text: '' }],
    multipleChoice: false,
    startDate: '',
    endDate: ''
  };

  constructor(
    private pollService: PollService,
    private buildingMemberService: BuildingMemberService,
    private modal: NgbModal
  ) {
    this.iconService.addIcon(...[EditOutline, DeleteOutline, CaretDownOutline, CaretUpOutline]);
  }

  ngOnInit() {
    this.buildingId = Number(localStorage.getItem('buildingId'));
    this.checkIfManager();
    this.loadPolls();
  }

  /** Έλεγχος αν ο συνδεδεμένος χρήστης είναι διαχειριστής */
  checkIfManager() {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
      console.warn('Δεν βρέθηκε currentUser στο localStorage');
      this.isManager = false;
      return;
    }

    const currentUser = JSON.parse(userData);

    this.isManager = currentUser.role === 'BuildingManager';
  }

  loadPolls() {
    this.pollService.getMy().subscribe({
      next: (data) => {
        this.polls = data || [];
        this.activePolls = this.polls.filter((p) => p.active);
      },
      error: (err) => console.error(err)
    });
  }

  // === Δημιουργία νέας ψηφοφορίας ===
  refreshPolls() {
    this.loadPolls();

    // κλείσιμο modal
    const modalEl = document.getElementById('pollModal');
    const modal = bootstrap.Modal.getInstance(modalEl!);
    modal.hide();
  }

  isWinner(poll: any, option: any): boolean {
    if (poll.active) return false;
    const maxVotes = Math.max(...poll.options.map((o: any) => o.votes));
    return option.votes === maxVotes && maxVotes > 0;
  }

  userVoted(pollId: number, optionId: number): boolean {
    return this.userVotedPolls[pollId]?.includes(optionId);
  }

  vote(pollId: number, optionId: number) {
    this.pollService.vote(pollId, optionId).subscribe({
      next: (updatedPoll: any) => {
        const index = this.polls.findIndex((p) => p.id === pollId);
        if (index !== -1) {
          this.polls[index].options = updatedPoll.options;
          this.polls[index].active = updatedPoll.active;
          this.polls = [...this.polls];
        }

        if (this.expandedPollId === pollId) {
          this.loadVotes(pollId);
        }
        setTimeout(() => (this.toastMessage = null), 3000);
      },
      error: (err) => {
        console.error(err);
        this.toastMessage = 'Σφάλμα κατά την ψήφο.';
        setTimeout(() => (this.toastMessage = null), 3000);
      }
    });
  }

  getSortIcon(column: string): string {
    if (this.sortedColumn !== column) {
      return '';
    }
    return this.sortDirection === 'asc' ? '▲' : '▼';
  }

  onSort(column: string): void {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.polls = [...this.polls].sort((a: any, b: any) => {
      let v1 = a[column];
      let v2 = b[column];

      if (v1 == null) v1 = '';
      if (v2 == null) v2 = '';

      if (v1 < v2) return this.sortDirection === 'asc' ? -1 : 1;
      if (v1 > v2) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleVotes(pollId: number): void {
    if (this.expandedPollId === pollId) {
      this.expandedPollId = null;
      return;
    }
    this.expandedPollId = pollId;
    this.loadVotes(pollId);
  }

  loadVotes(pollId: number): void {
    this.votesLoading = true;
    this.pollService.getVotes(pollId).subscribe({
      next: (res: any[]) => {
        this.pollVotes = res;
        this.votesLoading = false;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης ψήφων:', err);
        this.votesLoading = false;
      }
    });
  }

  openAddModal() {
    const modalRef = this.modal.open(CreatePollComponent, { size: 'lg' });

    modalRef.componentInstance.buildingId = this.buildingId;

    modalRef.componentInstance.pollCreated.subscribe(() => {
      this.loadPolls();
      modalRef.close();
    });
  }

  confirmDelete(pollId: number) {
    if (!confirm('Θέλετε σίγουρα να διαγράψετε αυτή τη ψηφοφορία;')) return;

    this.pollService.deactivate(pollId).subscribe({
      next: () => {
        this.polls = this.polls.filter((p) => p.id !== pollId);
        this.activePolls = this.polls.filter((p) => p.active);
        this.loadPolls();
      },
      error: (err) => {
        console.error('Σφάλμα διαγραφής:', err);
        alert('Σφάλμα κατά τη διαγραφή.');
      }
    });
  }
}
