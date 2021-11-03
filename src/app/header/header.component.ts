import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  form: FormGroup;
  options = environment.countryArr;
  filteredOptions: string[] = [];
  displayDropdown = false;
  private navSearchSub!: Subscription;

  constructor(private headerService: HeaderService) { 
    this.form = new FormGroup({
    'countryName': new FormControl(null, {
      validators: [Validators.required]
    })
  });}

  ngOnInit() {
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
    return this.options.filter((option: string) =>
      option.toLocaleLowerCase().includes(filterBy));
  }

  selectCountry(event: any) {
    this.form.controls.countryName.setValue(event.originalTarget.innerHTML);
    document.getElementById(event.originalTarget.innerHTML)?.dispatchEvent(new Event('click'));
  }

  ngOnDestroy() {
    this.navSearchSub.unsubscribe();
  }

}
