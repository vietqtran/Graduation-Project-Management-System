"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import React, { useState } from "react";

interface FilterBarProps {
  onSearch: (keyword: string) => void;
  onFilterChange: (filterData: {
    status?: string;
    taskType?: string;
    dateRange?: { start: string; end: string };
  }) => void;
  onClearFilter: () => void;
  onAddTask: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  onClearFilter,
  onAddTask,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState("all");
  const [taskType, setTaskType] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleFilterChange = () => {
    onFilterChange({
      status: status === "all" ? undefined : status,
      taskType: taskType === "all" ? undefined : taskType,
      dateRange: dateRange.start && dateRange.end ? dateRange : undefined,
    });
  };

  const handleClear = () => {
    setSearchValue("");
    setStatus("all");
    setTaskType("all");
    setDateRange({ start: "", end: "" });
    onClearFilter();
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <div className="flex gap-2">
        <Input
          value={searchValue}
          placeholder="Search by keyword"
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 w-[300px]"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <span>{status === "all" ? "All Status" : status}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="on progress">On Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={taskType} onValueChange={setTaskType}>
          <SelectTrigger>
            <span>{taskType === "all" ? "All Task Types" : taskType}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Task Types</SelectItem>
            <SelectItem value="standard">Standard Task</SelectItem>
            <SelectItem value="video-game">Video Games</SelectItem>
          </SelectContent>
        </Select>

          <Input
            type="date"
            value={dateRange.start}
            placeholder="Start Date"
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="flex-1"
          />
          <Input
            type="date"
            value={dateRange.end}
            placeholder="End Date"
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="flex-1"
          />

      <Button variant="default" size="sm" onClick={handleFilterChange}>
        Apply Filter
      </Button>

      <Button variant="outline" size="sm" onClick={handleClear}>
        Clear Filter
      </Button>
      </div>

   <div className="flex gap-2 justify-center items-center"> 
  <div className="flex flex-wrap gap-4 items-center justify-center"> {/* Thêm justify-center */}
    <Label className="text-center rounded-full border-2 border-red-500 p-2">Group 1 | SE</Label>
    <Label className="text-center rounded-full border-2 border-yellow-500 p-2">Group 2 | IT</Label>
    <Label className="text-center rounded-full border-2 border-blue-500 p-2">Group 3 | HR</Label>
    <Label className="text-center rounded-full border-2 border-green-500 p-2">Group 4 | Finance</Label>
    <Label className="text-center rounded-full border-2 border-orange-500 p-2">Group 5 | Marketing</Label>
  </div>

  <Button variant="secondary" size="sm" onClick={onAddTask}>
    Add Task
  </Button>
</div>

    </div>
  );
};

export default FilterBar;
