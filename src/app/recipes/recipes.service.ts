import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  containerStatus = new Subject<boolean>();

  constructor() { }

  updateContainerStatus(state: boolean) {
    this.containerStatus.next(state);
  }

  getContainerStatus() {
    return this.containerStatus.asObservable();
  }

  getRecipes(countryName: string) {

  }
}
