'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { SetStateAction, useState } from 'react';

export default function TopicSearchBar({ onOpenForm }: { onOpenForm: () => void }) {
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleSortChange = (value: SetStateAction<string>) => {
    setSortOrder(value);
  };

  const handleFilterChange = (value: SetStateAction<string>) => {
    setFilterCategory(value);
  };

  return (
    <div className="p-4 shadow-md rounded bg-white">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3">
          <Input type="text" placeholder="Tìm kiếm đề tài..."  />
        </div>
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Sắp xếp A-Z</SelectItem>
            <SelectItem value="desc">Sắp xếp Z-A</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Lọc danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="science">Khoa học</SelectItem>
            <SelectItem value="technology">Công nghệ</SelectItem>
            <SelectItem value="business">Kinh doanh</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onOpenForm} className="flex items-center w-full md:w-1/4">
          <PlusCircle className="mr-2" /> Gửi đề tài
        </Button>
      </div>
    </div>
  );
}
