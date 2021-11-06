import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MapService } from '../map/map.service';

import { MapDataService } from '../shared/map-data/map-data.service';
import { MapFeaturesModel } from '../shared/map-data/models/map-features.model';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  form: FormGroup;
  mapFeatures: MapFeaturesModel[] = [];
  filteredOptions: MapFeaturesModel[] = [];
  displayDropdown = false;
  private navSearchSub!: Subscription;

  constructor(private headerService: HeaderService, 
              private mapDataService: MapDataService,
              private mapService: MapService) { 
    this.form = new FormGroup({
    'countryName': new FormControl(null, {
      validators: [Validators.required]
    })
  });}

  ngOnInit() {
    this.mapDataService.getMapFeatures().subscribe({
      next: data => {
        this.mapFeatures = data;
      }
    });
    this.form.valueChanges.subscribe(value => {
      if (value.countryName !== '' && value.countryName !== undefined){
        this.displayDropdown = true;
        this.filteredOptions = this.performFilter(value.countryName);
      } else {
        this.hideDropdown();
      }
    });
    this.navSearchSub = this.headerService.getNavSearchListener().subscribe(
      countryName => {
        this.form.controls.countryName.setValue(countryName);
        this.hideDropdown();
      }
    );
  }

  hideDropdown() {
    this.displayDropdown = false;
  }

  performFilter(filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    return this.mapFeatures.filter((feature: MapFeaturesModel) =>
      feature.properties.name.toLocaleLowerCase().includes(filterBy));
  }

  selectCountry(feature: MapFeaturesModel, event: any) {
    this.form.controls.countryName.setValue(event.originalTarget.innerHTML);
    this.mapService.updateClickListener(feature);
  }

  ngOnDestroy() {
    this.navSearchSub.unsubscribe();
  }

}
