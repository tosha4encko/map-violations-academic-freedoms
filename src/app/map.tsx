import React, { useEffect, useState } from 'react'
import { Map, Feature } from 'ol'
import { createLayer, createMap, createStyle, createTooltip } from '../academ-violation-map'
import { FeatureLike } from 'ol/Feature'
import { ViolationRegions } from '../violation'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'

export function AcademViolationMap(props: {
  region?: ViolationRegions
  onSelectFeature: (feature?: FeatureLike) => void
}) {
  const [_, setMap] = useState<Map>()
  const [vectorLayer, setVectorLayer] = useState<VectorLayer<VectorSource<Feature>>>()
  useEffect(() => {
    const layer = createLayer()
    layer.setStyle(createStyle())
    const map = createMap(layer)
    createTooltip(map)
    // @ts-ignore
    window.map = map
    setMap(map)

    map.on('click', (ev) => {
      const features = map.getFeaturesAtPixel(ev.pixel)
      if (features?.length) {
        props.onSelectFeature(features[0])
        props.onSelectFeature(features[0])
        setVectorLayer(layer)
      } else {
        props.onSelectFeature()
        layer.setStyle(createStyle())
      }
    })
  }, [])

  useEffect(() => {
    if (vectorLayer === undefined) {
      return
    }

    if (props.region === undefined) {
      vectorLayer.setStyle(createStyle())
    } else {
      vectorLayer.setStyle(createStyle(props.region))
    }
  }, [props.region, vectorLayer])

  return (
    <div id="map" style={{ width: 1000, height: 600, margin: '0 auto' }}>
      <div id="popup"></div>
    </div>
  )
}
