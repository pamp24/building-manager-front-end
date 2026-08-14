import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BuildingService } from './building.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TabNavigationService {
  private tabChangeSource = new BehaviorSubject<number | null>(null);
  tabChange$ = this.tabChangeSource.asObservable();

constructor(private buildingService: BuildingService, private router: Router) {}

goToTab(tabId: number) {
  this.router.navigate(['/statement/list'], { queryParams: { tab: tabId } });
}

emitTabChange(tabId: number) {
  this.tabChangeSource.next(tabId);
}
}
