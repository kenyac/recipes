import { MapGeometryModel } from "./map-geometry.model";
import { MapPropertiesModel } from "./map-properties.model";

export interface MapFeaturesModel {
    type: string;
    id: string;
    properties: MapPropertiesModel;
    geometry: MapGeometryModel;
}