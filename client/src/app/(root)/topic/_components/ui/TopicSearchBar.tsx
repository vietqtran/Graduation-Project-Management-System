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
          <Input type="text" placeholder="Search topics..."  />
        </div>
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Sort A-Z</SelectItem>
            <SelectItem value="desc">Sort Z-A</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="Filter category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onOpenForm} className="flex items-center w-full md:w-1/4">
          <PlusCircle className="mr-2" /> Submit Topic
        </Button>
      </div>
    </div>
  );
}
