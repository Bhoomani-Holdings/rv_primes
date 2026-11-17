import { faceImageUrl } from "../../services/userService";
import { FACE_ANGLES } from "./faceAngles";

// Older submissions stored three separate Cloudinary links; newer ones store `facePhotos`.
const LEGACY_FIELDS = { front: "faceFrontPhoto", left: "faceLeftPhoto", right: "faceRightPhoto" };

// Returns { front|left|right: { src, capturedAt, capturedBy } } for whatever photos exist.
export const facePhotosFromKyc = (kycDetails = {}) => {
  const photos = {};
  for (const { key } of FACE_ANGLES) {
    const saved = kycDetails?.facePhotos?.[key];
    if (saved?.url) photos[key] = { src: faceImageUrl(saved.url), capturedAt: saved.capturedAt, capturedBy: saved.capturedBy };
    else if (kycDetails?.[LEGACY_FIELDS[key]]) photos[key] = { src: kycDetails[LEGACY_FIELDS[key]] };
  }
  return photos;
};
