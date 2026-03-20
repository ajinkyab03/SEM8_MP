import React, { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/images/avatar-icon.png";

const Profile = () => {

  const { user, role, dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {

    dispatch({ type: "LOGOUT" });

    navigate("/login");
  };

  return (

    <div className="max-w-[500px] mx-auto mt-20 p-8 shadow-lg rounded-lg bg-white">

      <div className="flex flex-col items-center gap-4">

        <img
          src={user?.photo || defaultAvatar}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />

        <h2 className="text-2xl font-bold">{user?.name}</h2>

        <p className="text-gray-600">{user?.email}</p>

        <p className="text-sm bg-blue-100 px-3 py-1 rounded-full">
          Role: {role}
        </p>

      </div>

      <div className="mt-8 flex justify-center">

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>

  );
};

export default Profile;