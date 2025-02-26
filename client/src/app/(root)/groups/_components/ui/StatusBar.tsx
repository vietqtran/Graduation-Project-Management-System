'use client'
import { Label } from '@/components/ui/label'; // Giả sử Label đã có sẵn trong thư mục này
import React, { useState } from 'react';
import { FaFilter, FaSort } from 'react-icons/fa'; // Import các biểu tượng filter và sort

interface LabelItem {
  text: string;
  index: number;
}

const labelItems: LabelItem[] = [
  { text: 'Overdue', index: 1 },
  { text: 'Submitted', index: 2 },
  { text: 'Following', index: 3 },
  { text: 'Working', index: 4 },
  { text: 'All', index: 5 },
  { text: 'Sort', index: 6 },
  { text: 'Filter', index: 7 },
];

interface ExampleUsageProps {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExampleUsage: React.FC<ExampleUsageProps> = () => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Hàm xử lý khi một label được chọn hoặc bỏ chọn
  const handleLabelClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      // Nếu label đã được chọn, bỏ chọn
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      // Nếu label chưa được chọn, thêm vào mảng selectedIndices
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  return (
    <div className="flex space-x-2 mb-4">
      {labelItems.map(({ text, index }) => (
        <Label
          key={index}
          className={`cursor-pointer rounded-md flex items-center justify-center py-2 px-4 ${text === 'Sort' || text === 'Filter' ? '' : `border ${selectedIndices.includes(index) ? 'border-blue-500 bg-blue-100 text-blue-700 font-bold' : 'border-gray-300 text-gray-700'}`}`}
          onClick={() => {
            handleLabelClick(index);
          }}
        >
          {/* Hiển thị số chỉ khi text không phải là 'Sort' hoặc 'Filter' */}
          {text !== 'Sort' && text !== 'Filter' && (
            <span 
              className={`inline-flex items-center justify-center w-6 h-6 rounded text-center ${selectedIndices.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} font-bold mr-2`}
            >
              {index}
            </span>
          )}
          {text}
          {text === 'Sort' && <FaSort className="text-black-500 text-sm ml-auto" />}
          {text === 'Filter' && 
              <FaFilter className="text-black-500 text-sm ml-auto" />
          }
        </Label>
      ))}
    </div>
  );
};

export default ExampleUsage;
