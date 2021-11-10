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

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  animations: [
    trigger('displayContainer', [
      transition(':enter',[
        style({marginTop: '0px'}),
        animate('750ms ease-in-out', style({
          marginTop: 'calc(-100vh + 54px)'}))
      ]),
      transition(':leave',[
        animate('750ms ease-in-out', style({marginTop: '0px'}))
      ])
    ])
  ]
})
export class RecipesComponent implements OnInit, OnDestroy {  
  displayRecipes: boolean = false;
  private recipeContainerSub!: Subscription;

  constructor(private recipeService: RecipesService) { }

  ngOnInit(): void {
    this.recipeContainerSub = this.recipeService.getContainerStatus().subscribe({
      next: data => {
        this.displayRecipes = data;
        console.log(this.displayRecipes);
      }
    })
  }

  closeContainer(event: MouseEvent) {
    event.stopPropagation();
    this.displayRecipes = false;
  }

  ngOnDestroy() {
    this.recipeContainerSub.unsubscribe();
  }


}
