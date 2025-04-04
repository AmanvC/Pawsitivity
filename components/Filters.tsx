import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

type TFilterProps = {
  filters: {label: string, value: string}[];
  onFilterChange: (filters: TFilterDataType) => void;
}

export type TFilterDataType = {label: string, value: string, isSelected: boolean}[];

const Filters = ({ filters, onFilterChange }: TFilterProps) => {
  const [filterValues, setFilterValues] = useState<TFilterDataType>([]);

  useEffect(() => {
    setFilterValues(filters.map(filter => ({...filter, isSelected: false})));
  }, [filters])

  const onFilterSelect = (value: string, select: boolean) => {
    const updatedFilters = filterValues.reduce((acc, curr) => {
      if(curr.value === value) acc.push({...curr, isSelected: select});
      else acc.push(curr);
      return acc;
    }, [] as TFilterDataType);
    onFilterChange(updatedFilters);
    setFilterValues(updatedFilters);
  }

  return (
    <View className='flex flex-row gap-2 flex-wrap'>
     {filterValues.map((filter, index) => (
        <View key={index} className={`px-3 py-2 rounded-lg flex flex-row flex-wrap gap-2 items-center ${filter.isSelected ? 'bg-black-300' : 'bg-primary-100'}`}>
          <Text onPress={() => onFilterSelect(filter.value, !filter.isSelected)} className={`${filter.isSelected ? 'text-white' : 'text-black-300'}`}>{filter.label}</Text>
        </View>
     ))}
    </View>
  )
}

export default Filters

const styles = StyleSheet.create({
  filterComponentSelected: {
    backgroundColor: '#191D31',
    color: 'white'
  },
  filterComponentNotSelected: {
    backgroundColor: '#0061FF0A',
    color: '#191D31'
  }
})