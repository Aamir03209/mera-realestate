import React from "react";
import { useSelector } from "react-redux";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="rounded-full object-cover self-center my-5"
          src={currentUser.avatar}
          alt="profile"
        />
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="rounded-lg
        p-3 "
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="rounded-lg
        p-3 "
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="rounded-lg
        p-3 "
        />
        <button className="bg-slate-700 text-white uppercase p-3 rounded-full cursor-pointer hover:opacity-95">Update</button>
      </form>
      <div className="flex justify-between">
       <span className="text-red-700 cursor-pointer">Delete Account</span>
       <span className="text-red-700 cursor-pointer">Sign out</span>

      </div>
    </div>
  );
};

export default Profile;
