import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON'
import { Layer as LayerBase, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Feature } from 'ol'
import { borders } from './borders'
import { Style, Stroke, Fill } from 'ol/style'
import { transformExtent } from 'ol/proj'
import { defaults as defaultInteractions } from 'ol/interaction'
import { isNotion } from './is-notion'
import { interpolateColor } from './interpolate-color'
import { getMaxViolation, IViolations, ViolationFilters } from './violation'
import Overlay from 'ol/Overlay'

const DEFAULT_CENTER = isNotion()
  ? [11100615.486625966, 11225419.476960883]
  : [11811200.657045184, 10877122.707841385]
const DEFAULT_ZOOM = isNotion() ? 2.35 : 2.96
const DEFAULT_EXTENT = transformExtent([-140, 5, 322, 85], 'EPSG:4326', 'EPSG:3857')

export function buildTooltipHTML(groups: any, region: string): string {
  const slicedGroups = Object.entries(groups)
  if (slicedGroups.length) {
    return `
      <div class="tooltip-container">
        <div class="tooltip-header"> ${region} </div>
        <ul>
        ${slicedGroups
          .map(
            ([key, size]) => `<li> 
          <span class="tooltip-item-key">${key}:&nbsp;</span>
          <span class="tooltip-item-size">${size} </span> 
        </li>`,
          )
          .join('')}
        </ul>
      </div>
    `
  }

  return `
    <div class="tooltip-container">
      <div class="tooltip-header"> ${region} </div>
    </div>
  `
}

export function createStyle(violations: IViolations, filters: Partial<ViolationFilters>) {
  const heatMapStyle = (feature) => {
    let currentViolations = violations[feature.get('region')] || []

    return new Style({
      fill: new Fill({
        color: interpolateColor(currentViolations?.length || 0, getMaxViolation(violations)[0]),
      }),
      stroke: new Stroke({
        color: '#fff',
        width: filters.region === feature.get('region') ? 3 : 2,
      }),
    })
  }

  return heatMapStyle
}

export function createLayer() {
  const geoJsonFormat = new GeoJSON()
  const vectorSource = new VectorSource<Feature>({
    features: geoJsonFormat.readFeatures(borders, {
      featureProjection: 'EPSG:3857',
    }) as Feature[],
  })

  return new VectorLayer({
    source: vectorSource,
  })
}

export function createMap(layers: LayerBase) {
  return new Map({
    target: 'map',
    layers: [layers],
    view: new View({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      extent: DEFAULT_EXTENT,
    }),
    interactions: defaultInteractions({
      mouseWheelZoom: false,
    }),
  })
}

export function createTooltip(map: Map, violations: IViolations) {
  const overlay = new Overlay({
    element: document.getElementById('popup'),
  })
  map.addOverlay(overlay)
  const visivleOverlay = (event) => {
    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature)
    if (feature && overlay.getElement()) {
      const currentViolations = violations[feature.get('region') as keyof typeof violations] || []
      const groups = {}
      for (const violation of currentViolations) {
        if (groups[violation.type] === undefined) {
          groups[violation.type] = 0
        }
        groups[violation.type] += 1
      }
      overlay.getElement().innerHTML = buildTooltipHTML(groups, feature.get('region'))
      overlay.setPosition(event.coordinate.map((c) => c + 25))
      overlay.setOffset([-20, -(60 + Object.keys(groups).length * 20)])
    } else {
      overlay.setPosition(undefined)
    }
  }

  map.on('pointermove', visivleOverlay)

  return () => {
    map.un('pointermove', visivleOverlay)
  }
}
