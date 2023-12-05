import React from 'react'
import { violationMeta, ViolationRegions } from '../violation'
import { borders } from '../borders'
import { Select, DatePicker } from 'antd'
import dayjs from 'dayjs'

export const Filters = (props: {
  region: 'all' | ViolationRegions
  onRegionChange(e: ViolationRegions)
  category?: string
  onCategoryChange(value: string): void
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Select
        className="filters-item"
        placeholder="Все регионы"
        showSearch
        value={props.region}
        onSelect={props.onRegionChange}
      >
        <Select.Option value={undefined}>Все регионы</Select.Option>
        {borders.features.map((feature) => (
          <Select.Option key={feature.properties.region}>{feature.properties.region}</Select.Option>
        ))}
      </Select>
      <Select
        className="filters-item"
        placeholder="Все категории"
        showSearch
        value={props.category}
        onSelect={props.onCategoryChange}
      >
        <Select.Option value={undefined}>Все категории</Select.Option>
        {Array.from(violationMeta.types).map((type) => (
          <Select.Option key={type} value={type}>
            {type}
          </Select.Option>
        ))}
      </Select>
      <div className="filters-item">
        <DatePicker.RangePicker
          defaultValue={[dayjs(violationMeta.minDate), dayjs(violationMeta.maxDate)]}
        />
      </div>
    </div>
  )
}
