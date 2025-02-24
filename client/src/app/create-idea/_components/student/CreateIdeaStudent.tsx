"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/hooks';
import { set } from 'date-fns';
export default function CreateIdea() {
  const user = useAppSelector((state) => state.auth.user);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    major: '',
    field: '',
    campus: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  interface Major {
    _id: string;
    name: string;
  }

  interface Field {
    _id: string;
    name: string;
  }

  interface Campus {
    _id: string;
    name: string;
  }

  const [majors, setMajors] = useState<Major[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if(!user){
      setMessage('You need to login to create idea');
    }
    setLoading(true);
    setMessage('');
    try {
      const ideaData = {
        name : formData.name,
        description : formData.description,
        member : [user?._id],
        leader : user?._id,
      };
      const res = await axios.post('http://localhost:8080/api/idea/create-idea', ideaData, { withCredentials: true });
      setMessage("Project created successfully!");
      setFormData({ name: "", description: "" , major: "", field: "", campus: "" });
    }catch(err){
      setMessage('Something went wrong');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-md border border-gray-300">
      <h2 className="text-xl font-semibold text-center">Create New Project</h2>
      

      {/* Project Name */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">Project Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1"
          placeholder="Enter project name"
        />
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1 h-24"
          placeholder="Describe your project"
        ></textarea>
      </div>
    {/* Major Dropdown */}
    <div className="mt-4">
        <label className="font-semibold text-gray-700">Major *</label>
        <select
          name="major"
          value={formData.major}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1"
        >
          <option value="">Select Major</option>
          {majors.map((major) => (
            <option key={major._id} value={major._id}>
              {major.name}
            </option>
          ))}
        </select>
      </div>

      {/* Field Dropdown */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">Field *</label>
        <select
          name="field"
          value={formData.field}
          onChange={handleChange} 
          className="w-full border p-2 rounded-md mt-1"
        >
          <option value="">Select Field</option>
          {fields.map((field) => (
            <option key={field._id} value={field._id}>
              {field.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campus Dropdown */}
      <div className="mt-4">
        <label className="font-semibold text-gray-700">Campus *</label>
        <select
          name="campus"
          value={formData.campus}
          onChange={handleChange}
          className="w-full border p-2 rounded-md mt-1"
        >
          <option value="">Select Campus</option>
          {campuses.map((campus) => (
            <option key={campus._id} value={campus._id}>
              {campus.name}
            </option>
          ))}
        </select>
      </div>
      {/* Hiển thị thông tin user */}
      <div className="mt-4">
        <h3 className="font-semibold text-gray-700">Team Members</h3>

        {/* Hiển thị thông tin thành viên (user hiện tại) */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <img src="avatar.jpg" alt="User Avatar" className="w-10 h-10 rounded-full" /> {/* Thay thế bằng avatar của user */}
            <div>
              <p className="text-sm text-gray-600 font-semibold">{user?.email}</p>
            </div>
          </div>
          {/* Hiển thị Owner ở cuối bên phải */}
          <span className="text-blue-600 text-sm font-semibold">Owner</span>
        </div>
      </div>
      {/* Create Button */}
      <button
        onClick={handleSubmit}
        className={`w-full mt-6 py-2 rounded-md ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white"
        }`}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>

      {/* Display message */}
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
