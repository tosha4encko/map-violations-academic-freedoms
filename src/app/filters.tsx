import React, { useMemo } from 'react'
import { getMetaViolations, IViolations } from '../violation'
import { borders } from '../borders'
import { Select, DatePicker } from 'antd'
import dayjs from 'dayjs'
import { isNotion } from '../is-notion'

export const Filters = (props: {
  region: 'all' | string
  onRegionChange(e: string)
  category?: string
  onCategoryChange(value: string): void
  range?: [dayjs.Dayjs, dayjs.Dayjs]
  onRangeChange(range: [dayjs.Dayjs, dayjs.Dayjs]): void
  violations: IViolations
}) => {
  const meta = useMemo(() => getMetaViolations(props.violations), [props.violations])
  const interval: [dayjs.Dayjs, dayjs.Dayjs] = [dayjs(meta.minDate), dayjs(meta.maxDate)]

  if (!Object.keys(props.violations).length) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: isNotion() ? 0 : undefined,
      }}
    >
      <Select
        size={isNotion() ? 'small' : 'middle'}
        className={isNotion() ? 'filters-item notion' : 'filters-item'}
        placeholder="Все регионы"
        showSearch
        value={props.region}
        onSelect={props.onRegionChange}
        allowClear
        onClear={() => props.onRegionChange(undefined)}
      >
        {borders.features.map((feature) => (
          <Select.Option key={feature.properties.region}>{feature.properties.region}</Select.Option>
        ))}
      </Select>
      <Select
        size={isNotion() ? 'small' : 'middle'}
        className={isNotion() ? 'filters-item notion' : 'filters-item'}
        placeholder="Все категории"
        showSearch
        value={props.category}
        onSelect={props.onCategoryChange}
        allowClear
        onClear={() => props.onCategoryChange(undefined)}
      >
        {Array.from(meta.types).map((type) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
      <div className={isNotion() ? 'filters-item notion' : 'filters-item'}>
        <DatePicker.RangePicker
          size={isNotion() ? 'small' : 'middle'}
          value={props.range}
          onChange={props.onRangeChange}
          defaultValue={interval}
        />
      </div>
    </div>
  )
}
