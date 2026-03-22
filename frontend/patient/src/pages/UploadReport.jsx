import React, { useState } from "react";
import axios from "axios";

const UploadReport = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("report", file);

    await axios.post(
      "http://localhost:5000/api/upload",
      formData
    );

    alert("Report Uploaded");
  };

  return (
    <div>
      <h2>Upload Report</h2>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default UploadReport;