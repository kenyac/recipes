import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  form: FormGroup;
  options = environment.countryArr;
  filteredOptions: string[] = [];
  displayDropdown = false;
  private navSearchListener = new Subject<string>();

  constructor() { 
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
  }

  getnavSearchListener() {
    return this.navSearchListener.asObservable();
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

}
