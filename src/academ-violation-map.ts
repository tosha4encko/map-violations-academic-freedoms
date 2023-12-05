import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON'
import { Layer as LayerBase, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Feature } from 'ol'
import { borders } from './borders'
import { ViolationRegions, violation } from './violation'
import { Style, Stroke, Fill } from 'ol/style'
import Overlay from 'ol/Overlay'
import { transformExtent } from 'ol/proj'
import { defaults as defaultInteractions } from 'ol/interaction'

const DEFAULT_CENTER = [11811200.657045184, 10877122.707841385]
const DEFAULT_ZOOM = 2.96
const DEFAULT_EXTENT = transformExtent([-10, 40, 210, 81.9], 'EPSG:4326', 'EPSG:3857')

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

export function createStyle(region?: ViolationRegions) {
  const heatMapStyle = (feature) => {
    const currentViolations = violation[feature.get('region')]
    const intensity = currentViolations?.length || 0
    const opacity = intensity / 5
    const fillColor = `rgba(255, ${Math.round(255 - 255 * opacity)}, ${Math.round(
      255 - 255 * opacity,
    )}, ${opacity})`

    return new Style({
      fill: new Fill({
        color: fillColor,
      }),
      stroke: new Stroke({
        color: '#101010',
        width: region === feature.get('region') ? 3 : 2,
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

export function createTooltip(map: Map) {
  const overlay = new Overlay({
    element: document.getElementById('popup'),
    autoPan: true,
  })

  map.addOverlay(overlay)

  map.on('pointermove', (event) => {
    const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature)
    if (feature) {
      const currentViolations = violation[feature.get('region') as keyof typeof violation] || []
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
  })
}
