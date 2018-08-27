import { map } from 'facade/js/mapea';
import WFSTControls from 'plugins/wfstcontrols/facade/js/wfstcontrols';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const plugin = new WFSTControls(['deletefeature', 'savefeature', 'drawfeature', 'editattribute']);

const wfs = new M.layer.WFS({
  namespace: 'callejero',
  name: 'prueba_pun_wfst',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
  geometry: 'POINT',
});
mapjs.addLayers(wfs);

mapjs.addPlugin(plugin);
