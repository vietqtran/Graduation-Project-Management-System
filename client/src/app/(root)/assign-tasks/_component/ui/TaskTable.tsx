"use client";

import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface Task {
  id: number;
  status: string;
  amount: number;
  customer: string;
  site: string;
  date: string;
  scheduled: string;
  assignedTo: string;
}

interface TaskTableProps {
  tasks: Task[];
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Site</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Scheduled</TableHead>
          <TableHead>Assigned To</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.status}</TableCell>
            <TableCell>${task.amount}</TableCell>
            <TableCell>{task.customer}</TableCell>
            <TableCell>{task.site}</TableCell>
            <TableCell>{task.date}</TableCell>
            <TableCell>{task.scheduled}</TableCell>
            <TableCell>{task.assignedTo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
