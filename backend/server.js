const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

const dashboardFile = process.env.DASHBOARD_FILE || path.join(
  __dirname,
  "data",
  "dashboard.json"
);
const uploadDirectory = path.join(__dirname, "uploads");
const maxImageSize = 5 * 1024 * 1024;
const maxVideoSize = 50 * 1024 * 1024;

fs.mkdirSync(uploadDirectory, { recursive: true });
app.use("/uploads", express.static(uploadDirectory));

const allowedMediaExtensions = {
  photos: new Set([".jpg", ".jpeg", ".png", ".webp"]),
  videos: new Set([".mp4", ".webm", ".mov"])
};

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    }
  }),
  limits: { fileSize: maxVideoSize },
  fileFilter: (req, file, callback) => {
    const allowedExtensions = allowedMediaExtensions[file.fieldname];
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions || !allowedExtensions.has(extension)) {
      const mediaType = file.fieldname === "photos" ? "image" : "video";
      return callback(new Error(`Unsupported ${mediaType} format.`));
    }
    callback(null, true);
  }
});

const removeUploadedFiles = (files = {}) => {
  Object.values(files).flat().forEach((file) => {
    try {
      fs.unlinkSync(file.path);
    } catch (error) {
      if (error.code !== "ENOENT") console.error(error);
    }
  });
};

const parseProjectUpload = (req, res, next) => {
  upload.fields([
    { name: "photos" },
    { name: "videos" }
  ])(req, res, (error) => {
    if (!error) return next();

    removeUploadedFiles(req.files);
    const message = error.code === "LIMIT_FILE_SIZE"
      ? error.field === "photos"
        ? "Image size must be less than 5 MB."
        : "Video size must be less than 50 MB."
      : error.message || "Unable to upload project media.";
    return res.status(400).json({ message });
  });
};

app.get("/api/dashboard", (req, res) => {
  try {
    const data = fs.readFileSync(dashboardFile, "utf-8");

    res.json(JSON.parse(data));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load dashboard data"
    });
  }
});

app.get("/api/projects", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    res.json(data.projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load projects" });
  }
});

app.get("/api/users", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    res.json(data.users || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load users" });
  }
});

app.post("/api/users", (req, res) => {
  const { basicInfo, addressInfo } = req.body || {};
  const requiredBasicFields = ["firstname", "lastname", "mobileNumber", "email"];
  const requiredAddressFields = ["address", "address1", "country", "state", "city", "pincode"];

  if (!basicInfo || !addressInfo ||
    requiredBasicFields.some((field) => typeof basicInfo[field] !== "string" || !basicInfo[field].trim()) ||
    requiredAddressFields.some((field) => typeof addressInfo[field] !== "string" || !addressInfo[field].trim())) {
    return res.status(400).json({ message: "Complete the required basic and address information" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    data.users = Array.isArray(data.users) ? data.users : [];
    const email = basicInfo.email.trim().toLowerCase();
    if (data.users.some((user) => user.email.toLowerCase() === email)) {
      return res.status(409).json({ message: "A user with this email already exists" });
    }

    const firstName = basicInfo.firstname.trim();
    const lastName = basicInfo.lastname.trim();
    const user = {
      id: Math.max(0, ...data.users.map((item) => Number(item.id) || 0)) + 1,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      mobileNumber: basicInfo.mobileNumber.trim(),
      email,
      dateOfBirth: basicInfo.dateofbirth || "",
      gender: basicInfo.gender || "",
      address: addressInfo.address.trim(),
      address1: addressInfo.address1.trim(),
      country: addressInfo.country.trim(),
      state: addressInfo.state.trim(),
      city: addressInfo.city.trim(),
      pincode: addressInfo.pincode.trim(),
      approvalStatus: "Pending for Approval"
    };

    data.users.push(user);
    fs.writeFileSync(dashboardFile, `${JSON.stringify(data, null, 2)}\n`);
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save user" });
  }
});

app.patch("/api/users/:id/status", (req, res) => {
  const allowedStatuses = ["Pending for Approval", "Rejected", "Approved"];
  if (!allowedStatuses.includes(req.body.approvalStatus)) {
    return res.status(400).json({ message: "Invalid user approval status" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    const user = (data.users || []).find((item) => Number(item.id) === Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approvalStatus = req.body.approvalStatus;
    fs.writeFileSync(dashboardFile, `${JSON.stringify(data, null, 2)}\n`);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update user status" });
  }
});

app.patch("/api/users/registration-details", (req, res) => {
  const { email, nomineeInfo, bankInfo } = req.body || {};
  if (typeof email !== "string" || !email.trim() || !nomineeInfo || !bankInfo) {
    return res.status(400).json({ message: "Registration details are incomplete" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    const user = (data.users || []).find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ message: "Registered user not found" });

    user.nomineeDetails = {
      UserName: nomineeInfo.UserName || "",
      UserNumber: nomineeInfo.UserNumber || "",
      Relationship: nomineeInfo.Relationship || ""
    };
    user.bankDetails = {
      accountholdername: bankInfo.accountholdername || "",
      bankname: bankInfo.bankname || "",
      accountnumber: bankInfo.accountnumber || "",
      ifsccode: bankInfo.ifsccode || "",
      upiid: bankInfo.upiid || "",
      cancelledcheque: bankInfo.cancelledcheque || ""
    };

    fs.writeFileSync(dashboardFile, `${JSON.stringify(data, null, 2)}\n`);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save registration details" });
  }
});

app.patch("/api/users/kyc", (req, res) => {
  const { email, kycDetails } = req.body || {};
  const requiredKycFields = [
    "pancardnumber",
    "aadhaarnumber",
    "uploadpancard",
    "uploadaadhaar",
    "uploadaddressproof",
    "selfiephoto"
  ];
  if (typeof email !== "string" || !email.trim() || !kycDetails ||
    requiredKycFields.some((field) => typeof kycDetails[field] !== "string" || !kycDetails[field].trim())) {
    return res.status(400).json({ message: "Complete all KYC details and document uploads" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    const user = (data.users || []).find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ message: "Registered user not found" });

    user.kycDetails = Object.fromEntries(requiredKycFields.map((field) => [field, kycDetails[field].trim()]));
    user.kycStatus = "Pending for Approval";
    fs.writeFileSync(dashboardFile, `${JSON.stringify(data, null, 2)}\n`);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save KYC details" });
  }
});

app.patch("/api/users/:id/kyc-status", (req, res) => {
  const allowedStatuses = ["Pending for Approval", "Accept", "Reject"];
  if (!allowedStatuses.includes(req.body.kycStatus)) {
    return res.status(400).json({ message: "Invalid KYC approval status" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    const user = (data.users || []).find((item) => Number(item.id) === Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.kycDetails) return res.status(400).json({ message: "User has not submitted KYC details" });

    user.kycStatus = req.body.kycStatus;
    fs.writeFileSync(dashboardFile, `${JSON.stringify(data, null, 2)}\n`);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update KYC status" });
  }
});

app.patch("/api/projects/:id", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    const projectIndex = data.projects.findIndex((item) => Number(item.id) === Number(req.params.id));
    if (projectIndex === -1) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = data.projects[projectIndex];
    const body = req.body || {};
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ message: "No project fields to update" });
    }

    const totalUnits = Number(body.totalUnits ?? project.totalUnits);
    const soldUnits = Number(body.soldUnits ?? project.soldUnits);
    const initialValue = Number(body.initialValue ?? project.initialValue);
    const currentValue = Number(body.currentValue ?? project.currentValue);
    const expectedROI = body.expectedROI === undefined
      ? project.expectedROI ?? null
      : body.expectedROI === "" || body.expectedROI === null ? null : Number(body.expectedROI);
    const tenure = body.tenure === undefined
      ? project.tenure ?? null
      : body.tenure === "" || body.tenure === null ? null : Number(body.tenure);
    const category = body.category ?? project.category ?? "";
    const totalLandArea = Number(body.totalLandArea ?? project.totalLandArea);
    const landAreaUnit = body.landAreaUnit ?? project.landAreaUnit;
    const latitudeValue = body.latitude === undefined
      ? project.latitude ?? null
      : body.latitude === "" || body.latitude === null ? null : Number(body.latitude);
    const longitudeValue = body.longitude === undefined
      ? project.longitude ?? null
      : body.longitude === "" || body.longitude === null ? null : Number(body.longitude);
    const name = body.name === undefined ? project.name : body.name;
    const projectType = body.projectType ?? project.projectType;
    const status = body.status ?? project.status;
    const address = body.address ?? project.address ?? "";
    const street = body.street ?? project.street ?? "";
    const city = body.city ?? project.city ?? project.location ?? "";
    const pincode = body.pincode ?? project.pincode ?? "";
    const description = body.description ?? project.description ?? "";
    const landAreaUnits = ["Sq. Ft.", "Sq. Yards", "Acres", "Sq. Meters"];
    const categories = ["Real Estate", "Energy", "Farmland", "Commercial"];

    if (typeof name !== "string" || !name.trim() ||
      !["Leasing", "Ownership"].includes(projectType) ||
      !Number.isInteger(totalUnits) || totalUnits < 1 ||
      !Number.isInteger(soldUnits) || soldUnits < 0 || soldUnits > totalUnits ||
      !Number.isFinite(initialValue) || initialValue < 0 ||
      !Number.isFinite(currentValue) || currentValue < 0 ||
      (expectedROI !== null && (!Number.isFinite(expectedROI) || expectedROI < 0)) ||
      (tenure !== null && (!Number.isFinite(tenure) || tenure < 0)) ||
      (category !== "" && !categories.includes(category)) ||
      !Number.isFinite(totalLandArea) || totalLandArea <= 0 ||
      !landAreaUnits.includes(landAreaUnit) ||
      (latitudeValue !== null && (!Number.isFinite(latitudeValue) || latitudeValue < -90 || latitudeValue > 90)) ||
      (longitudeValue !== null && (!Number.isFinite(longitudeValue) || longitudeValue < -180 || longitudeValue > 180)) ||
      typeof address !== "string" || typeof street !== "string" || typeof city !== "string" ||
      typeof description !== "string" ||
      (pincode !== "" && (typeof pincode !== "string" || !/^[1-9][0-9]{5}$/.test(pincode))) ||
      !["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ message: "Enter valid project details" });
    }

    data.stats.totalUnits += totalUnits - Number(project.totalUnits || 0);
    const nextProject = {
      ...project,
      name: name.trim(),
      description: description.trim(),
      category,
      projectType,
      totalUnits,
      soldUnits,
      availableUnits: totalUnits - soldUnits,
      initialValue,
      currentValue,
      expectedROI,
      tenure,
      pricePerUnit: currentValue / totalUnits,
      totalLandArea,
      landAreaUnit,
      unitsPerArea: totalUnits / totalLandArea,
      status,
      latitude: latitudeValue,
      longitude: longitudeValue,
      address: address.trim(),
      street: street.trim(),
      city: city.trim(),
      location: city.trim(),
      pincode
    };

    data.projects[projectIndex] = nextProject;
    fs.writeFileSync(dashboardFile, `${JSON.stringify(data, null, 2)}\n`);

    res.json({ project: nextProject, stats: { totalUnits: data.stats.totalUnits } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update project" });
  }
});

app.post("/api/projects", parseProjectUpload, (req, res) => {
  let projectDetails;
  try {
    projectDetails = JSON.parse(req.body.project || "{}");
  } catch (error) {
    removeUploadedFiles(req.files);
    return res.status(400).json({ message: "Enter valid project details" });
  }

  const {
    name,
    description = "",
    category,
    projectType,
    totalUnits,
    soldUnits = 0,
    initialValue,
    currentValue,
    expectedROI,
    tenure,
    totalLandArea,
    landAreaUnit,
    status = "Active",
    latitude,
    longitude,
    address = "",
    street = "",
    city = "",
    pincode = ""
  } = projectDetails;
  const total = Number(totalUnits);
  const sold = Number(soldUnits);
  const initialValueNumber = Number(initialValue);
  const currentValueNumber = Number(currentValue);
  const expectedROINumber = expectedROI == null || expectedROI === "" ? null : Number(expectedROI);
  const tenureNumber = tenure == null || tenure === "" ? null : Number(tenure);
  const landArea = Number(totalLandArea);
  const latitudeValue = latitude == null || latitude === "" ? null : Number(latitude);
  const longitudeValue = longitude == null || longitude === "" ? null : Number(longitude);
  const landAreaUnits = ["Sq. Ft.", "Sq. Yards", "Acres", "Sq. Meters"];
  const categories = ["Real Estate", "Energy", "Farmland", "Commercial"];
  const uploadedPhotos = req.files?.photos || [];
  const uploadedVideos = req.files?.videos || [];

  const oversizedPhoto = uploadedPhotos.some((file) => file.size > maxImageSize);
  if (oversizedPhoto) {
    removeUploadedFiles(req.files);
    return res.status(400).json({ message: "Image size must be less than 5 MB." });
  }

  if (typeof name !== "string" || !name.trim() ||
    !categories.includes(category) ||
    typeof description !== "string" ||
    !["Leasing", "Ownership"].includes(projectType) ||
    !Number.isInteger(total) || total < 1 ||
    !Number.isInteger(sold) || sold < 0 || sold > total ||
    !Number.isFinite(initialValueNumber) || initialValueNumber < 0 ||
    !Number.isFinite(currentValueNumber) || currentValueNumber < 0 ||
    (expectedROINumber !== null && (!Number.isFinite(expectedROINumber) || expectedROINumber < 0)) ||
    (tenureNumber !== null && (!Number.isFinite(tenureNumber) || tenureNumber < 0)) ||
    !Number.isFinite(landArea) || landArea <= 0 ||
    !landAreaUnits.includes(landAreaUnit) ||
    (latitudeValue !== null && (!Number.isFinite(latitudeValue) || latitudeValue < -90 || latitudeValue > 90)) ||
    (longitudeValue !== null && (!Number.isFinite(longitudeValue) || longitudeValue < -180 || longitudeValue > 180)) ||
    typeof address !== "string" ||
    typeof street !== "string" ||
    typeof city !== "string" ||
    (pincode !== "" && (typeof pincode !== "string" || !/^[1-9][0-9]{5}$/.test(pincode))) ||
    !["Active", "Inactive"].includes(status)) {
    removeUploadedFiles(req.files);
    return res.status(400).json({ message: "Enter valid project details" });
  }

  try {
    const data = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
    const project = {
      id: Math.max(0, ...data.projects.map((item) => Number(item.id) || 0)) + 1,
      name: name.trim(),
      description: description.trim(),
      category,
      location: city.trim(),
      projectType,
      totalUnits: total,
      soldUnits: sold,
      availableUnits: total - sold,
      initialValue: initialValueNumber,
      currentValue: currentValueNumber,
      expectedROI: expectedROINumber,
      tenure: tenureNumber,
      pricePerUnit: currentValueNumber / total,
      totalLandArea: landArea,
      landAreaUnit,
      unitsPerArea: total / landArea,
      status,
      latitude: latitudeValue,
      longitude: longitudeValue,
      address: address.trim(),
      street: street.trim(),
      city: city.trim(),
      pincode,
      photos: uploadedPhotos.map((file) => `http://localhost:${PORT}/uploads/${file.filename}`),
      videos: uploadedVideos.map((file) => `http://localhost:${PORT}/uploads/${file.filename}`)
    };

    data.projects.push(project);
    data.stats.totalProjects += 1;
    data.stats.totalUnits += total;
    fs.writeFileSync(dashboardFile, `${JSON.stringify(data, null, 2)}\n`);

    res.status(201).json({
      project,
      totalProjects: data.stats.totalProjects,
      totalUnits: data.stats.totalUnits
    });
  } catch (error) {
    console.error(error);
    removeUploadedFiles(req.files);
    res.status(500).json({ message: "Unable to save project" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Bhoomani Admin API is running"
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});