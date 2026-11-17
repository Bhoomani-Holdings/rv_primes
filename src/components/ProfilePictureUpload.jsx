import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { uploadEmployeeProfilePicture } from "../services/employeeService";
import "./ProfilePictureUpload.css";

const API_ORIGIN = "http://localhost:5000";
const CROP_SIZE = 280;

const getBaseScale = (image) => Math.max(CROP_SIZE / image.naturalWidth, CROP_SIZE / image.naturalHeight);
const clampOffset = (offset, imageSize, scale) => Math.min(0, Math.max(CROP_SIZE - imageSize * scale, offset));

export default function ProfilePictureUpload({ employee, onUploaded }) {
  const inputRef = useRef(null);
  const dragRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be 5 MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setCrop({ file, url, image });
      setZoom(1);
      const scale = getBaseScale(image);
      setPosition({
        x: (CROP_SIZE - image.naturalWidth * scale) / 2,
        y: (CROP_SIZE - image.naturalHeight * scale) / 2
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("This image could not be opened. Choose another file.");
    };
    image.src = url;
  };

  const closeCrop = () => {
    if (crop?.url) URL.revokeObjectURL(crop.url);
    setCrop(null);
    setError("");
  };

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, ...position };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId || !crop) return;
    const scale = getBaseScale(crop.image) * zoom;
    setPosition({
      x: clampOffset(dragRef.current.x + event.clientX - dragRef.current.startX, crop.image.naturalWidth, scale),
      y: clampOffset(dragRef.current.y + event.clientY - dragRef.current.startY, crop.image.naturalHeight, scale)
    });
  };

  const handleZoom = (event) => {
    const nextZoom = Number(event.target.value);
    if (!crop) return;
    const oldScale = getBaseScale(crop.image) * zoom;
    const newScale = getBaseScale(crop.image) * nextZoom;
    const sourceCenterX = (CROP_SIZE / 2 - position.x) / oldScale;
    const sourceCenterY = (CROP_SIZE / 2 - position.y) / oldScale;
    setPosition({
      x: clampOffset(CROP_SIZE / 2 - sourceCenterX * newScale, crop.image.naturalWidth, newScale),
      y: clampOffset(CROP_SIZE / 2 - sourceCenterY * newScale, crop.image.naturalHeight, newScale)
    });
    setZoom(nextZoom);
  };

  const saveCrop = async () => {
    if (!crop) return;
    setSaving(true);
    setError("");
    try {
      const scale = getBaseScale(crop.image) * zoom;
      const sourceX = -position.x / scale;
      const sourceY = -position.y / scale;
      const sourceSize = CROP_SIZE / scale;
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext("2d");
      context.drawImage(crop.image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 512, 512);
      const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Unable to prepare the cropped picture.")), "image/jpeg", 0.9));
      const file = new File([blob], "profile-picture.jpg", { type: "image/jpeg" });
      const updated = await uploadEmployeeProfilePicture(employee.id, file);
      onUploaded(updated.profilePicture);
      URL.revokeObjectURL(crop.url);
      setCrop(null);
    } catch (uploadError) {
      setError(uploadError.message || "Unable to upload profile picture.");
    } finally {
      setSaving(false);
    }
  };

  const imageScale = crop ? getBaseScale(crop.image) * zoom : 1;

  return (
    <div className="profile-picture-editor">
      <div className="profile-picture-frame">
        {employee.profilePicture ? (
          <img src={`${API_ORIGIN}${employee.profilePicture}`} alt={`${employee.fullName}'s profile`} />
        ) : <span aria-hidden="true">{employee.fullName?.trim()?.[0]?.toUpperCase() || "?"}</span>}
      </div>
      <div className="profile-picture-actions">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={saving}>
          {saving ? "Uploading..." : employee.profilePicture ? "Change Picture" : "Add Profile Picture"}
        </button>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleChange} hidden />
        <small>JPG, PNG, or WEBP, up to 5 MB.</small>
        {error && <p role="alert">{error}</p>}
      </div>
      {crop && createPortal(<div className="profile-crop-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) closeCrop(); }}>
        <section className="profile-crop-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-crop-title">
          <h2 id="profile-crop-title">Adjust Profile Picture</h2>
          <p>Drag the image to reposition it, then adjust the zoom.</p>
          <div
            className="profile-crop-window"
            style={{ width: CROP_SIZE, height: CROP_SIZE }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
          >
            <img
              src={crop.url}
              alt="Profile picture crop preview"
              draggable="false"
              style={{ width: crop.image.naturalWidth * imageScale, height: crop.image.naturalHeight * imageScale, left: position.x, top: position.y }}
            />
          </div>
          <label className="profile-crop-zoom">Zoom<input type="range" min="1" max="3" step="0.01" value={zoom} onChange={handleZoom} /></label>
          {error && <p className="profile-crop-error" role="alert">{error}</p>}
          <div className="profile-crop-actions">
            <button type="button" className="profile-crop-cancel" onClick={closeCrop} disabled={saving}>Cancel</button>
            <button type="button" onClick={saveCrop} disabled={saving}>{saving ? "Saving..." : "Save Picture"}</button>
          </div>
        </section>
      </div>, document.body)}
    </div>
  );
}
