import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { AcademViolationMap } from './map'
import { IViolation, IViolations, getViolations } from '../violation'
import { ViolationsTable } from './violations-table'
import { Filters } from './filters'
import { isNotion } from '../is-notion'
import { Spin } from 'antd'

export const App = () => {
  const [region, setRegion] = useState<string>()
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>()
  const [category, setCategory] = useState<string>()

  const [allViolations, setAllViolations] = useState<IViolations>({})
  const violations: IViolation[] = allViolations?.[region] || []

  useEffect(() => {
    getViolations().then((violations) => setAllViolations(violations))
  }, [setAllViolations])

  return (
    <div className={isNotion() ? 'app-container notion' : 'app-container'}>
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
        violations={allViolations}
      />
      <Spin spinning={!Object.keys(allViolations).length}>
        <AcademViolationMap
          range={range}
          region={region}
          onSelectFeature={(feature) => setRegion(feature?.get('region'))}
          category={category}
          violations={allViolations}
        />
      </Spin>
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
