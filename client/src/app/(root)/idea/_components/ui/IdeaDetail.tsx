import * as React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const DetailIdea: React.FC = () => {
  const ideaDetails = [
    { label: 'Title', value: 'Innovative Project' },
    { label: 'Description', value: 'This is a groundbreaking idea that aims to revolutionize the industry.' },
    { label: 'Author', value: 'John Doe' },
    { label: 'Date', value: 'February 25, 2025' },
    { label: 'Category', value: 'Technology' },
    { label: 'Impact', value: 'High' },
    { label: 'Investment Needed', value: '$500,000' },
    { label: 'Stage', value: 'Prototype' },
    { label: 'Target Audience', value: 'Startups & Enterprises' },
    { label: 'Market Size', value: '$10B' },
    { label: 'Team Members', value: '5' },
    { label: 'Timeline', value: '6 months' },
    { label: 'Key Challenges', value: 'Market adoption & funding' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '20px' }}>Detail Idea</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: '30%', fontWeight: 'bold', color: '#333' }}>Field</TableHead>
            <TableHead style={{ color: '#333' }}>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ideaDetails.map((detail, index) => (
            <TableRow key={index}>
              <TableCell style={{ fontWeight: 'bold', color: '#555' }}>{detail.label}:</TableCell>
              <TableCell style={{ color: '#555' }}>{detail.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailIdea;