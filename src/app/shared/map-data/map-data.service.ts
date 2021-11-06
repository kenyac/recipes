import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { MapFeaturesModel } from './models/map-features.model';

@Injectable({
  providedIn: 'root'
})
export class MapDataService {
  private mapUrl = '../assets/json/countries-110m.json';
  private mapFeaturesUrl = '../assets/json/mapFeatures.json'
  constructor(private http: HttpClient) { }

  getMapFeatures() {
    return this.http.get<MapFeaturesModel[]>(this.mapFeaturesUrl);
  }

  getMap() {
    return this.http.get(this.mapUrl);
}
}
