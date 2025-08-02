import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tokenData = localStorage.getItem("user");
  const token = tokenData ? JSON.parse(tokenData).token : null;
  const navigate = useNavigate(); // ✅ For navigation

  // ✅ Fetch Profile and Image
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError("Please log in first.");
          setLoading(false);
          return;
        }

        // Fetch Profile Data
        const response = await fetch("https://game-backend-6.onrender.com/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch profile");
        }

        const data = await response.json();
        setUser(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: data.address || ""
        });

        // Fetch Profile Image
        const imgRes = await fetch("https://game-backend-6.onrender.com/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (imgRes.ok) {
          const imgBlob = await imgRes.blob();
          setPreview(URL.createObjectURL(imgBlob));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch("https://game-backend-6.onrender.com/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const updatedData = await response.json();
      setUser(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return alert("Please select an image first.");

    const formDataObj = new FormData();
    formDataObj.append("image", image);

    try {
      const response = await fetch("https://game-backend-6.onrender.com/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj
      });

      if (response.ok) {
        alert("Image uploaded successfully");
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Clear token and user data
    navigate("/"); // ✅ Redirect to Home page
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (error) return <div className="profile-container">Error: {error}</div>;

  return (
    <div className="profile-container">
      {/* Logout Button */}
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Left Section */}
      <div className="profile-left">
        <div className="profile-photo">
          {preview ? (
            <img src={preview} alt="Profile" style={{ width: "120px", borderRadius: "50%" }} />
          ) : (
            "No Photo"
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button className="edit-btn" onClick={handleImageUpload}>
          Upload Image
        </button>
      </div>

      {/* Right Section */}
      <div className="profile-right">
        {!isEditing ? (
          <div className="info-box">
            <p>Note : UserName and Useremail cannot be changed...</p>
            <div className="user-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>First Name:</strong> {user.firstName || "N/A"}</p>
              <p><strong>Last Name:</strong> {user.lastName || "N/A"}</p>
              <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
              <p><strong>Address:</strong> {user.address || "N/A"}</p>
            </div>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
          </div>
        ) : (
          <div className="edit-form">
            <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            <div className="form-actions">
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
