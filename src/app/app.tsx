import React, { useState } from 'react'
import { AcademViolationMap } from './map'
import { IViolation, violation, ViolationRegions, violationTypes } from '../violation'
import { ViolationsTable } from './violations-table'
import { Filters } from './filters'

export const App = () => {
  const [region, setRegion] = useState<ViolationRegions>()
  const [category, setCategory] = useState<string>()
  const violations: IViolation[] = region ? violation[region] : []

  return (
    <div className="app-container">
      <h2 style={{ textAlign: 'center', fontSize: 27 }}>Карта нарушений академических свобод</h2>
      <h4 style={{ textAlign: 'center', fontSize: 13, color: 'rgba(16,16,16,.6)' }}>
        Информация актуальна на декабрь 2023
      </h4>
      <Filters
        region={region}
        onRegionChange={setRegion}
        category={category}
        onCategoryChange={setCategory}
      />
      <AcademViolationMap
        region={region}
        onSelectFeature={(feature) => setRegion(feature.get('region'))}
        category={category}
      />
      {violations?.length ? (
        <ViolationsTable region={region} violations={violations || []} category={category} />
      ) : null}
    </div>
  )
}
