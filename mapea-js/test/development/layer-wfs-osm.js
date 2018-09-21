import { map } from 'M/mapea';
import WFS from 'M/layer/WFS';

const mapjs = map({
  container: 'map',
  layers: ['OSM'],
  projection: 'EPSG:3857*m',
  controls: ['layerswitcher'],
});

const wfs = new WFS({
  namespace: 'ggis',
  name: 'Colegios',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});


mapjs.addLayers([wfs]);
window.mapjs = mapjs;
