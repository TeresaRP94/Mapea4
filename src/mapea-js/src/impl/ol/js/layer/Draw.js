/**
 * @module M/impl/layer/Draw
 */
import Exception from 'facade/js/exception/exception';
import { isFunction, isArray, isNullOrEmpty } from 'facade/js/util/Utils';
import OLLayerVector from 'ol/layer/Vector';
import OLSourceVector from 'ol/source/Vector';
import OLStyle from 'ol/style/Style';
import OLStyleFill from 'ol/style/Fill';
import OLStyleStroke from 'ol/style/Stroke';
import OLStyleCircle from 'ol/style/Circle';
import OLGeomPoint from 'ol/geom/Point';
import { get as getProj } from 'ol/proj';
import Layer from './Layer';
import FormatGeoJSON from '../format/GeoJSON';
import Map from '../Map';
/**
 * @classdesc
 * @api
 */
class Draw extends Layer {
  /**
   * @classdesc
   * Main constol.style.Stroke of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor() {
    super();

    /**
     * Currently drawn feature coordinate.
     * @private
     * @type {M.impl.format.GeoJSON}
     */
    this.geojsonFormatter_ = new FormatGeoJSON();

    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.name = 'drawLayer';

    /**
     * Selected features for this layer
     * @private
     * @type {Array<ol.Feature>}
     */
    this.selectedFeatures_ = [];

    // calls the super constructor
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  addTo(map) {
    this.map = map;

    this.ol3Layer = new OLLayerVector({
      source: new OLSourceVector({}),
      style: new OLStyle({
        fill: new OLStyleFill({
          color: 'rgba(0, 158, 0, 0.1)',
        }),
        stroke: new OLStyleStroke({
          color: '#fcfcfc',
          width: 2,
        }),
        image: new OLStyleCircle({
          radius: 7,
          fill: new OLStyleFill({
            color: '#009E00',
          }),
          stroke: new OLStyleStroke({
            color: '#fcfcfc',
            width: 2,
          }),
        }),
      }),
      zIndex: Map.Z_INDEX.WFS + 999,
    });
    // sets its visibility if it is in range
    if (this.options.visibility !== false) {
      this.setVisible(this.inRange());
    }
    const olMap = this.map.getMapImpl();
    olMap.addLayer(this.ol3Layer);
  }

  /**
   * This function checks if an object is equals
   * to this layer
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  selectFeatures(features) {
    this.selectedFeatures_ = features;

    // TODO: manage multiples features
    if (isFunction(this.selectedFeatures_[0].click)) {
      this.selectedFeatures_[0].click();
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  unselectFeatures() {
    if (this.selectedFeatures_.length > 0) {
      this.selectedFeatures_.length = 0;
      this.map.removePopup();
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {Array<Mx.Point>} coordinate
   * @api stable
   */
  drawPoints(points) {
    // checks if the param is null or empty
    if (isNullOrEmpty(points)) {
      Exception('No ha especificado ningún punto');
    }
    if (!isArray(points)) {
      points = [points];
    }
    let geojsons = this.pointsToGeoJSON_(points);
    this.drawGeoJSON(geojsons);
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {Array<Mx.Point>} coordinate
   * @api stable
   */
  drawGeoJSON(geojsons) {
    // checks if the param is null or empty
    if (isNullOrEmpty(geojsons)) {
      Exception('No ha especificado ningún GeoJSON');
    }
    if (!isArray(geojsons)) {
      geojsons = [geojsons];
    }

    // gets the projection
    let projection = getProj(this.map.getProjection().code);

    let features = [];
    geojsons.forEach((geojson) => {
      let formattedFeatures = this.geojsonFormatter_.readFeatures(geojson, {
        dataProjection: projection,
      });
      features = features.concat(formattedFeatures);
    });

    this.ol3Layer.getSource().addFeatures(features);
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {Array<Mx.Point>} coordinate
   * @api stable
   */
  drawFeatures(features) {
    // checks if the param is null or empty
    if (!isNullOrEmpty(features)) {
      if (!isArray(features)) {
        features = [features];
      }
      this.ol3Layer.getSource().addFeatures(features);
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {Array<Mx.Point>} coordinate
   * @api stable
   */
  removeFeatures(features) {
    // checks if the param is null or empty
    if (!isNullOrEmpty(features)) {
      if (!isArray(features)) {
        features = [features];
      }
      let olSource = this.ol3Layer.getSource();

      features.forEach(feature => {
        try {
          olSource.removeFeature(feature);
        } catch (err) {
          console.log(err);
          // the feature does not exist in the source
        }
      });
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {ol.Coordinate} coordinate
   * @api stable
   */
  getPoints(coordinate) {
    let features = [];
    let drawSource = this.ol3Layer.getSource();

    if (!isNullOrEmpty(coordinate)) {
      features = drawSource.getFeaturesAtCoordinate(coordinate);
    } else {
      features = drawSource.getFeatures();
    }

    return this.featuresToPoints_(features);
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    const olMap = this.map.getMapImpl();

    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.options = null;
    this.map = null;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof Draw) {
      equals = equals && (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   */
  pointsToGeoJSON_(points) {
    let geojsons = [];

    // gets the projection
    const projection = getProj(this.map.getProjection().code);

    geojsons = points.map((point) => {
      // properties
      const geojsonProperties = point.data;

      // geometry
      const pointGeom = new OLGeomPoint([point.x, point.y]);
      const geojsonGeom = this.geojsonFormatter_.writeGeometryObject(pointGeom, {
        dataProjection: projection,
      });

      // return geojson
      return {
        type: 'Feature',
        geometry: geojsonGeom,
        properties: geojsonProperties,
        click: point.click,
        showPopup: point.showPopup,
      };
    });

    return geojsons;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   */
  featuresToPoints_(points) {
    const features = [];

    return features;
  }
}

export default Draw;
