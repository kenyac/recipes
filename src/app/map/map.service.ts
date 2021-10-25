import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
  constructor(private http: HttpClient){

    }
    getMap(): Observable<any> {
        return this.http.get<any>(this.mapUrl);
    }

}
