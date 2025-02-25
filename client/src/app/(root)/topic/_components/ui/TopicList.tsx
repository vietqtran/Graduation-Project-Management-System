import React from 'react';

const topics = [
  { id: 1, name: 'Machine Learning Basics', description: 'Introduction to machine learning concepts and algorithms.' },
  { id: 2, name: 'Cybersecurity Essentials', description: 'Fundamental principles of cybersecurity and risk management.' },
  { id: 3, name: 'Web Development with React', description: 'Building modern web applications using React.js.' },
  { id: 4, name: 'Data Science & Analytics', description: 'Exploring data processing, visualization, and analysis techniques.' },
  { id: 5, name: 'Game Development with Unity', description: 'Creating interactive games using Unity and C#.' }
];

const TopicList = () => {
  return (
    <div className="w-96 flex flex-col gap-2 p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Available Topics</h2>
      {topics.map((topic) => (
        <div key={topic.id} className="p-2 border rounded-lg bg-gray-100">
          <h3 className="font-medium">{topic.name}</h3>
          <p className="text-sm text-gray-600">{topic.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TopicList;