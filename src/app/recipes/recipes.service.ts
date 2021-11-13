import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecipeModel } from './recipes.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  containerStatus = new Subject<{state: boolean, recipes: RecipeModel[]}>();

  constructor(private http: HttpClient) { }

  updateContainerStatus(state: boolean, countryName: string) {
    countryName === '' ? this.containerStatus.next({state: state, recipes: []}) : this.http.get<{name: string, recipes: RecipeModel[]}[]>('../assets/json/recipes.json')
                                .pipe(map(data => data.filter((data) =>  data.name === countryName)))
                                .subscribe(
                                  data => {
                                    this.containerStatus.next({state: state, recipes: data.length == 0 ? []: data[0].recipes});
                                  }
                                );
    }

  getContainerStatus() {
    return this.containerStatus.asObservable();
  }

  getRecipes(countryName: string) {

  }
}
