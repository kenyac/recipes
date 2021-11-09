import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
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
      state('closed', style({
        marginTop: '0px'
      })),
      state('open', style({
        marginTop: 'calc(-100vh + 54px)'
      })),
      transition('* => open',[
        animate('750ms ease-in-out')
      ]),
    ])
  ]
})
export class RecipesComponent implements OnInit, OnDestroy {
  containerTrigger: string = "closed";
  containerSub!: Subscription;

  constructor(private recipeService: RecipesService) { }

  ngOnInit(): void {
    this.containerSub = this.recipeService.getContainerTrigger().subscribe(
      state => {
        this.containerTrigger = state;
      }
    );
  }

  ngOnDestroy() {
    this.containerSub.unsubscribe();
  }


}
