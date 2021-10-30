import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { HeaderService } from '../header/header.service';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {
  scaleFactor: number = 200;
  private countries: any;
  static scrHeight: number = 0;
  static scrWidth: number = 0;
  

  constructor(private mapService: MapService, private headerService: HeaderService) { 
    this.getScreenSize();
  }

  @HostListener('window:resize', ['event'])
  getScreenSize(_event?: undefined){
    MapComponent.scrHeight = window.innerHeight - 54;
    MapComponent.scrWidth = window.innerWidth;
    if (window.innerWidth <= 460) {
      this.scaleFactor = 100;
    }
  }

  ngOnInit(): void {
    this.headerService.updateNavSearchListener('North Korea');
    this.mapService.getMap().subscribe({
      next: data => {
        console.log(data);
        this.countries = data;
        let projection: d3.GeoProjection = d3.geoMercator().translate([MapComponent.scrWidth / 2, MapComponent.scrHeight / 2]).scale(this.scaleFactor);
        
        let active = d3.select(null);
        
        let svg = d3.select<SVGElement, unknown>('.map-container').append('svg')
          .attr('width', MapComponent.scrWidth)
          .attr('height', MapComponent.scrHeight);

        function reset() {
          active.classed("active", false);
          active = d3.select(null);
        
          svg.transition()
              .duration(750)
              // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
              .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
        }
          
        svg.append("rect")
          .attr("class", "background")
          .attr("width", MapComponent.scrWidth)
          .attr("height", MapComponent.scrHeight)
          .on("click", reset);

        const path = d3.geoPath().projection(projection);
        console.log(path);

        let mapFeatures : any = topojson.feature(this.countries, this.countries.objects.countries);
        console.log(mapFeatures.features);
      
        function clicked(this: any, d: any){
          if (active.node() === this) return reset();

          active.classed("active", false);
          active = d3.select(this).classed("active", true);

          let bounds = path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / MapComponent.scrWidth, dy / MapComponent.scrHeight))),
          translate = [MapComponent.scrWidth / 2 - scale * x, MapComponent.scrHeight / 2 - scale * y];

          svg.transition()
              .duration(750)
              // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
              .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
        }
        let g = svg.append("g");

        console.log(path(mapFeatures.features[0]));
        
        g.selectAll("path")
            .data(mapFeatures.features)
            .enter().append("path")
            .attr("id", function(d: any) {return d.properties.name})
            .attr("d", <d3.GeoPath<any,any>>path)
            .attr("class", "feature ")
            .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(this.countries, this.countries.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "mesh")
            .attr("d", <d3.GeoPath<any,any>>path);
                
        const zoom = d3.zoom<SVGSVGElement, unknown>()
              .scaleExtent([1, 8])
              .on('zoom', function() {
                  svg.selectAll('path')
                  .attr('transform', d3.event.transform);
        });

        

        svg.call(zoom);

      }      
    });
  }

}
