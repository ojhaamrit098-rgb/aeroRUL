import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function UploadPage({
  setDatasetUploaded,
  user,
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0] || null;

    setFile(selectedFile);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a dataset file.");
      return;
    }

    if (!user?.id) {
      setError("Your session is not available. Please sign in again.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const safeFileName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const storagePath = `${user.id}/${Date.now()}-${safeFileName}`;

      const {
        error: storageError,
      } = await supabase.storage
        .from("datasets")
        .upload(storagePath, file, {
          upsert: false,
        });

      if (storageError) {
        throw storageError;
      }

      const {
        error: databaseError,
      } = await supabase
        .from("datasets")
        .insert({
          user_id: user.id,
          file_name: file.name,
          stoarge_path: storagePath,
          uploaded_at: new Date().toISOString(),
        });

      if (databaseError) {
        throw databaseError;
      }

      setSuccess("Dataset uploaded successfully.");
      setDatasetUploaded(true);
    } catch (uploadError) {
      console.error(
        "Dataset upload failed:",
        uploadError
      );

      setError(
        uploadError?.message ||
          "Unable to upload dataset."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        boxSizing: "border-box",
        background: "var(--bg, #0b0d10)",
        color: "var(--text, #f5f5f5)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "620px",
          padding: "32px",
          boxSizing: "border-box",
          border:
            "1px solid var(--line, rgba(255,255,255,.12))",
          borderRadius: "18px",
          background:
            "var(--panel, rgba(255,255,255,.04))",
          boxShadow:
            "0 22px 55px rgba(0,0,0,.28)",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <span
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "10px",
              letterSpacing: "2px",
              opacity: 0.6,
            }}
          >
            AERORUL / DATA OPERATIONS
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            Upload dataset
          </h1>

          <p
            style={{
              marginTop: "10px",
              marginBottom: 0,
              opacity: 0.65,
              lineHeight: 1.6,
            }}
          >
            Upload your telemetry dataset to initialize
            the AeroRUL fleet command center.
          </p>
        </div>

        <label
          style={{
            display: "block",
            padding: "28px",
            border:
              "1px dashed var(--line, rgba(255,255,255,.2))",
            borderRadius: "14px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              width: "100%",
              marginBottom: "14px",
            }}
          />

          <span
            style={{
              display: "block",
              opacity: 0.65,
              fontSize: "12px",
            }}
          >
            {file
              ? file.name
              : "Choose a telemetry dataset"}
          </span>
        </label>

        {error && (
          <p
            style={{
              marginTop: "16px",
              marginBottom: 0,
              color: "var(--bad, #ff6b6b)",
              fontSize: "12px",
            }}
          >
            {error}
          </p>
        )}

        {success && (
          <p
            style={{
              marginTop: "16px",
              marginBottom: 0,
              color: "var(--good, #72d69c)",
              fontSize: "12px",
            }}
          >
            {success}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            width: "100%",
            marginTop: "22px",
            padding: "13px 18px",
            border: 0,
            borderRadius: "10px",
            cursor:
              uploading || !file
                ? "not-allowed"
                : "pointer",
            opacity:
              uploading || !file ? 0.5 : 1,
            background:
              "var(--accent, #d7a56f)",
            color: "#111",
            fontWeight: 700,
          }}
        >
          {uploading
            ? "Uploading..."
            : "Upload dataset"}
        </button>
      </section>
    </div>
  );
}