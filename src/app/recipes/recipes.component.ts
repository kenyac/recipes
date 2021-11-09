import { Component, ElementRef, HostBinding, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { RecipesService } from './recipes.service';
import { fromEvent, Subscription } from 'rxjs';

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
      transition('closed <=> open',[
        animate('750ms ease-in-out')
      ]),
    ])
  ]
})
export class RecipesComponent implements OnInit, OnDestroy {
  @ViewChild('recipeContainer')
  recipeContainer!: ElementRef;

  containerTrigger: string = "closed";
  containerSub!: Subscription;

  constructor(private recipeService: RecipesService,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.containerSub = this.recipeService.getContainerTrigger().subscribe(
      state => {
        this.containerTrigger = state;
      }
    );
  }

  closeContainer(event: MouseEvent) {
    event.stopPropagation();
    this.containerTrigger = 'closed';
  }

  ngOnDestroy() {
    this.containerSub.unsubscribe();
  }


}
