import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  containerTrigger = new Subject<string>();

  constructor() { }

  updateContainerTrigger(state: string) {
    this.containerTrigger.next(state);
  }

  getContainerTrigger() {
    return this.containerTrigger.asObservable();
  }
}
