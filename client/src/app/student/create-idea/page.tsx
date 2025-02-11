import React from 'react';
export default function CreateIdea() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300">
      <h2 className="text-xl font-semibold text-center">Create New Project</h2>

      {/* Classification */}
      <div className="mt-4">
        {/* <h3 className="text-sm font-semibold text-blue-700">
          How Would You Classify This Project?
        </h3> */}
        <div className="mt-2 flex justify-between text-sm text-gray-700">
          <div>
            <span className="font-semibold">Profession:</span>{" "}
            Information Technology (K15 trở đi)
          </div>
          <div>
            <span className="font-semibold">Specialty:</span>{" "}
            Software Engineering (JS)
          </div>
        </div>
      </div>

      {/* English Title */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">English Title *</label>
        <input
          type="text"
          className="w-full border p-2 rounded-md mt-1"
          placeholder="What's your idea?"
        />
        {/* <p className="text-xs text-blue-600 mt-1">
          Do you know a short title can help you quickly catch attention?
        </p> */}
      </div>

      {/* Abbreviation */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">
          Abbreviations for Title *
        </label>
        <p className="text-xs text-gray-500">
          Abbreviation must be less than 20 characters
        </p>
        <input
          type="text"
          className="w-full border p-2 rounded-md mt-1"
          placeholder="Enter the abbreviations for your title"
        />
      </div>

      {/* Vietnamese Title */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">Vietnamese Title *</label>
        <input
          type="text"
          className="w-full border p-2 rounded-md mt-1"
          placeholder="What's your idea in Vietnamese?"
        />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">Description *</label>
        <textarea
          className="w-full border p-2 rounded-md mt-1 h-24"
          placeholder="Describe your idea"
        ></textarea>
      </div>

      {/* Project Tags */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">
          Project Tags (Up to 10)
        </label>
        <input
          type="text"
          className="w-full border p-2 rounded-md mt-1"
          placeholder="Input then press enter to add tags"
        />
      </div>

      {/* Team Members */}
      <div className="mt-6">
        <label className="font-semibold text-gray-700">Team Members</label>
        <p className="text-sm text-gray-600 mt-1">Existed Members</p>
        <div className="mt-2 flex items-center space-x-4 border p-3 rounded-md">
          <img
            src="https://via.placeholder.com/40"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">thainhtel50042@fpt.edu.vn</p>
            <p className="text-xs text-gray-500">Owner</p>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md cursor-not-allowed">
        Create
      </button>
    </div>
  );
};