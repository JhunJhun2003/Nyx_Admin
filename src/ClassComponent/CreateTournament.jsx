import React, { useState, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useOutletContext } from "react-router-dom";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import TrophyIcon from "@mui/icons-material/EmojiEventsOutlined";
import UploadIcon from "@mui/icons-material/CloudUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { Context } from "../Hooks/context";
import "./CreateTournament.css";

function CreateTournament() {
  const navigate = useNavigate();
  const contextData = useContext(Context);
  const outletContext = useOutletContext() || {};
  const { isDark: parentIsDark } = outletContext;

  // Dark Mode Check (ClassAddCourt Pattern)
  const isDark =
    parentIsDark ?? contextData?.classBackColor?.toLowerCase() === "#1a1c1e";

  const getSwalTheme = () => ({
    background: isDark ? "#1A1C1E" : "#ffffff",
    color: isDark ? "#E1E1E1" : "#0f172a",
  });

  // File & Image States
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const fileRef = useRef(null);

  // Dynamic Rank Points
  const [rankPoints, setRankPoints] = useState([
    { rank: "1st Place", placeholder: "500", value: "" },
    { rank: "2nd Place", placeholder: "250", value: "" },
    { rank: "3rd Place", placeholder: "100", value: "" },
  ]);

  const handleImageChange = (e) => {
    let img = e.target.files[0];
    if (img) {
      setFile(img);
      setFilePath(URL.createObjectURL(img));
    }
  };

  const handleAddRankPoint = () => {
    const nextIndex = rankPoints.length + 1;
    let rankText = `${nextIndex}th Place`;
    if (nextIndex === 4) rankText = "4th Place";

    setRankPoints((prev) => [
      ...prev,
      { rank: rankText, placeholder: "0", value: "" },
    ]);
  };

  const handlePointChange = (index, val) => {
    const updated = [...rankPoints];
    updated[index].value = val;
    setRankPoints(updated);
  };

  const handleRankChange = (index, val) => {
    const updated = [...rankPoints];
    updated[index].rank = val;
    setRankPoints(updated);
  };

  const handleRemoveRankPoint = (index) => {
    setRankPoints((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleCreateTournament = async (e) => {
    e.preventDefault();

    // Image Upload Check
    if (!file) {
      await Swal.fire({
        title: "Banner Required",
        text: "Please upload a tournament banner photo.",
        icon: "warning",
        confirmButtonColor: "#ef4444",
        ...getSwalTheme(),
      });
      return;
    }

    try {
      // API Post Call ပြုလုပ်ရန် နေရာ
      await Swal.fire({
        title: "Success",
        text: "Tournament has been created successfully",
        icon: "success",
        confirmButtonText: "Great, Thanks!",
        confirmButtonColor: "#3b82f6",
        ...getSwalTheme(),
      });

      navigate(-1);
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ef4444",
        ...getSwalTheme(),
      });
    }
  };

  return createPortal(
    <form
      className={`create-tournament-main ${isDark ? "dark-mode" : ""}`}
      onSubmit={handleCreateTournament}
    >
      {/* 1. TOP STICKY NAV BAR (ClassAddCourt Pattern) */}
      <nav className="ct-nav">
        <button type="button" onClick={() => navigate(-1)}>
          <BackIcon sx={{ fontSize: "15px" }} />
        </button>
      </nav>

      {/* 2. MAIN CARD CONTENT */}
      <main className="ct-body-container">
        <div className="ct-card">
          {/* Card Header Title */}
          <div className="ct-card-header">
            <div className="trophy-badge">
              <TrophyIcon className="trophy-badge-icon" />
            </div>
            <h2>Create New Tournament</h2>
          </div>

          {/* 2 Columns Grid */}
          <div className="ct-form-grid">
            {/* LEFT COLUMN: Basic Info */}
            <div className="ct-form-col">
              <h3 className="ct-section-title">Basic Information</h3>

              <div className="ct-input-group">
                <label>TOURNAMENT NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Smash Open"
                  required
                />
              </div>

              <div className="ct-input-group">
                <label>RULES & DESCRIPTION</label>
                <textarea
                  rows={4}
                  placeholder="Write details like match rounds, ground rules, and eligibility..."
                  required
                ></textarea>
              </div>

              {/* Banner Photo Upload */}
              <div className="ct-input-group">
                <label>TOURNAMENT BANNER PHOTO</label>
                <div
                  className="ct-upload-box"
                  onClick={() => fileRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    className="ct-hidden-file"
                    onChange={handleImageChange}
                  />
                  {file ? (
                    <img
                      src={filePath}
                      alt="Banner Preview"
                      className="ct-banner-preview"
                    />
                  ) : (
                    <>
                      <UploadIcon className="ct-upload-icon" />
                      <p className="ct-upload-text">
                        Drag & Drop or <span>browse</span>
                      </p>
                      <span className="ct-upload-sub">
                        (JPG, PNG supported)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Points & Rewards Sub-Card */}
              <div className="ct-rewards-card">
                <div className="ct-rewards-title">
                  <TrophyIcon sx={{ fontSize: 16, color: "#0058be" }} />
                  <span>Points & Rewards</span>
                </div>

                <div className="ct-rewards-grid">
                  {rankPoints.map((item, i) => (
                    <div key={i} className="ct-reward-item">
                      <button
                        type="button"
                        className="ct-remove-rank-btn"
                        onClick={() => handleRemoveRankPoint(i)}
                        aria-label={`Remove ${item.rank}`}
                      >
                        ×
                      </button>
                      <input
                        type="text"
                        className="ct-rank-edit-input"
                        value={item.rank}
                        onChange={(e) => handleRankChange(i, e.target.value)}
                        placeholder="Rank name"
                      />
                      <div className="ct-reward-input-wrap">
                        <TrophyIcon sx={{ fontSize: 13, color: "#94a3b8" }} />
                        <input
                          type="number"
                          placeholder={item.placeholder}
                          value={item.value}
                          onChange={(e) => handlePointChange(i, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="ct-add-rank-btn"
                  onClick={handleAddRankPoint}
                >
                  <AddIcon sx={{ fontSize: 15 }} /> Add Rank Point
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Match Details */}
            <div className="ct-form-col">
              <h3 className="ct-section-title">Match Details</h3>

              <div className="ct-input-group">
                <label>MATCH FORMAT</label>
                <select required defaultValue="Singles">
                  <option value="Singles">Singles</option>
                  <option value="Doubles">Doubles</option>
                </select>
              </div>

              <div className="ct-input-group">
                <label>COURT CATEGORY</label>
                <select required defaultValue="">
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Football">Football</option>
                </select>
              </div>

              <div className="ct-input-group">
                <label>COURT NUMBER</label>
                <select required defaultValue="Court 1">
                  <option value="Court 1">Court 1</option>
                  <option value="Court 2">Court 2</option>
                  <option value="Court 3">Court 3</option>
                </select>
              </div>

              <div className="ct-grid-two">
                <div className="ct-input-group">
                  <label>START DATE</label>
                  <input type="date" required />
                </div>
                <div className="ct-input-group">
                  <label>END DATE</label>
                  <input type="date" required />
                </div>
              </div>

              <div className="ct-input-group">
                <label>TOURNAMENT TIME</label>
                <input type="text" placeholder="09:00 AM - 05:00 PM" required />
              </div>

              <div className="ct-input-group">
                <label>TOURNAMENT ADDRESS</label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. 123 Sports Avenue, Yangon"
                  required
                />
              </div>

              <div className="ct-input-group">
                <label>TOURNAMENT FEE</label>
                <input type="text" placeholder="10,000" required />
              </div>

              <div className="ct-input-group">
                <label>MAX PARTICIPANTS / SLOTS</label>
                <input type="text" placeholder="e.g. 16, 32, 64" required />
              </div>
            </div>
          </div>

          {/* Form Bottom Actions */}
          <div className="ct-footer-actions">
            <button
              type="button"
              className="ct-btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="ct-btn-submit">
              Create
            </button>
          </div>
        </div>
      </main>
    </form>,
    document.body,
  );
}

export default CreateTournament;
