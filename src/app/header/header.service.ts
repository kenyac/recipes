import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private navSearchListener = new Subject<string>();

  constructor() { }

  updateNavSearchListener(countryName: string) {
    this.navSearchListener.next(countryName);
  }

  getNavSearchListener() {
    return this.navSearchListener.asObservable();
  }
}
