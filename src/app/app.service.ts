import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private repiceContainerListener = new Subject<boolean>();

  constructor() { }

  updateRecipeContainerListener(status: boolean) {
    this.repiceContainerListener.next(status)
  }

  getRecipeContainerListener() {
    return this.repiceContainerListener.asObservable();
  }
}
