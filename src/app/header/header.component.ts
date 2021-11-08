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
  activeFilteredOption = -1;
  tempInput = '';
  arrowKeyPressed: boolean = false;
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
      if (value.countryName !== '' && value.countryName !== undefined && !this.arrowKeyPressed){
        this.displayDropdown = true;
        this.activeFilteredOption = -1;
        this.filteredOptions = this.performFilter(value.countryName);
      } 
      else if(this.arrowKeyPressed){
        this.displayDropdown = true;
      }
      else {
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
    if (event.button === 2) return;
    this.form.controls.countryName.setValue(event.originalTarget.innerHTML);
    this.mapService.updateClickListener(feature);
  }

  onSubmit() {
    let submittedCountry: MapFeaturesModel = this.mapFeatures.filter((feature: MapFeaturesModel) =>
    feature.properties.name.toLocaleLowerCase() === this.form.value.countryName.toLocaleLowerCase())[0];
    if(submittedCountry) {
      this.mapService.updateClickListener(submittedCountry);
    }
    else {
      console.log('na');
      this.form.controls.countryName.setValue('');
    }
  }

  decrementOption() {
    if(this.activeFilteredOption === -1){
      this.tempInput = this.form.value.countryName;
      this.activeFilteredOption = this.filteredOptions.length -1;
      this.form.controls.countryName.setValue(this.filteredOptions[this.activeFilteredOption].properties.name);
    }
    else if (this.activeFilteredOption === 0){
      this.activeFilteredOption = -1
      this.form.controls.countryName.setValue(this.tempInput);
    }
    else {
      this.activeFilteredOption -= 1;
      this.form.controls.countryName.setValue(this.filteredOptions[this.activeFilteredOption].properties.name);
    }
  }

  incrementOption() {
    if (this.activeFilteredOption + 1 < this.filteredOptions.length){
      if (this.activeFilteredOption === -1) this.tempInput = this.form.value.countryName;
      this.activeFilteredOption += 1;
      this.form.controls.countryName.setValue(this.filteredOptions[this.activeFilteredOption].properties.name);
    }
    else {
      this.activeFilteredOption = -1
      this.form.controls.countryName.setValue(this.tempInput);
    };
  }

  keydown(event: any) {
    if (event.key === 'ArrowUp'){
      this.arrowKeyPressed = true;
      this.decrementOption();
      event.preventDefault();
    }
    else if (event.key=== 'ArrowDown'){
      this.arrowKeyPressed = true;
      this.incrementOption();
      event.preventDefault();
    }
    else {
      this.arrowKeyPressed = false;
    }
  }

  ngOnDestroy() {
    this.navSearchSub.unsubscribe();
  }

}
