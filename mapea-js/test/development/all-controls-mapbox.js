import { map } from 'M/mapea';

window.map = map({
  container: 'map',
  controls: ['scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'overviewmap', 'location'],
  getfeatureinfo: 'plain',
  layers: ['MAPBOX*mapbox.streets'],
  projection: 'EPSG:3857*m',
});
