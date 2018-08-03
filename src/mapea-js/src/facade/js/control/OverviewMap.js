import OverviewMapImpl from 'impl/control/OverviewMap';
import overviewmapTemplate from 'templates/overviewmap';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';

export default class OverviewMap extends ControlBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GetFeatureInfo
   * control to provides a popup with information about the place
   * where the user has clicked inside the map.
   *
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api stable
   */
  constructor(options = {}) {
    // implementation of this control
    const impl = new OverviewMapImpl(options);
    // calls the super constructor
    super(impl, OverviewMap.NAME);

    if (isUndefined(OverviewMapImpl)) {
      Exception('La implementación usada no puede crear controles OverviewMap');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api stable
   */
  createView(map) {
    return Template.compile(overviewmapTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  equals(obj) {
    const equals = (obj instanceof OverviewMap);
    return equals;
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api stable
 */
OverviewMap.NAME = 'overviewmap';
