var mapajs = M.map({
  'container': 'map',
  "controls": ["layerswitcher", "mouse", "scale", "overviewmap", "panzoombar", "scaleline", ],
  "getfeatureinfo": "plain"
});

var centros = new M.layer.WFS({
  name: "Centros ASSDA",
  url: "https://clientes.guadaltel.es/desarrollo/geossigc/wfs?",
  namespace: "mapea",
  name: "centrosassda_subtipo",
  legend: "cluster",
  getfeatureinfo: "plain",
  geometry: 'POINT',
  extract: true,
});

mapajs.addLayers(centros);

// CONFIGURACIÓN PARÁMETROS CLUSTER
var options = {
  ranges: [
    {
      min: 2,
      max: 3,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#a3c5d8',
          opacity: 0.2
        },
        radius: 20
      })
          },
    {
      min: 3,
      max: 5,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#6aa8da',
          opacity: 0.4
        },
        radius: 20
      })
          },
    {
      min: 5,
      max: 10,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#468cc4',
          opacity: 0.5
        },
        radius: 20
      })
          },
    {
      min: 10,
      max: 15,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#2160a6',
          opacity: 0.7
        },
        radius: 20
      })
          },
    {
      min: 15,
      max: 20,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa'
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.7
        },
        radius: 20
      })
          },
    {
      min: 20,
      max: 50000,
      style: new M.style.Point({
        stroke: {
          color: '#5789aa',
          width: 10
        },
        fill: {
          color: '#1c5fa1',
          opacity: 0.9
        },
        radius: 40
      })
          }
        ],
  // animated: true,
  // hoverInteraction: true,
  // displayAmount: true,
  // selectedInteraction: true,
  // distance: 80
};

var vendorParameters = {
  displayInLayerSwitcherHoverLayer: false,
  distanceSelectFeatures: 15
}

let clusterStyle = new M.style.Cluster(options, vendorParameters);

centros.on(M.evt.LOAD, function() {
  // centros.setStyle(subtipologiaStyle);
  centros.setStyle(clusterStyle);
});

centros.on(M.evt.SELECT_FEATURES, function(features) {
  features.forEach(function(feature) {
    //logFeature(feature);
    if (feature.getGeoJSON().properties.features) {
      //console.log('Es un cluster');
    }
    else {
      //console.log('Es un feature');
      // Creamos el html de la pestaña
      var fs = "<table width='500'>";
      var keys = Object.keys(feature.getGeoJSON().properties);
      //keys.remove("ogc_fid");
      keys.remove("concierto");
      keys.remove("xx");
      keys.remove("longitud");
      keys.remove("latitud");
      keys.remove("tipo");
      keys.forEach(function atributos(key) {
        if (feature.getAttribute(key) != "") {
          fs += '<tr><td>';
          fs += '\t<b>' + key + '</b>: ' + feature.getAttribute(key);
          fs += '</tr></td>';
        }
      });
      fs += '</table>';
      //console.log(fs);
      // Creamos un objeto tab
      var featureTabOpts = {
        'icon': 'g-cartografia-pin',
        'title': 'Información del Centro',
        'content': fs
      };
      // Creamos el Popup y le añadimos la pestaña
      popup = new M.Popup();
      popup.addTab(featureTabOpts);
      // Finalmente se añade al mapa, especificando las Coordenadas
      var coordenadas = feature.getGeometry().coordinates;
      //console.log(feature.getGeometry().coordinates);
      mapajs.addPopup(popup, coordenadas);

    }

  });
});

function toogleAnimate() {
  clusterStyle.setAnimated(!clusterStyle.isAnimated());
  let btn = document.getElementById("animateBtn");
  btn.innerText = btn.innerText.replace(/(true)|(false)$/i, '') + clusterStyle.isAnimated();
}
