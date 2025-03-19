'use client'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { FaFilter, FaSort } from 'react-icons/fa'

interface LabelItem {
  text: string
  index: number
}

const labelItems: LabelItem[] = [
  { text: 'Overdue', index: 1 },
  { text: 'Submitted', index: 2 },
  { text: 'Following', index: 3 },
  { text: 'In Progress', index: 4 },
  { text: 'All', index: 5 },
  { text: 'Sort', index: 6 },
  { text: 'Filter', index: 7 }
]

interface ExampleUsageProps {
  setIsFilterOpen?: React.Dispatch<React.SetStateAction<boolean>>
  onFilterChange: (selectedLabels: string[]) => void
}

const ExampleUsage: React.FC<ExampleUsageProps> = ({ onFilterChange, setIsFilterOpen }) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([5]) // Default to 'All' selected (index 5)

  // Handle label selection
  const handleLabelClick = (index: number) => {
    let updatedIndices: number[] = []

    // Special handling for 'All' (index 5)
    if (index === 5) {
      // If 'All' is clicked, select only 'All' and deselect others
      updatedIndices = selectedIndices.includes(5) ? [] : [5]
    } else if (index === 6 || index === 7) {
      // Special handling for Sort and Filter buttons
      if (index === 7 && setIsFilterOpen) {
        setIsFilterOpen(true)
      }
      // Don't modify selectedIndices for Sort/Filter
      return
    } else {
      // For other status labels:
      // If already selected, deselect it
      if (selectedIndices.includes(index)) {
        updatedIndices = selectedIndices.filter((i) => i !== index)
      } else {
        // If not selected, add it and remove 'All' if present
        updatedIndices = [...selectedIndices.filter((i) => i !== 5), index]
      }
    }

    setSelectedIndices(updatedIndices)

    // Get text values of selected indices (excluding Sort and Filter)
    const selectedLabels = updatedIndices
      .map((i) => {
        const item = labelItems.find((item) => item.index === i)
        return item ? item.text : ''
      })
      .filter(Boolean)

    // Pass selected labels to parent
    onFilterChange(selectedLabels)
  }

  // Initialize with 'All' filter
  useEffect(() => {
    onFilterChange(['All'])
  }, [onFilterChange])

  return (
    <div className='flex space-x-2 mb-4'>
      {labelItems.map(({ text, index }) => (
        <Label
          key={index}
          className={`cursor-pointer rounded-md flex items-center justify-center py-2 px-4 ${
            text === 'Sort' || text === 'Filter'
              ? ''
              : `border ${
                  selectedIndices.includes(index)
                    ? 'border-blue-500 bg-blue-100 text-blue-700 font-bold'
                    : 'border-gray-300 text-gray-700'
                }`
          }`}
          onClick={() => handleLabelClick(index)}
        >
          {/* Display number only for status labels */}
          {text !== 'Sort' && text !== 'Filter' && (
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded text-center ${
                selectedIndices.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              } font-bold mr-2`}
            >
              {index}
            </span>
          )}
          {text}
          {text === 'Sort' && <FaSort className='text-black-500 text-sm ml-auto' />}
          {text === 'Filter' && <FaFilter className='text-black-500 text-sm ml-auto' />}
        </Label>
      ))}
    </div>
  )
}

export default ExampleUsage
