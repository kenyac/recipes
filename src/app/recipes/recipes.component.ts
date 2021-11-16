import { Component, ElementRef, HostBinding, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { RecipesService } from './recipes.service';
import { Subscription } from 'rxjs';
import { RecipeModel } from './recipes.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  animations: [
    trigger('displayContainer', [
      state('open', style({
        marginTop: '0'
      })),
      state('closed', style({
        marginTop: '100vh'
      })),
      state('visible', style({
        position: 'static'
      })),
      transition('* => open',[
        style({marginTop: '100vh'}),
        animate('750ms ease-in-out', style({
          marginTop: '0'}))
      ]),
      transition('open => *',[
        style({marginTop: '0'}),
        animate('750ms ease-in-out', style({
          marginTop: '100vh'}))
      ]),
    ])
  ]
})
export class RecipesComponent implements OnInit, OnDestroy {  
  displayRecipes: boolean = false;
  visible = false;
  state: string = '';
  recipeList!: RecipeModel[];
  private recipeContainerSub!: Subscription;

  constructor(private recipeService: RecipesService) { }

  ngOnInit(): void {
    this.recipeContainerSub = this.recipeService.getContainerStatus().subscribe({
      next: data => {
        this.displayRecipes = data.state;
        this.recipeList = data.recipes;
        if(!this.visible) this.state = this.displayRecipes ? 'open' : 'closed';
      }
    })
    if(window.innerWidth >= 1200) {
      this.visible = true;
      this.state = 'visible'
    }
    else {
      this.state = 'closed';
    }
  }

  closeContainer(event: MouseEvent) {
    event.stopPropagation();
    this.state = 'closed';
    this.displayRecipes = false;
  }

  ngOnDestroy() {
    this.recipeContainerSub.unsubscribe();
  }


}
