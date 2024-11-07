import * as L from 'leaflet';

declare module 'leaflet' {
  function polylineDecorator(
    polyline: L.Polyline | L.Polyline[],
    options?: any
  ): L.Layer;

  namespace Symbol {
    function arrowHead(options: any): any;
    // You could add other symbols here if needed, like 'dash' or 'marker'
  }
}
