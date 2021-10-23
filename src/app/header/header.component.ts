import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  options = environment.countryArr;
  filteredOptions: string[] = [];
  displayDropdown = false;

  constructor() { }

  ngOnInit() {
  }

  hideDropdown() {
    this.displayDropdown = false;
  }

  showDropdown(model: NgModel) {
    if(model.viewModel !== ''){
      this.displayDropdown = true;
      this.filteredOptions = this.performFilter(model.viewModel);
    } else {
      this.hideDropdown();
    }
  }

  performFilter(filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    return this.options.filter((option: string) =>
      option.toLocaleLowerCase().includes(filterBy));
  }

}
