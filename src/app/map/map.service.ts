import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MapFeaturesModel } from '../shared/map-data/models/map-features.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private clickListener = new Subject<MapFeaturesModel>();
  constructor(){ }
  
  updateClickListener(feature: MapFeaturesModel) {
    this.clickListener.next(feature);
  }

  getClickListener() {
    return this.clickListener.asObservable();
  }

}
