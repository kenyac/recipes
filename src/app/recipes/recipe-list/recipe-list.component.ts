import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { RecipeModel } from '../recipes.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Input() recipe!: RecipeModel;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChange) {
  }

  click() {
    window.location.href = this.recipe.recipe_link;
  }

}
