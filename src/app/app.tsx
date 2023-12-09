import React, { useState } from 'react'
import dayjs from 'dayjs'
import { AcademViolationMap } from './map'
import { IViolation, violation, ViolationRegions, violationTypes } from '../violation'
import { ViolationsTable } from './violations-table'
import { Filters } from './filters'
import { isNotion } from '../is-notion'

export const App = () => {
  const [region, setRegion] = useState<ViolationRegions>()
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>()
  const [category, setCategory] = useState<string>()
  const violations: IViolation[] = region ? violation[region] : []

  return (
    <div
      className="app-container"
      style={isNotion() ? { maxWidth: 950, maxHeight: 930, marginBottom: 0 } : undefined}
    >
      {!isNotion() ? (
        <>
          <h2 style={{ textAlign: 'center', fontSize: 27 }}>
            Карта нарушений академических свобод
          </h2>
          <h4 style={{ textAlign: 'center', fontSize: 13, color: 'rgba(16,16,16,.6)' }}>
            Информация актуальна на декабрь 2023
          </h4>
        </>
      ) : null}
      <Filters
        region={region}
        onRegionChange={setRegion}
        category={category}
        onCategoryChange={setCategory}
        range={range}
        onRangeChange={setRange}
      />
      <AcademViolationMap
        range={range}
        region={region}
        onSelectFeature={(feature) => setRegion(feature?.get('region'))}
        category={category}
      />
      {violations?.length ? (
        <ViolationsTable
          region={region}
          violations={violations || []}
          category={category}
          range={range}
        />
      ) : null}
    </div>
  )
}
