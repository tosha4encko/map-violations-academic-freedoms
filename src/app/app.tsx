import React, { useState } from 'react'
import { AcademViolationMap } from './map'
import { FeatureLike } from 'ol/Feature'
import { IViolation, violation } from '../violation'
import { ViolationsTable } from './violations-table'

export const App = () => {
  const [feature, setFeature] = useState<FeatureLike>()
  const region = feature?.get('region')
  const violations: IViolation[] = region ? violation[region] : []

  return (
    <div className="app-container">
      <h2 style={{ textAlign: 'center', fontSize: 27 }}>Карта нарушений академических свобод</h2>
      <h4 style={{ textAlign: 'center', fontSize: 13, color: 'rgba(16,16,16,.6)' }}>
        Информация актуальна на декабрь 2023
      </h4>
      <AcademViolationMap onSelectFeature={setFeature} />
      {violations?.length ? (
        <ViolationsTable region={region} violations={violations || []} />
      ) : null}
    </div>
  )
}
