import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';
import * as topojson from 'topojson-client';
import { HeaderService } from '../header/header.service';
import { RecipesService } from '../recipes/recipes.service';
import { MapDataService } from '../shared/map-data/map-data.service';
import { MapService } from './map.service';

//in the html file you should attach the click handler to the parent and determine where to zoom from the click target
//having that many click listeners is inefficient


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  private clickListenerSub!: Subscription;
  scaleFactor: number = 200;
  activeCountry: string = '';
  //these will stay as any until I find the right typescript types that allow this code to work
  svg!: d3.Selection<SVGElement, unknown, HTMLElement, any>;
  path!: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  transform: any;
  zoom: any;
  mapFeatures: any = {};
  mesh: any = {};
  private countries: any;
  scrHeight: number = 0;
  scrWidth: number = 0;
  svgDimensions: Record<string, string> = {};
  
/*
  xStart: number = 0;
  xOffset: number = 0;
  yStart: number = 0;
  yOffset: number = 0;
  draggable: boolean = false;

  start: DOMHighResTimeStamp = -1;
  previousTimestamp: DOMHighResTimeStamp = -1
  transformDest: any = {};
  */

  constructor(private mapService: MapService, 
              private headerService: HeaderService, 
              private mapDataService: MapDataService,
              private recipeService: RecipesService) { 
    this.getScreenSize();
  }

  setSVGDimensions(){
    this.svgDimensions = {
      'height': this.scrHeight.toString() + 'px',
      'width': this.scrWidth.toString() + 'px'
    };
  }

  @HostListener('window:resize', ['event'])
  getScreenSize(_event?: undefined){
    this.scrHeight = window.innerHeight - 54;
    this.scrWidth = window.innerWidth;
    if (window.innerWidth <= 460) {
      this.scaleFactor = 100;
    }
    else if(window.innerWidth <= 900){
      this.scaleFactor = 130;
    }

    if(window.innerWidth >= 1200) {
      this.scrWidth = (window.innerWidth * 3) / 4;
    }
  }

  /*
  @HostListener('window:mousemove', ['$event'])
  mousemove(event: any){
    if (this.draggable) {
      this.xOffset += event.pageX - this.xStart;
      this.xStart = event.pageX;
      this.yOffset += event.pageY - this.yStart;
      this.yStart = event.pageY;
      this.transform = 'translate(' + this.xOffset.toString() + ', ' + this.yOffset.toString() + ')';
    }
  }

  @HostListener('window:mouseup', ['$event'])
  mouseup(event: undefined){
    if (this.draggable) this.draggable = false;
  }
  */


  ngOnInit(): void {
    this.setSVGDimensions();
    this.clickListenerSub = this.mapService.getClickListener().subscribe({
      next: feature => {
        this.clicked(feature as d3.GeoPermissibleObjects, null);
      }
    });
    this.mapDataService.getMap().subscribe({
      next: data => {
        this.countries = data;
        this.mesh = topojson.mesh(this.countries, this.countries.objects.countries, function(a, b) { return a !== b; });
        let projection: d3.GeoProjection = d3.geoMercator().translate([this.scrWidth / 2, this.scrHeight / 2]).scale(this.scaleFactor);
       
        this.path = d3.geoPath().projection(projection);

        this.mapFeatures = topojson.feature(this.countries, this.countries.objects.countries);
        
        },
      complete: () => {  
        this.svg = d3.select<SVGElement, unknown>('.svgMapContainer'); 
        this.zoom = d3.zoom<SVGSVGElement, unknown>()
              .scaleExtent([1, 8])
              .on('zoom', this.zoomed.bind(this)); 
        this.svg.call(this.zoom);      
      }      
    });
  }
  zoomed(){
    this.transform = d3.event.transform;
  }

  reset() {
    this.activeCountry = ''
    this.headerService.updateNavSearchListener('');
    this.svg.transition()
    .duration(750)
    // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
    .call( this.zoom.transform, d3.zoomIdentity ); // updated for d3 v4  */
  }

  clicked(feature: any, event:any) {
    if (event) event.stopPropagation();
    if (this.activeCountry == feature.properties.name) { 
      if (!event) return;
      this.recipeService.updateContainerStatus(false, '');
      this.reset(); 
      return 
    }
    this.activeCountry = feature.properties.name;
    this.headerService.updateNavSearchListener(this.activeCountry);
    let bounds = this.path.bounds(feature),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / this.scrWidth, dy / this.scrHeight))),
    translate = [this.scrWidth / 2 - scale * x, this.scrHeight / 2 - scale * y];
    
    this.svg.transition()
        .duration(750)
        // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
        .call( this.zoom.transform as any, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) )
        .on('end', () => {
          //make request to json for recipes
          this.recipeService.updateContainerStatus(true, this.activeCountry);
        });
  }
  
  meshClick(event: any){
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.clickListenerSub.unsubscribe();
  }

/*
  mousedown(event: any) {
    this.draggable = true;
    event.stopImmediatePropagation();
    console.log("mousedown");
    console.log(event.view);
    this.xStart = event.clientX;
    this.yStart = event.clientY;
  }

  translateTo(timestamp: any){
    if (this.start === -1){
      this.start = timestamp
    }

    let elapsed = timestamp - this.start;

    if(this.previousTimestamp !== timestamp){
      const xTransform = (this.transformDest.x - this.xOffset) / 750;
      const yTransform = (this.transformDest.y - this.yOffset) / 750;
      this.transform = 'translate(' + (this.xOffset + elapsed*xTransform) + ', ' + (this.yOffset + elapsed*yTransform) + ')';
    }
    if(elapsed < 750) {
      console.log(elapsed);
      requestAnimationFrame(this.translateTo.bind(this))
    }
    else{
      this.start = -1
      this.previousTimestamp = -1
      this.xOffset = 0;
      this.yOffset = 0;
    }
}

  mousemove(event: any) {
    if (this.draggable) {
      console.log(event.pageX, event.pageY);
      this.xOffset += event.clientX - this.xStart;
      this.xStart = event.clientX;
      this.yOffset += event.clientY - this.yStart;
      this.yStart = event.clientY;
      this.transform = 'translate(' + this.xOffset.toString() + ', ' + this.yOffset.toString() + ')';
    }
  } */

}
