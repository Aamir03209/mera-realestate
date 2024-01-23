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
} from "../redux/user/userSlice";
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
  console.log(form)
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
    
      console.log("user id",currentUser._id)
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      console.log({data})
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
     
    } catch (error) {
      dispatch(updateUserFailure(error.message));
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
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className=" text-red-700 text-center mt-4">{error ? error : ""}</p>
      <p className="text-green-700 mt-4 text-center">{updateSuccess ? 'User is updated successfully!' : ''}</p>
    </div>
  );
};

export default Profile;
