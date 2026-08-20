import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Defaultimg from "../images/defaultimg.png";
import { Context } from "../Hooks/context";
import { useGetClassVenue } from "../ClassApi";
import { useNoti } from "../Hooks/alert";
import Switch from "@mui/material/Switch";
import "./classwalkin.css";

function Classwalkin() {
  const { classBackColor } = useContext(Context);
  const isDark = classBackColor === "#1A1C1E";
  const navigate = useNavigate();
  const { Loading } = useNoti();
  const { GetVenue, Venue, Courts, GetCourts } = useGetClassVenue();

  const [active, setactive] = useState(null);
  const [walkInConfigs, setWalkInConfigs] = useState({});
  const [modalType, setModalType] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);

  const [formData, setFormData] = useState({
    price: "",
    players: "",
    openTime: "08:00",
    closeTime: "22:00",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    GetVenue();
  }, []);

  useEffect(() => {
    if (Venue?.data?.length > 0 && !active) {
      setactive(Venue.data[0]?.id);
      GetCourts(Venue.data[0]?.id);
    }
  }, [Venue.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = (court) => {
    setSelectedCourt(court);
    setModalType("create");
    setFormData({
      price: "",
      players: "",
      openTime: "08:00",
      closeTime: "22:00",
    });
    setErrors({});
  };

  const handleEdit = (court) => {
    setSelectedCourt(court);
    setModalType("edit");
    setFormData(walkInConfigs[court.id]);
    setErrors({});
  };

  const saveWalkIn = () => {
    setWalkInConfigs({
      ...walkInConfigs,
      [selectedCourt.id]: {
        ...formData,
        isActive: true,
        currentPlayers: 6,
      },
    });
    setModalType(null);
  };

  const deleteWalkIn = () => {
    const newConfigs = { ...walkInConfigs };
    delete newConfigs[selectedCourt.id];
    setWalkInConfigs(newConfigs);
    setModalType(null);
  };

  const toggleStatus = (courtId) => {
    setWalkInConfigs({
      ...walkInConfigs,
      [courtId]: {
        ...walkInConfigs[courtId],
        isActive: !walkInConfigs[courtId].isActive,
      },
    });
  };

  return (
    <div
      className={`cbsmain ${isDark ? "dark-mode" : ""}`}
      style={{
        backgroundColor: classBackColor || (isDark ? "#121212" : "#f4f5f7"),
      }}
    >
      {Loading}

      {/* Modal Dialog */}
      {(modalType === "create" || modalType === "edit") && (
        <div className="modal-overlay">
          <div className="walkin-modal">
            <div className="modal-header">
              <div className="modal-title">
                {modalType === "edit" && (
                  <EditOutlinedIcon style={{ fontSize: 22 }} />
                )}
                <h3>
                  {modalType === "create"
                    ? "Create Walk-in Setup"
                    : "Edit Walk-in Setup"}
                </h3>
              </div>
              <CloseIcon
                className="close-btn"
                onClick={() => setModalType(null)}
              />
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Court Name</label>
                <input
                  type="text"
                  disabled
                  value={`Court ${selectedCourt?.id}`}
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Daily Amount Price (per Pax)</label>
                <div className="input-with-unit">
                  <input
                    type="text"
                    placeholder="e.g. 5000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                  <span className="unit">Ks</span>
                </div>
              </div>

              <div className="form-group">
                <label>Max Player Capacity</label>
                <input
                  type="text"
                  placeholder="e.g. 10"
                  value={formData.players}
                  onChange={(e) =>
                    setFormData({ ...formData, players: e.target.value })
                  }
                />
              </div>
              {/* Open Time & Close Time (Side-by-Side Flex Box) */}
              <div className="time-grid">
                <div className="form-field flex-1">
                  <label className="field-label">Open Time</label>
                  <TextField
                    className="custom-time-input"
                    fullWidth
                    type="time"
                    name="openTime"
                    value={formData.openTime}
                    onChange={handleChange}
                    error={Boolean(errors.openTime)}
                    helperText={errors.openTime}
                    inputProps={{
                      step: 300,
                    }}
                  />
                </div>

                <div className="form-field flex-1">
                  <label className="field-label">Close Time</label>
                  <TextField
                    className="custom-time-input"
                    fullWidth
                    type="time"
                    name="closeTime"
                    value={formData.closeTime}
                    onChange={handleChange}
                    error={Boolean(errors.closeTime)}
                    helperText={errors.closeTime}
                    inputProps={{
                      step: 300,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {modalType === "edit" && (
                <button className="btn-delete" onClick={deleteWalkIn}>
                  <DeleteOutlineIcon style={{ fontSize: 18 }} /> Delete
                </button>
              )}
              <button className="btn-cancel" onClick={() => setModalType(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={saveWalkIn}>
                {modalType === "edit" && (
                  <SaveIcon style={{ fontSize: 18, marginRight: 6 }} />
                )}
                {modalType === "create" ? "Create Walk-in" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Header */}
      <header className="page-header">
        <div className="header-title">
          <SportsTennisIcon style={{ fontSize: 32 }} />
          <h2>Walk-In Setup</h2>
        </div>
        <button
          className="btn-booking-list"
          onClick={() => navigate("/class/booking-list")}
        >
          <ReceiptLongIcon style={{ fontSize: 18 }} /> Booking List
        </button>
      </header>

      <main className="walkin-content">
        {/* Category / Venue Tabs */}
        <div className="category-tabs">
          {Venue.data?.map((item) => (
            <button
              key={item.id}
              className={`tab-btn ${item.id === active ? "active" : ""}`}
              onClick={() => {
                setactive(item.id);
                GetCourts(item.id);
              }}
            >
              {item.venue_name}
            </button>
          ))}
        </div>

        {/* Court Cards Grid */}
        <div className="court-grid">
          {Courts.data?.map((court) => {
            const config = walkInConfigs[court.id];
            const isFull =
              config && config.currentPlayers >= parseInt(config.players || 0);

            if (!config) {
              return (
                <div className="court-card default-card" key={court.id}>
                  <div className="card-top">
                    <span className="court-name">
                      <SportsTennisIcon className="court-icon" /> Court{" "}
                      {court.id}
                    </span>
                    <Switch disabled checked={false} size="small" />
                  </div>
                  <div className="card-img-container">
                    <img src={Defaultimg} alt="court" />
                  </div>
                  <button
                    className="btn-walkin-create"
                    onClick={() => handleCreate(court)}
                  >
                    Walk-in
                  </button>
                </div>
              );
            }

            return (
              <div
                className={`court-card active-card ${
                  !config.isActive ? "disabled-card" : ""
                }`}
                key={court.id}
              >
                <div className="card-top">
                  <span className="court-name">
                    <SportsTennisIcon className="court-icon" /> Court {court.id}
                  </span>
                  <div className="card-top-controls">
                    <EditOutlinedIcon
                      className="edit-icon"
                      onClick={() => handleEdit(court)}
                    />
                    <Switch
                      checked={config.isActive}
                      onChange={() => toggleStatus(court.id)}
                      color="primary"
                    />
                  </div>
                </div>

                <div className="badge-row">
                  <span
                    className={`status-pill ${
                      isFull ? "pill-full" : "pill-active"
                    }`}
                  >
                    ● {isFull ? "Fully Booked" : "Walk-in Active"}
                  </span>
                </div>

                <div className="card-img-container">
                  <img src={Defaultimg} alt="court" />
                </div>

                <div className="card-info-box">
                  <div className="info-row">
                    <div className="info-col">
                      <span className="info-label">Rate</span>
                      <span className="info-value">
                        {config.price || "5,000"} Ks / pax
                      </span>
                    </div>
                    <div className="info-col">
                      <span className="info-label">Hours</span>
                      <span className="info-value">
                        {config.openTime} - {config.closeTime}
                      </span>
                    </div>
                  </div>
                  <div className="info-status">
                    <span className="info-label">Status</span>
                    <span
                      className={`info-value ${
                        isFull ? "text-red" : "text-dark"
                      }`}
                    >
                      Capacity: {config.currentPlayers}/{config.players} Players{" "}
                      {isFull ? "(Full)" : ""}
                    </span>
                  </div>
                </div>

                <div className="card-bottom">
                  <button
                    className="btn-booking-link"
                    disabled={!config.isActive || isFull}
                    onClick={() => navigate("/class/walkbooking")}
                  >
                    Booking →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Classwalkin;
