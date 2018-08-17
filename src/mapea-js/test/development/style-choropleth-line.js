import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleChoropleth from 'facade/js/style/Choropleth';
import * as StyleQuantification from 'facade/js/style/Quantification';

const mapjs = map({
  controls: ['layerswitcher'],
  container: 'map',
});

const wfs = new WFS({
  namespace: 'mapea',
  name: 'mapb_hs1_100',
  url: 'http://clientes.guadaltel.es/desarrollo/geossigc/ows?',
  legend: 'Prestaciones - Ámbito municipal',
});

mapjs.addLayers([wfs]);
const stylechoropleth = new StyleChoropleth('gid', ['#ff0aee', '#040fef'], StyleQuantification.JENKS(3));
wfs.setStyle(stylechoropleth);

window.mapjs = mapjs;
