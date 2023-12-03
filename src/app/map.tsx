import React, { useEffect, useState } from 'react'
import { Map } from 'ol'
import { createLayer, createMap, createStyle, createTooltip } from '../academ-violation-map'
import { FeatureLike } from 'ol/Feature'

export function AcademViolationMap(props: { onSelectFeature: (feature: FeatureLike) => void }) {
  const [_, setMap] = useState<Map>()
  useEffect(() => {
    const layer = createLayer()
    layer.setStyle(createStyle())
    const map = createMap(layer)
    createTooltip(map)
    // @ts-ignore
    window.map = map
    setMap(map)

    map.on('click', (ev) => {
      debugger
      const features = map.getFeaturesAtPixel(ev.pixel)
      if (features?.length) {
        props.onSelectFeature(features[0])
        layer.setStyle(createStyle(features[0]))
      } else {
        layer.setStyle(createStyle())
      }
    })
  }, [])

  return (
    <div id="map" style={{ width: 1000, height: 600, margin: '0 auto' }}>
      <div id="popup"></div>
    </div>
  )
}
