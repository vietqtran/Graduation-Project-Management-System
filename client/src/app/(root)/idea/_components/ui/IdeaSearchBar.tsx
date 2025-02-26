"use client";

import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const IdeaSearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <Input
      type="text"
      placeholder="Search projects..."
      className="w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default IdeaSearchBar;
