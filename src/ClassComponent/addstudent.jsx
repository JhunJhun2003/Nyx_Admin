import React, { useState, useRef, useEffect } from "react";
import "./addstudent.css";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentIcon from "@mui/icons-material/Payment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";

const AddStudentForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    emailAddress: "",
    courseName: "",
    trainingLevel: "",
    paymentMethod: "",
  });

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // State for API data
  const [courses, setCourses] = useState([]);
  const [trainingLevels, setTrainingLevels] = useState([]);
  const [totalFee, setTotalFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const [trainingProgramId, setTrainingProgramId] = useState("");
  const [trainingLevelId, setTrainingLevelId] = useState("");
  const [paymentId, setPaymentId] = useState("");

  // Fetch courses and training levels on component mount
  useEffect(() => {
    fetchTrainingData();
    fetchPaymentData();
  }, []);

  const fetchTrainingData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://38.60.216.25:5000/api/course/get_training_level_and_class",
      );

      const result = await response.json();
      console.log("Training API Response:", result);

      if (result.success && result.data) {
        const courseMap = new Map();

        result.data.forEach((item) => {
          const courseName = item.course_name;
          const trainingProgramIdValue = item.training_program_id;

          const validLevels = item.levels.filter(
            (level) =>
              level.title_level !== null &&
              level.title_level !== "" &&
              level.training_level_id !== null,
          );

          if (!courseMap.has(courseName)) {
            courseMap.set(courseName, {
              training_program_id: trainingProgramIdValue,
              levels: validLevels,
            });
          }
        });

        const coursesArray = Array.from(courseMap.keys());
        setCourses(coursesArray);

        if (coursesArray.length > 0 && !formData.courseName) {
          const firstCourse = courseMap.get(coursesArray[0]);
          if (firstCourse && firstCourse.levels.length > 0) {
            setTrainingLevels(firstCourse.levels);
            setFormData((prev) => ({
              ...prev,
              courseName: coursesArray[0],
              trainingLevel: firstCourse.levels[0]?.title_level || "",
            }));
            setTrainingProgramId(firstCourse.training_program_id);
            setTrainingLevelId(firstCourse.levels[0]?.training_level_id || "");
            setTotalFee(firstCourse.levels[0]?.price || 0);
          }
        }

        window.courseDataMap = courseMap;
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
      alert("Failed to load training data. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(
        "http://38.60.216.25:5000/api/payment/showpayment",
      );

      const result = await response.json();
      console.log("Payment API Response:", result);

      if (result.result && Array.isArray(result.result)) {
        setPaymentMethods(result.result);

        if (result.result.length > 0 && !formData.paymentMethod) {
          const firstPayment = result.result[0];
          setFormData((prev) => ({
            ...prev,
            paymentMethod: firstPayment.payment_method,
          }));
          setSelectedPaymentDetails(firstPayment);
          setPaymentId(firstPayment.id);
        }
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
      alert("Failed to load payment methods. Please refresh the page.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "courseName" && window.courseDataMap) {
      const selectedCourse = window.courseDataMap.get(value);
      if (selectedCourse) {
        setTrainingLevels(selectedCourse.levels);
        setFormData((prev) => ({
          ...prev,
          trainingLevel: selectedCourse.levels[0]?.title_level || "",
        }));
        setTrainingProgramId(selectedCourse.training_program_id);
        setTrainingLevelId(selectedCourse.levels[0]?.training_level_id || "");
        setTotalFee(selectedCourse.levels[0]?.price || 0);
      }
    }

    if (name === "trainingLevel") {
      const selectedLevel = trainingLevels.find(
        (level) => level.title_level === value,
      );
      if (selectedLevel) {
        setTotalFee(selectedLevel.price || 0);
        setTrainingLevelId(selectedLevel.training_level_id || "");
      }
    }

    if (name === "paymentMethod") {
      const selectedPayment = paymentMethods.find(
        (p) => p.payment_method === value,
      );
      if (selectedPayment) {
        setSelectedPaymentDetails(selectedPayment);
        setPaymentId(selectedPayment.id);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, WEBP)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      alert("Please enter full name");
      return false;
    }
    if (!formData.age || isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      alert("Please enter a valid age (1-120)");
      return false;
    }
    if (!formData.gender) {
      alert("Please select gender");
      return false;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length < 9) {
      alert("Please enter a valid phone number");
      return false;
    }
    if (!trainingProgramId) {
      alert("Please select a course");
      return false;
    }
    if (!trainingLevelId) {
      alert("Please select training level");
      return false;
    }
    if (!paymentId) {
      alert("Please select payment method");
      return false;
    }
    if (!selectedFile) {
      alert("Please upload payment receipt");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append("name", formData.fullName.trim());
    submitData.append("age", formData.age);
    submitData.append("gender", formData.gender.toLowerCase());
    submitData.append("phone", formData.phoneNumber.trim());
    submitData.append("email", formData.emailAddress.trim());
    submitData.append("payment_id", paymentId);
    submitData.append("training_program_id", trainingProgramId);
    submitData.append("training_level_id", trainingLevelId);
    submitData.append("payment_image", selectedFile);

    // Log FormData contents for debugging
    console.log("=== Submitting Data ===");
    for (let pair of submitData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: ${pair[1].name} (${pair[1].size} bytes, ${pair[1].type})`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }

    try {
      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        "http://38.60.216.25:5000/api/coursestudent/addtrainingstudent",
        {
          method: "POST",
          body: submitData,
          signal: controller.signal,
          // Don't set Content-Type header - let browser set it with boundary
        },
      );

      clearTimeout(timeoutId);

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Try to get response as text first
      const responseText = await response.text();
      console.log("Raw response (first 500 chars):", responseText.substring(0, 500));
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON. Full response:", responseText);
        
        // Check if it's an HTML error page
        if (responseText.includes("<html") || responseText.includes("<!DOCTYPE")) {
          throw new Error("Server returned an HTML error page. This usually means the server crashed. Check server logs for details.");
        } else {
          throw new Error(`Server returned invalid response: ${responseText.substring(0, 200)}`);
        }
      }

      if (response.ok && result.success) {
        alert(result.message || "Student added successfully!");
        
        // Reset form
        setFormData({
          fullName: "",
          age: "",
          gender: "",
          phoneNumber: "",
          emailAddress: "",
          courseName: courses[0] || "",
          trainingLevel: trainingLevels[0]?.title_level || "",
          paymentMethod: paymentMethods[0]?.payment_method || "",
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTotalFee(trainingLevels[0]?.price || 0);
        setSelectedPaymentDetails(paymentMethods[0] || null);
        setTrainingProgramId(
          window.courseDataMap?.get(courses[0])?.training_program_id || "",
        );
        setTrainingLevelId(trainingLevels[0]?.training_level_id || "");
        setPaymentId(paymentMethods[0]?.id || "");
        
        // Navigate back with refresh state
        navigate("/class/classstudent", { state: { refresh: true } });
      } else {
        alert(result?.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      
      if (error.name === 'AbortError') {
        alert("Request timeout. The server took too long to respond.");
      } else if (error.message.includes("HTML error page")) {
        alert("Server error: The server returned an HTML error page. Please check:\n\n1. Server logs for the actual error\n2. That all required fields have valid values\n3. That the database is accessible");
      } else {
        alert(`Error: ${error.message}\n\nPlease check the console for more details.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All entered data will be lost.")) {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="form-wrapper">
        <div className="form-container">
          <div style={{ textAlign: "center", padding: "50px" }}>
            <div className="spinner"></div>
            <p>Loading form data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="form-container">
        {/* Header with Back Button */}
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </button>
          <h2>Add New Student</h2>
        </div>

        <div className="form-content">
          {/* Left Side: Personal & Course Details */}
          <div className="left-section">
            <div className="card">
              {/* Personal Details Section */}
              <div className="section-title">
                <PersonIcon className="icon" />
                <h3>Personal Details</h3>
              </div>

              <div className="form-group">
                <label>FULL NAME *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Kaung"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="row-group">
                <div className="form-group flex-2">
                  <label>AGE *</label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Years"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>GENDER *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                      />{" "}
                      Male
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                      />{" "}
                      Female
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>PHONE NUMBER *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="09 xxxxxxxxx"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="emailAddress"
                  placeholder="example@mail.com"
                  value={formData.emailAddress}
                  onChange={handleChange}
                />
              </div>

              {/* Course Enrollment Section */}
              <div className="section-title margin-top-lg">
                <SearchIcon className="icon" />
                <h3>Course Enrollment</h3>
              </div>
              <div className="row-group">
                <div className="form-group flex-1">
                  <label>COURSE NAME *</label>
                  <select
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleChange}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>TRAINING LEVEL *</label>
                  <select
                    name="trainingLevel"
                    value={formData.trainingLevel}
                    onChange={handleChange}
                  >
                    <option value="">Select Level</option>
                    {trainingLevels.map((level, index) => (
                      <option key={index} value={level.title_level}>
                        {level.title_level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Fees & Payment */}
          <div className="right-section">
            {/* Total Fees Card */}
            <div className="card total-fees-card">
              <span className="fees-label">TOTAL FEES</span>
              <div className="fees-amount">
                {totalFee.toLocaleString()} <span className="currency">Ks</span>
              </div>
              <span className="fees-subtext">
                Standard monthly training rate
              </span>
            </div>

            {/* Payment Details Card */}
            <div className="card margin-top-md">
              <div className="section-title payment-title">
                <PaymentIcon className="icon-red" fontSize="small" />
                <h3>Payment Details</h3>
              </div>

              <div className="form-group">
                <label>PAYMENT METHOD *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map((payment) => (
                    <option key={payment.id} value={payment.payment_method}>
                      {payment.payment_method}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPaymentDetails && (
                <div className="form-group">
                  <label>PAYMENT INFO</label>
                  <div className="info-box">
                    <div className="info-row">
                      <span className="info-label">Account Name</span>
                      <span className="info-value">
                        {selectedPaymentDetails.payment_name}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Account Number</span>
                      <span className="info-value text-muted">
                        {selectedPaymentDetails.payment_number}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileChange}
              />
              <div className="upload-zone" onClick={handleUploadClick}>
                <CloudUploadIcon className="upload-icon" />
                <span>
                  {selectedFile ? selectedFile.name : "Click to upload receipt *"}
                </span>
              </div>
              {selectedFile && (
                <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px", textAlign: "center" }}>
                  ✓ File selected: {(selectedFile.size / 1024).toFixed(2)} KB
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                className="btn-cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
                style={{
                  padding: "12px 37px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#fff",
                  color: "#334155",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  padding: "13px 100px",
                  border: "none",
                  backgroundColor: "#111e30",
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentForm;