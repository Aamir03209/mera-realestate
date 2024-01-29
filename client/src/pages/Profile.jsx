import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserFailure,
  logoutUserSuccess,
  logoutUserStart,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { useRef } from "react";
const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [form, setForm] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [listings, setListings] = useState([]);
  console.log(listings);

  useEffect(() => {
    if (file) {
      FileUploadToGoogleStorage(file);
    }
  }, [file]);
  const FileUploadToGoogleStorage = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error);
        // Handle the error (e.g., show an error message to the user)
      },
      () => {
        // Upload completed successfully, get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadedURL) => {
            setForm({ ...form, avatar: downloadedURL });
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            // Handle the error (e.g., show an error message to the user)
          });
      }
    );
  };
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("user id", currentUser._id);
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log({ data });
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(logoutUserStart);
      const res = await fetch("/api/auth/signout");
      const data = res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(logoutUserFailure(data.message));
      }
      dispatch(logoutUserSuccess(data));
    } catch (error) {
      dispatch(logoutUserFailure(error.message));
    }
  };
  const getUserListings = async () => {
    try {
      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await response.json();
      if (data.success === false) {
        setShowListingError(true);
      }
      setListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          className="rounded-full object-cover self-center mt-5 mb-2"
          src={form?.avatar || currentUser.avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
          style={{
            width: "120px", // Set your desired width
            height: "120px", // Set your desired height
          }}
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className=" text-red-700">Error Image Upload!</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className=" bg-slate-700">Uploading... </span>
          ) : filePerc === 100 ? (
            <span className=" text-green-700">Image Uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          placeholder="Username"
          className="rounded-lg p-3 "
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="rounded-lg p-3 "
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="rounded-lg p-3 "
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-700 p-3 rounded-lg text-center uppercase hover:opacity-95 text-white"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign out
        </span>
      </div>
      <p className=" text-red-700 text-center mt-4">{error ? error : ""}</p>
      <p className="text-green-700 mt-4 text-center">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <p
        className="text-green-700 text-center m-2 cursor-pointer hover:opacity-75"
        onClick={getUserListings}
      >
        Show Listings
      </p>
  
     {listings &&
        listings.length > 0 &&
        <div className="flex flex-col gap-4 mt-5">
          <h1 className=" text-center font-bold uppercase text-lg">Your Listings</h1>
        {
             listings.map((listing) => (
              <div
                key={listing._id}
                className="border m-3 rounded-lg p-3 flex items-center justify-between"
              >
                <Link to={`/listings/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="Listing Image "
                    className="w-16 h-16 object-contain"
                  />
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <p className="hover:underline text-slate-700 font-semibold">
                    {listing.name}
                  </p>
                </Link>
                <div className="flex flex-col items-center">
                  <button className="text-red-700">Delete</button>
                  <button className="text-green-700">Edit</button>
                </div>
              </div>
            ))
        }
        </div>
       }
     </div>
    
  );
};

export default Profile;
