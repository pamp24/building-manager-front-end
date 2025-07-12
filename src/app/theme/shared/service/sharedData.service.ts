import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private _firstName: string = '';
  private _lastName: string = '';
  private email: string = '';

  setEmail(email: string): void {
    this.email = email;
  }

  setFirstName(name: string) {
    this._firstName = name;
  }

  getFirstName(): string {
    return this._firstName;
  }

  setLastName(name: string) {
    this._lastName = name;
  }

  getLastName(): string {
    return this._lastName;
  }

  clear() {
    this._firstName = '';
    this._lastName = '';
  }
}
