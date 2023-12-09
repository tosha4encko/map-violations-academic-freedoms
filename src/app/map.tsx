import React, { useEffect, useState } from 'react'
import { Map, Feature } from 'ol'
import { createLayer, createMap, createStyle, createTooltip } from '../academ-violation-map'
import { FeatureLike } from 'ol/Feature'
import { ViolationRegions } from '../violation'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import dayjs from 'dayjs'
import { isNotion } from '../is-notion'

export function AcademViolationMap(props: {
  region?: ViolationRegions
  category?: string
  range?: [dayjs.Dayjs, dayjs.Dayjs]
  onSelectFeature(feature?: FeatureLike): void
}) {
  const [_, setMap] = useState<Map>()
  const [vectorLayer, setVectorLayer] = useState<VectorLayer<VectorSource<Feature>>>()

  useEffect(() => {
    const layer = createLayer()
    layer.setStyle(createStyle(props.category))
    const map = createMap(layer)
    createTooltip(map)
    // @ts-ignore
    window.map = map
    setMap(map)
    setVectorLayer(layer)

    map.on('click', (ev) => {
      const features = map.getFeaturesAtPixel(ev.pixel)
      if (features?.length) {
        props.onSelectFeature(features[0])
        props.onSelectFeature(features[0])
      } else {
        props.onSelectFeature()
        layer.setStyle(createStyle(props.category))
      }
    })
  }, [])

  useEffect(() => {
    if (vectorLayer !== undefined) {
      vectorLayer.setStyle(createStyle(props.category, props.region, props.range))
    }
  }, [props, vectorLayer])

  return (
    <div
      id="map"
      style={{ width: isNotion() ? 800 : 1000, height: isNotion() ? 400 : 600, margin: '0 auto' }}
    >
      <div id="popup"></div>
    </div>
  )
}
