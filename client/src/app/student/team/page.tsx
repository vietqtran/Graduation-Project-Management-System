import React from 'react';
import {Card, CardContent} from '../_components/ui/card';
import { Avatar, AvatarImage } from "../_components/ui/avatar";
import { Button } from "../_components/ui/button";
export default function StudentTeamPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700">My Group</h2>
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/avatar.png" alt="Group Icon" />
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">Online Japanese Learning System</h3>
              <p className="text-sm text-gray-500">Created at: 7/20/2023 4:53:04 PM</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold">Abbreviations</p>
              <p className="italic">OJLS</p>
              <p className="font-bold">Profession</p>
              <p className="italic">Information Technology</p>
              <p className="font-bold">Description</p>
              <p className="italic">Hệ thống học tiếng Nhật online</p>
              <p className="font-bold">Keywords</p>
              <span className="px-2 py-1 bg-gray-200 text-sm rounded">js</span>
            </div>
            <div>
              <p className="font-bold">Vietnamese Title</p>
              <p className="italic">Hệ thống học tiếng Nhật online</p>
              <p className="font-bold">Specialty</p>
              <p className="italic">IT1</p>
              <p className="font-bold">Available Slot</p>
              <p>4</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-bold">Members</p>
            <p>Total: 5 members</p>
            <div className="mt-2 flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/avatar.png" alt="User Avatar" />
              </Avatar>
              <div>
                <p className="font-semibold">thail23@fpt.edu.vn</p>
                <p className="text-sm text-gray-500">thail23</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button className="border border-purple-600 text-purple-600 hover:bg-purple-400 hover:text-white">+ Update Idea</Button>
            <Button className="border border-red-500 text-red-500 hover:bg-red-400 hover:text-white">Delete Idea</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
{/* <div className="mt-6">
          <p className="text-gray-600 font-medium">Members</p>
          <div className="flex items-center space-x-4 border p-3 rounded-md mt-2">
            <img
              src="https://via.placeholder.com/40"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">huyenntnhs150125@fpt.edu.vn</p>
              <p className="text-xs text-gray-500">huyenntnhs150125</p>
            </div>
            <span className="text-sm text-gray-600 ml-auto">Owner | Leader</span>
            <button className="text-gray-500 hover:text-gray-700">
              ⋮
            </button>
          </div>
        </div> */}