import React from 'react';

const majors = [
  { id: 1, name: 'Software Engineering', description: 'Focuses on software development and architecture.' },
  { id: 2, name: 'Information Security', description: 'Covers cybersecurity, encryption, and network security.' },
  { id: 3, name: 'Information Systems', description: 'Combines business and technology to manage information.' },
  { id: 4, name: 'Artificial Intelligence', description: 'Explores machine learning, robotics, and data science.' },
  { id: 5, name: 'Digital Art & Design', description: 'Blends creativity with digital tools for multimedia design.' }
];

const MajorSelection = () => {
  return (
<div className="w-1/3 border rounded-lg p-2 self-start flex flex-col gap-2 p-4">
      <h2 className="text-lg font-semibold mb-2">Select Your Major</h2>
      {majors.map((major) => (
        <button
          key={major.id}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {major.name}
        </button>
      ))}
    </div>
  );
};

export default MajorSelection;