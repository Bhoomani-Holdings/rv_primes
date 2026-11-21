const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/rvprimes";

app.use(cors());
app.use(express.json());

const dashboardFile = process.env.DASHBOARD_FILE || path.join(
  __dirname,
  "data",
  "dashboard.json"
);
const dashboardSchema = new mongoose.Schema({
  _id: { type: String, default: "primary" },
  stats: { type: mongoose.Schema.Types.Mixed, default: {} },
  projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
  salesOverview: { type: [mongoose.Schema.Types.Mixed], default: [] },
  kycApprovals: { type: mongoose.Schema.Types.Mixed, default: {} },
  transactions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  revenueOverview: { type: mongoose.Schema.Types.Mixed, default: {} },
  careerPosts: { type: [mongoose.Schema.Types.Mixed], default: [] },
  careerApplications: { type: [mongoose.Schema.Types.Mixed], default: [] },
  employees: { type: [mongoose.Schema.Types.Mixed], default: [] },
  users: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, { collection: "dashboard", versionKey: false });
const Dashboard = mongoose.model("Dashboard", dashboardSchema);
const employeeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  firstName: { type: String, trim: true, default: "" },
  lastName: { type: String, trim: true, default: "" },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, required: true, trim: true },
  userRole: { type: String, required: true, enum: ["manager", "employee"] },
  department: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  educationalQualifications: { type: String, required: true, trim: true },
  passportNumber: { type: String, default: "", trim: true },
  aadhaarNumber: { type: String, required: true, select: false, trim: true },
  aadhaarFrontDocument: { type: String, required: true, select: false },
  aadhaarBackDocument: { type: String, required: true, select: false },
  panNumber: { type: String, required: true, select: false, trim: true, uppercase: true },
  panDocument: { type: String, required: true, select: false },
  blankChequeDocument: { type: String, required: true, select: false },
  joiningDate: { type: String, required: true },
  bankName: { type: String, required: true, trim: true },
  accountHolderName: { type: String, required: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  ifscCode: { type: String, required: true, trim: true, uppercase: true },
  bankBranch: { type: String, required: true, trim: true },
  profilePicture: { type: String, default: "" },
  status: { type: String, default: "Active" }
}, { collection: "employees", timestamps: true, versionKey: false });
const Employee = mongoose.model("Employee", employeeSchema);
const userCredentialSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { collection: "usercredentials", timestamps: true, versionKey: false });
const UserCredential = mongoose.model("UserCredential", userCredentialSchema);
const kycApprovalSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  facePhotos: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, default: "Pending for Approval" },
  approvalDetails: { type: mongoose.Schema.Types.Mixed, default: null }
}, { collection: "kycapprovals", timestamps: true, versionKey: false });
const KycApproval = mongoose.model("KycApproval", kycApprovalSchema);
const investorSessionSchema = new mongoose.Schema({
  userId: { type: Number, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { collection: "investorsessions", timestamps: true, versionKey: false });
investorSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const InvestorSession = mongoose.model("InvestorSession", investorSessionSchema);
const staffSessionSchema = new mongoose.Schema({
  subjectId: { type: String, required: true, index: true },
  userRole: { type: String, required: true, enum: ["admin", "manager", "employee"] },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
}, { collection: "staffsessions", timestamps: true, versionKey: false });
staffSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const StaffSession = mongoose.model("StaffSession", staffSessionSchema);
const investorLedgerEntrySchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  type: { type: String, required: true, enum: ["Investment", "Earning", "Deposit", "Withdrawal"] },
  description: { type: String, required: true, trim: true, maxlength: 200 },
  projectName: { type: String, default: "", trim: true, maxlength: 120 },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, required: true, enum: ["Pending", "Completed", "Failed"] },
  reference: { type: String, required: true, trim: true, unique: true }
}, { collection: "investorledgerentries", timestamps: true, versionKey: false });
investorLedgerEntrySchema.index({ userId: 1, createdAt: -1 });
const InvestorLedgerEntry = mongoose.model("InvestorLedgerEntry", investorLedgerEntrySchema);
const investorHoldingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  projectName: { type: String, required: true, trim: true, maxlength: 160 },
  location: { type: String, default: "", trim: true, maxlength: 160 },
  unit: { type: String, default: "", trim: true, maxlength: 80 },
  purchasedAt: { type: Date, required: true },
  units: { type: Number, required: true, min: 0 },
  investedAmount: { type: Number, required: true, min: 0 },
  currentValue: { type: Number, required: true, min: 0 },
  status: { type: String, required: true, enum: ["Active", "Matured", "Pending", "Closed"] }
}, { collection: "investorholdings", timestamps: true, versionKey: false });
investorHoldingSchema.index({ userId: 1, purchasedAt: -1 });
const InvestorHolding = mongoose.model("InvestorHolding", investorHoldingSchema);
const investorWithdrawalSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  amount: { type: Number, required: true, min: 0 },
  status: { type: String, required: true, enum: ["Pending", "Approved", "Rejected", "Paid"] },
  reference: { type: String, required: true, trim: true, unique: true },
  requestedAt: { type: Date, default: Date.now }
}, { collection: "investorwithdrawals", timestamps: true, versionKey: false });
investorWithdrawalSchema.index({ userId: 1, requestedAt: -1 });
const InvestorWithdrawal = mongoose.model("InvestorWithdrawal", investorWithdrawalSchema);
const investorNotificationSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  readAt: { type: Date, default: null }
}, { collection: "investornotifications", timestamps: true, versionKey: false });
investorNotificationSchema.index({ userId: 1, createdAt: -1 });
const InvestorNotification = mongoose.model("InvestorNotification", investorNotificationSchema);
const staffNotificationSchema = new mongoose.Schema({
  recipientRole: { type: String, required: true, enum: ["admin", "manager", "employee"] },
  recipientId: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  readAt: { type: Date, default: null }
}, { collection: "staffnotifications", timestamps: true, versionKey: false });
staffNotificationSchema.index({ recipientRole: 1, recipientId: 1, createdAt: -1 });
const StaffNotification = mongoose.model("StaffNotification", staffNotificationSchema);
const investorSupportTicketSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" }
}, { collection: "investorsupporttickets", timestamps: true, versionKey: false });
investorSupportTicketSchema.index({ userId: 1, createdAt: -1 });
const InvestorSupportTicket = mongoose.model("InvestorSupportTicket", investorSupportTicketSchema);

const cleanDashboard = (dashboard) => {
  if (!dashboard) return null;
  const result = dashboard.toObject ? dashboard.toObject() : dashboard;
  delete result._id;
  return result;
};

const readDashboard = async () => cleanDashboard(await Dashboard.findById("primary"));
const employeeResponse = (employee) => {
  const result = { ...employee };
  for (const field of [
    "passwordHash",
    "aadhaarNumber",
    "panNumber",
    "aadhaarFrontDocument",
    "aadhaarBackDocument",
    "panDocument",
    "blankChequeDocument"
  ]) {
    delete result[field];
  }
  return result;
};
const saveDashboard = async (dashboard) => {
  const saved = await Dashboard.findOneAndReplace(
    { _id: "primary" },
    { ...dashboard, _id: "primary" },
    { upsert: true, new: true }
  );
  return cleanDashboard(saved);
};

const hashInvestorToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const requireInvestor = async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const match = /^Bearer ([A-Za-z0-9_-]+)$/.exec(authorization);
  if (!match) return res.status(401).json({ message: "Sign in to access investor data." });

  try {
    const tokenHash = hashInvestorToken(match[1]);
    const session = await InvestorSession.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    }).lean();
    if (!session) return res.status(401).json({ message: "Your investor session has expired. Sign in again." });

    const data = await readDashboard();
    const user = (data?.users || []).find((item) => Number(item.id) === session.userId);
    if (!user || user.approvalStatus !== "Approved") {
      await InvestorSession.deleteOne({ _id: session._id });
      return res.status(401).json({ message: "This investor account is no longer authorized." });
    }

    req.investor = { userId: session.userId, user, tokenHash };
    return next();
  } catch (error) {
    console.error("Unable to validate investor session:", error);
    return res.status(500).json({ message: "Unable to validate investor session." });
  }
};

const requireStaff = (...allowedRoles) => async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const match = /^Bearer ([A-Za-z0-9_-]+)$/.exec(authorization);
  if (!match) return res.status(401).json({ message: "Sign in with an authorized staff account." });

  try {
    const tokenHash = hashInvestorToken(match[1]);
    const session = await StaffSession.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() }
    }).lean();
    if (!session) return res.status(401).json({ message: "Your staff session has expired. Sign in again." });
    if (!allowedRoles.includes(session.userRole)) {
      return res.status(403).json({ message: "Your account cannot access this staff resource." });
    }

    if (session.userRole === "admin") {
      const configuredEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      if (!configuredEmail || session.subjectId !== configuredEmail) {
        await StaffSession.deleteOne({ _id: session._id });
        return res.status(401).json({ message: "This admin session is no longer authorized." });
      }
      req.staff = { userRole: "admin", email: configuredEmail, tokenHash };
      return next();
    }

    const employee = await Employee.findOne({
      id: Number(session.subjectId),
      status: "Active"
    }).select("id fullName email userRole").lean();
    if (!employee || employee.userRole !== session.userRole) {
      await StaffSession.deleteOne({ _id: session._id });
      return res.status(401).json({ message: "This staff account is no longer authorized." });
    }

    req.staff = { ...employee, tokenHash };
    return next();
  } catch (error) {
    console.error("Unable to validate staff session:", error);
    return res.status(500).json({ message: "Unable to validate staff session." });
  }
};

const createStaffSession = async (subjectId, userRole) => {
  const accessToken = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  await StaffSession.create({
    subjectId: String(subjectId),
    userRole,
    tokenHash: hashInvestorToken(accessToken),
    expiresAt
  });
  return { accessToken, expiresAt };
};
const safeEqualStrings = (first, second) => {
  const firstHash = crypto.createHash("sha256").update(first).digest();
  const secondHash = crypto.createHash("sha256").update(second).digest();
  return first.length === second.length && crypto.timingSafeEqual(firstHash, secondHash);
};

const ensureInvestorCollections = async () => {
  for (const model of [
    InvestorSession,
    StaffSession,
    InvestorLedgerEntry,
    InvestorHolding,
    InvestorWithdrawal,
    InvestorNotification,
    StaffNotification,
    InvestorSupportTicket
  ]) {
    try {
      await model.createCollection();
    } catch (error) {
      if (error.code !== 48 && error.codeName !== "NamespaceExists") throw error;
    }
    await model.createIndexes();
  }
};

const initializeDatabase = async () => {
  await mongoose.connect(MONGODB_URI);
  await ensureInvestorCollections();
  const initialData = JSON.parse(fs.readFileSync(dashboardFile, "utf-8"));
  const existingData = await readDashboard();
  if (existingData) {
    const completedData = { ...initialData, ...existingData };
    const missingFields = ["stats", "projects", "salesOverview", "kycApprovals", "transactions", "revenueOverview", "careerPosts", "careerApplications", "employees", "users"]
      .filter((field) => existingData[field] === undefined);
    if (missingFields.length > 0) await saveDashboard(completedData);
    return;
  }

  await Dashboard.create({ ...initialData, _id: "primary" });
  console.log(`Seeded MongoDB database "${mongoose.connection.name}" from backend/data/dashboard.json`);
};
const uploadDirectory = path.join(__dirname, "uploads");
const resumeUploadDirectory = path.join(__dirname, "private_uploads", "resumes");
const employeeDocumentUploadDirectory = path.join(__dirname, "private_uploads", "employee-documents");
const kycFacePhotoDirectory = path.join(__dirname, "private_uploads", "kyc-face-photos");
const maxImageSize = 5 * 1024 * 1024;
const maxVideoSize = 50 * 1024 * 1024;
const maxResumeSize = 5 * 1024 * 1024;

fs.mkdirSync(uploadDirectory, { recursive: true });
fs.mkdirSync(resumeUploadDirectory, { recursive: true });
fs.mkdirSync(employeeDocumentUploadDirectory, { recursive: true });
fs.mkdirSync(kycFacePhotoDirectory, { recursive: true });
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

const allowedResumeExtensions = new Set([".pdf", ".doc", ".docx"]);
const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: resumeUploadDirectory,
    filename: (req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    }
  }),
  limits: { fileSize: maxResumeSize },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedResumeExtensions.has(extension)) {
      return callback(new Error("Upload your resume as a PDF, DOC, or DOCX file."));
    }
    callback(null, true);
  }
});

const profilePictureUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    }
  }),
  limits: { fileSize: maxImageSize },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedMediaExtensions.photos.has(extension) || !file.mimetype.startsWith("image/")) {
      return callback(new Error("Upload a JPG, PNG, or WEBP profile picture."));
    }
    callback(null, true);
  }
});

const facePhotoUpload = multer({
  storage: multer.diskStorage({
    destination: kycFacePhotoDirectory,
    filename: (req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    }
  }),
  limits: { fileSize: maxImageSize },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedMediaExtensions.photos.has(extension) || !file.mimetype.startsWith("image/")) {
      return callback(new Error("Upload a JPG, PNG, or WEBP face photo."));
    }
    callback(null, true);
  }
});

const employeeCreateUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => callback(null, file.fieldname === "profilePicture" ? uploadDirectory : employeeDocumentUploadDirectory),
    filename: (req, file, callback) => {
      callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    }
  }),
  limits: { fileSize: maxImageSize },
  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedFields = new Set(["profilePicture", "aadhaarFrontImage", "aadhaarBackImage", "panImage", "blankChequeImage"]);
    if (!allowedFields.has(file.fieldname) || !allowedMediaExtensions.photos.has(extension) || !file.mimetype.startsWith("image/")) {
      return callback(new Error("Upload employee documents as JPG, PNG, or WEBP images."));
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

app.get("/api/dashboard", async (req, res) => {
  try {
    const [data, holdings, earnings] = await Promise.all([
      readDashboard(),
      InvestorHolding.find().select("investedAmount").lean(),
      InvestorLedgerEntry.find({ type: "Earning" }).select("amount status").lean()
    ]);
    const projects = Array.isArray(data?.projects) ? data.projects : [];
    const users = Array.isArray(data?.users) ? data.users : [];
    const totalUnits = projects.reduce((total, project) => total + (Number(project.totalUnits) || 0), 0);
    const totalSales = holdings.reduce((total, holding) => total + (Number(holding.investedAmount) || 0), 0);
    const totalRevenue = earnings
      .filter((entry) => entry.status === "Completed")
      .reduce((total, entry) => total + (Number(entry.amount) || 0), 0);
    const pendingRevenue = earnings
      .filter((entry) => entry.status === "Pending")
      .reduce((total, entry) => total + (Number(entry.amount) || 0), 0);
    const kycApprovals = { pending: 0, approved: 0, rejected: 0 };
    const requiredKycDocuments = ["uploadpancard", "uploadaadhaar", "uploadaddressproof", "selfiephoto"];
    users.forEach((user) => {
      if (!user.kycDetails || requiredKycDocuments.some((field) => !user.kycDetails[field])) return;
      const status = String(user.kycStatus || "Pending for Approval").toLowerCase();
      if (status === "approved" || status === "accept") kycApprovals.approved += 1;
      else if (status === "rejected" || status === "reject") kycApprovals.rejected += 1;
      else kycApprovals.pending += 1;
    });

    res.json({
      ...data,
      stats: {
        ...(data?.stats || {}),
        totalProjects: projects.length,
        totalUnits,
        totalInvestors: users.length,
        totalSales,
        totalRevenue
      },
      kycApprovals,
      revenueOverview: { totalRevenue, pendingRevenue }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to load dashboard data"
    });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const data = await readDashboard();
    res.json(data.projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load projects" });
  }
});

app.get("/api/careers", async (req, res) => {
  try {
    const data = await readDashboard();
    res.json(data.careerPosts || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load career posts" });
  }
});

app.post("/api/careers", async (req, res) => {
  const { title, department, location, employmentType, experience, salaryRange, description, requirements } = req.body || {};
  const requiredFields = { title, department, location, employmentType, description };
  if (Object.values(requiredFields).some((value) => typeof value !== "string" || !value.trim()) ||
    (experience !== "" && experience != null && (!Number.isFinite(Number(experience)) || Number(experience) < 0)) ||
    typeof salaryRange !== "string" || typeof requirements !== "string") {
    return res.status(400).json({ message: "Complete the required career details" });
  }

  try {
    const data = await readDashboard();
    data.careerPosts = Array.isArray(data.careerPosts) ? data.careerPosts : [];
    const career = {
      id: Math.max(0, ...data.careerPosts.map((item) => Number(item.id) || 0)) + 1,
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employmentType: employmentType.trim(),
      experience: experience === "" || experience == null ? null : Number(experience),
      salaryRange: salaryRange.trim(),
      description: description.trim(),
      requirements: requirements.trim(),
      status: "Open",
      createdAt: new Date().toISOString()
    };
    data.careerPosts.unshift(career);
    await saveDashboard(data);
    return res.status(201).json(career);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save career post" });
  }
});

app.patch("/api/careers/:id", async (req, res) => {
  const { title, department, location, employmentType, experience, salaryRange, description, requirements } = req.body || {};
  const requiredFields = { title, department, location, employmentType, description };
  if (Object.values(requiredFields).some((value) => typeof value !== "string" || !value.trim()) ||
    (experience !== "" && experience != null && (!Number.isFinite(Number(experience)) || Number(experience) < 0)) ||
    typeof salaryRange !== "string" || typeof requirements !== "string") {
    return res.status(400).json({ message: "Complete the required career details" });
  }

  try {
    const data = await readDashboard();
    const career = (data.careerPosts || []).find((item) => String(item.id) === String(req.params.id));
    if (!career) return res.status(404).json({ message: "Career opening not found" });

    Object.assign(career, {
      title: title.trim(),
      department: department.trim(),
      location: location.trim(),
      employmentType: employmentType.trim(),
      experience: experience === "" || experience == null ? null : Number(experience),
      salaryRange: salaryRange.trim(),
      description: description.trim(),
      requirements: requirements.trim()
    });

    await saveDashboard(data);
    return res.json(career);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update career post" });
  }
});

app.patch("/api/careers/:id/status", async (req, res) => {
  const { status } = req.body || {};
  if (status !== "Closed") {
    return res.status(400).json({ message: "Invalid career status" });
  }

  try {
    const data = await readDashboard();
    const career = (data.careerPosts || []).find((item) => String(item.id) === String(req.params.id));
    if (!career) return res.status(404).json({ message: "Career opening not found" });

    career.status = status;
    await saveDashboard(data);
    return res.json(career);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to close career position" });
  }
});

app.post("/api/careers/:id/applications", (req, res, next) => {
  resumeUpload.single("resume")(req, res, (error) => {
    if (!error) return next();
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Resume file must be 5 MB or smaller."
      : error.message || "Unable to upload resume.";
    return res.status(400).json({ message });
  });
}, async (req, res) => {
  const { fullName, email, phone, experience, currentCTC, linkedin = "", coverLetter = "" } = req.body || {};
  const removeResume = () => {
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        if (error.code !== "ENOENT") console.error(error);
      }
    }
  };
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const validPhone = typeof phone === "string" && /^[0-9+() .-]{7,24}$/.test(phone.trim());

  const experienceNumber = Number(experience);
  if (typeof fullName !== "string" || !fullName.trim() || !validEmail || !validPhone ||
    typeof experience !== "string" || !experience.trim() || !Number.isFinite(experienceNumber) || experienceNumber < 0 ||
    typeof currentCTC !== "string" || !currentCTC.trim() || !req.file) {
    removeResume();
    return res.status(400).json({ message: "Enter your contact details, experience, current CTC, and attach your resume." });
  }

  try {
    const data = await readDashboard();
    const careerId = Number(req.params.id);
    const career = (data.careerPosts || []).find((item) => Number(item.id) === careerId);
    if (!career || career.status === "Closed") {
      removeResume();
      return res.status(404).json({ message: "This career opening is no longer available." });
    }

    data.careerApplications = Array.isArray(data.careerApplications) ? data.careerApplications : [];
    const application = {
      id: Math.max(0, ...data.careerApplications.map((item) => Number(item.id) || 0)) + 1,
      careerId,
      careerTitle: career.title,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      experience: experienceNumber,
      currentCTC: currentCTC.trim(),
      linkedin: typeof linkedin === "string" ? linkedin.trim() : "",
      coverLetter: typeof coverLetter === "string" ? coverLetter.trim() : "",
      resume: {
        fileName: req.file.filename,
        originalName: path.basename(req.file.originalname),
        size: req.file.size,
        contentType: req.file.mimetype,
        storagePath: path.relative(__dirname, req.file.path)
      },
      submittedAt: new Date().toISOString()
    };

    data.careerApplications.push(application);
    await saveDashboard(data);
    return res.status(201).json({ message: "Your application was submitted successfully." });
  } catch (error) {
    console.error(error);
    removeResume();
    return res.status(500).json({ message: "Unable to submit your application. Please try again." });
  }
});

app.get("/api/careers/:id/applications", async (req, res) => {
  try {
    const data = await readDashboard();
    const careerId = Number(req.params.id);
    const career = (data.careerPosts || []).find((item) => Number(item.id) === careerId);
    if (!career) return res.status(404).json({ message: "Career opening not found" });
    const applications = (data.careerApplications || [])
      .filter((application) => Number(application.careerId) === careerId)
      .sort((first, second) => Date.parse(second.submittedAt || "") - Date.parse(first.submittedAt || ""));
    return res.json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load career applicants" });
  }
});

app.get("/api/careers/:careerId/applications/:applicationId/resume", async (req, res) => {
  try {
    const data = await readDashboard();
    const careerId = Number(req.params.careerId);
    const application = (data.careerApplications || []).find((item) =>
      Number(item.careerId) === careerId && String(item.id) === String(req.params.applicationId)
    );
    if (!application?.resume?.storagePath) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const resumePath = path.resolve(__dirname, application.resume.storagePath);
    const relativePath = path.relative(resumeUploadDirectory, resumePath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath) || !fs.existsSync(resumePath)) {
      return res.status(404).json({ message: "Resume file is unavailable" });
    }

    const contentType = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
      .includes(application.resume.contentType) ? application.resume.contentType : "application/octet-stream";
    const filename = path.basename(application.resume.originalName || "resume");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(filename)}`);
    return res.sendFile(resumePath);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to open resume" });
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const data = await readDashboard();
    for (const legacyEmployee of data.employees || []) {
      await Employee.updateOne(
        { email: legacyEmployee.email },
        { $setOnInsert: legacyEmployee },
        { upsert: true }
      );
    }
    const employees = await Employee.find().select("+passwordHash").sort({ createdAt: -1, id: -1 }).lean();
    return res.json(employees.map((employee) => {
      const nameParts = String(employee.fullName || "").trim().split(/\s+/);
      employee.firstName = employee.firstName || nameParts[0] || "";
      employee.lastName = employee.lastName || nameParts.slice(1).join(" ");
      const hasPassword = Boolean(employee.passwordHash);
      return { ...employeeResponse(employee), hasPassword };
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load employees" });
  }
});

const updateEmployeeRecord = async (req, res) => {
 const editableFields = new Set(["firstName", "lastName", "fullName", "email", "phone", "userRole", "department", "designation", "educationalQualifications", "passportNumber", "joiningDate", "bankName", "accountHolderName", "accountNumber", "ifscCode", "bankBranch", "status", "password"]);
  const updates = req.body;
  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    return res.status(400).json({ message: "Provide employee details to update." });
  }

  const fields = Object.keys(updates);
  if (fields.length === 0 || fields.some((field) => !editableFields.has(field))) {
    return res.status(400).json({ message: "One or more employee fields cannot be updated." });
  }

  for (const field of fields) {
    if (typeof updates[field] !== "string" || (field !== "password" && field !== "passportNumber" && !updates[field].trim())) {
      return res.status(400).json({ message: "Employee fields cannot be empty." });
    }
  }

  const normalizedUpdates = { ...updates };
  if (normalizedUpdates.fullName) normalizedUpdates.fullName = normalizedUpdates.fullName.trim();
  for (const field of ["firstName", "lastName"]) {
    if (normalizedUpdates[field]) normalizedUpdates[field] = normalizedUpdates[field].trim();
  }
  if (normalizedUpdates.email) {
    normalizedUpdates.email = normalizedUpdates.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedUpdates.email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
  }
  if (normalizedUpdates.phone) {
    normalizedUpdates.phone = normalizedUpdates.phone.trim();
    if (!/^[0-9+() .-]{7,24}$/.test(normalizedUpdates.phone)) {
      return res.status(400).json({ message: "Enter a valid phone number." });
    }
  }
  for (const field of ["department", "designation", "educationalQualifications", "passportNumber"]) {
    if (normalizedUpdates[field]) normalizedUpdates[field] = normalizedUpdates[field].trim();
  }
  for (const field of ["bankName", "accountHolderName", "accountNumber", "bankBranch"]) {
    if (normalizedUpdates[field]) normalizedUpdates[field] = normalizedUpdates[field].trim();
  }
  if (normalizedUpdates.ifscCode) normalizedUpdates.ifscCode = normalizedUpdates.ifscCode.trim().toUpperCase();
  if (normalizedUpdates.userRole && !["manager", "employee"].includes(normalizedUpdates.userRole)) {
    return res.status(400).json({ message: "Choose a valid user role." });
  }
  if (normalizedUpdates.status && !["Active", "Inactive"].includes(normalizedUpdates.status)) {
    return res.status(400).json({ message: "Choose a valid employee status." });
  }
  if (normalizedUpdates.password !== undefined) {
    if (normalizedUpdates.password.length < 8) {
      return res.status(400).json({ message: "A new password must be at least 8 characters long." });
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(normalizedUpdates.password, salt, 64).toString("hex");
    normalizedUpdates.passwordHash = `scrypt$${salt}$${hash}`;
    delete normalizedUpdates.password;
  }
  if (normalizedUpdates.joiningDate) {
    const date = new Date(`${normalizedUpdates.joiningDate}T00:00:00Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalizedUpdates.joiningDate) {
      return res.status(400).json({ message: "Enter a valid joining date." });
    }
  }

  try {
    if (normalizedUpdates.firstName !== undefined || normalizedUpdates.lastName !== undefined) {
      const existingEmployee = await Employee.findOne({ id: Number(req.params.id) }).select("firstName lastName fullName").lean();
      if (!existingEmployee) return res.status(404).json({ message: "Employee not found." });
      const existingNameParts = String(existingEmployee.fullName || "").trim().split(/\s+/);
      const firstName = normalizedUpdates.firstName !== undefined
        ? normalizedUpdates.firstName
        : existingEmployee.firstName || existingNameParts[0] || "";
      const lastName = normalizedUpdates.lastName !== undefined
        ? normalizedUpdates.lastName
        : existingEmployee.lastName || existingNameParts.slice(1).join(" ");
      normalizedUpdates.firstName = firstName;
      normalizedUpdates.lastName = lastName;
      normalizedUpdates.fullName = `${firstName} ${lastName}`.trim();
    } else if (normalizedUpdates.fullName) {
      const nameParts = normalizedUpdates.fullName.split(/\s+/);
      normalizedUpdates.firstName = nameParts[0] || "";
      normalizedUpdates.lastName = nameParts.slice(1).join(" ");
    }
    const employee = await Employee.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: normalizedUpdates },
      { new: true, runValidators: true }
    ).lean();
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    return res.json(employeeResponse(employee));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An employee with this email already exists." });
    console.error(error);
    return res.status(500).json({ message: "Unable to update employee." });
  }
};

app.patch("/api/employees/:id", updateEmployeeRecord);

app.post("/api/employees/:id/profile-picture", (req, res) => {
  profilePictureUpload.single("profilePicture")(req, res, async (uploadError) => {
    if (uploadError) {
      const message = uploadError.code === "LIMIT_FILE_SIZE"
        ? "Profile picture must be 5 MB or smaller."
        : uploadError.message || "Unable to upload profile picture.";
      return res.status(400).json({ message });
    }
    if (!req.file) return res.status(400).json({ message: "Choose a profile picture to upload." });
    try {
      const employee = await Employee.findOneAndUpdate(
        { id: Number(req.params.id) },
        { profilePicture: `/uploads/${req.file.filename}` },
        { new: true }
      ).select("id profilePicture").lean();
      if (!employee) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Employee not found." });
      }
      return res.json(employee);
    } catch (error) {
      try { fs.unlinkSync(req.file.path); } catch (unlinkError) { if (unlinkError.code !== "ENOENT") console.error(unlinkError); }
      console.error(error);
      return res.status(500).json({ message: "Unable to save profile picture." });
    }
  });
});

const createEmployeeRecord = async (req, res) => {
  const files = req.files || {};
  const {
    firstName, lastName, email, password, phone, userRole, department,
    designation, educationalQualifications, passportNumber = "", joiningDate,
    bankName, accountHolderName, accountNumber, ifscCode, bankBranch,
    aadhaarNumber, panNumber
  } = req.body || {};
  const getDocument = (field) => req.files?.[field]?.[0];
  const profilePictureFile = getDocument("profilePicture");
  const aadhaarFrontDocument = getDocument("aadhaarFrontImage");
  const aadhaarBackDocument = getDocument("aadhaarBackImage");
  const panDocument = getDocument("panImage");
  const blankChequeDocument = getDocument("blankChequeImage");
  const fields = [firstName, lastName, email, password, phone, userRole, department, designation, educationalQualifications, joiningDate, bankName, accountHolderName, accountNumber, ifscCode, bankBranch, aadhaarNumber, panNumber];
  if (fields.some((value) => typeof value !== "string" || !value.trim()) ||
    !["manager", "employee"].includes(userRole) ||
    password.length < 8 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !/^[0-9+() .-]{7,24}$/.test(phone.trim()) ||
    !/^\d{12}$/.test(aadhaarNumber.trim()) ||
    !/^[A-Z]{5}\d{4}[A-Z]$/i.test(panNumber.trim()) ||
    !aadhaarFrontDocument || !aadhaarBackDocument || !panDocument || !blankChequeDocument) {
    removeUploadedFiles(files);
    return res.status(400).json({ message: "Enter valid employee details, Aadhaar and PAN numbers, and upload all required employee documents." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const highestId = await Employee.findOne().sort({ id: -1 }).select({ id: 1 }).lean();
    const employee = {
      id: (highestId?.id || 0) + 1,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName: `${firstName.trim()} ${lastName.trim()}`,
      email: normalizedEmail,
      passwordHash: (() => {
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto.scryptSync(password, salt, 64).toString("hex");
        return `scrypt$${salt}$${hash}`;
      })(),
      phone: phone.trim(),
      userRole,
      department: department.trim(),
      designation: designation.trim(),
      educationalQualifications: educationalQualifications.trim(),
      passportNumber: typeof passportNumber === "string" ? passportNumber.trim() : "",
      aadhaarNumber: aadhaarNumber.trim(),
      aadhaarFrontDocument: aadhaarFrontDocument.filename,
      aadhaarBackDocument: aadhaarBackDocument.filename,
      panNumber: panNumber.trim().toUpperCase(),
      panDocument: panDocument.filename,
      blankChequeDocument: blankChequeDocument.filename,
      joiningDate,
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      bankBranch: bankBranch.trim(),
      profilePicture: profilePictureFile ? `/uploads/${profilePictureFile.filename}` : "",
      status: "Active"
    };
    const savedEmployee = await Employee.create(employee);
    return res.status(201).json({ ...employeeResponse(savedEmployee.toObject()), hasPassword: true });
  } catch (error) {
    removeUploadedFiles(files);
    if (error.code === 11000) return res.status(409).json({ message: "An employee with this email already exists." });
    console.error(error);
    return res.status(500).json({ message: "Unable to add employee" });
  }
};

app.post("/api/employees", (req, res) => {
  employeeCreateUpload.fields([
      { name: "profilePicture", maxCount: 1 },
      { name: "aadhaarFrontImage", maxCount: 1 },
      { name: "aadhaarBackImage", maxCount: 1 },
      { name: "panImage", maxCount: 1 },
      { name: "blankChequeImage", maxCount: 1 }
  ])(req, res, (uploadError) => {
    if (uploadError) {
      removeUploadedFiles(req.files);
      const message = uploadError.code === "LIMIT_FILE_SIZE"
        ? "Each employee image must be 5 MB or smaller."
        : uploadError.message || "Unable to upload employee documents.";
      return res.status(400).json({ message });
    }
    return createEmployeeRecord(req, res);
  });
});

app.post("/api/employees/login", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || !password) return res.status(400).json({ message: "Enter your employee email and password." });

  try {
    const employee = await Employee.findOne({ email }).select("+passwordHash").lean();
    if (!employee || employee.status !== "Active" || typeof employee.passwordHash !== "string") {
      return res.status(401).json({ message: "Invalid employee email or password." });
    }

    const [scheme, salt, storedHash] = employee.passwordHash.split("$");
    if (scheme !== "scrypt" || !salt || !storedHash) {
      return res.status(401).json({ message: "Invalid employee email or password." });
    }
    const expectedHash = Buffer.from(storedHash, "hex");
    const actualHash = crypto.scryptSync(password, salt, expectedHash.length);
    if (actualHash.length !== expectedHash.length || !crypto.timingSafeEqual(actualHash, expectedHash)) {
      return res.status(401).json({ message: "Invalid employee email or password." });
    }

    const session = await createStaffSession(employee.id, employee.userRole);
    return res.json({
      ...session,
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        fullName: employee.fullName,
        email: employee.email,
        userRole: employee.userRole,
        profilePicture: employee.profilePicture
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to sign in right now. Please try again." });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const configuredEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD || "";
  if (!configuredEmail || !configuredPassword) {
    return res.status(503).json({ message: "Admin sign-in is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in the backend environment." });
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || !password ||
    !safeEqualStrings(email, configuredEmail) ||
    !safeEqualStrings(password, configuredPassword)) {
    return res.status(401).json({ message: "Invalid admin email or password." });
  }

  try {
    const session = await createStaffSession(configuredEmail, "admin");
    return res.json({ ...session, admin: { email: configuredEmail, userRole: "admin" } });
  } catch (error) {
    console.error("Unable to create admin session:", error);
    return res.status(500).json({ message: "Unable to sign in right now. Please try again." });
  }
});

app.delete("/api/staff/session", requireStaff("admin", "manager", "employee"), async (req, res) => {
  try {
    await StaffSession.deleteOne({ tokenHash: req.staff.tokenHash });
    return res.json({ success: true });
  } catch (error) {
    console.error("Unable to end staff session:", error);
    return res.status(500).json({ message: "Unable to end staff session." });
  }
});

app.get("/api/staff/session", requireStaff("admin", "manager", "employee"), (req, res) => {
  return res.json({ userRole: req.staff.userRole });
});

app.get("/api/staff/notifications", requireStaff("admin", "manager", "employee"), async (req, res) => {
  try {
    const recipientId = req.staff.userRole === "admin" ? req.staff.email : String(req.staff.id);
    const notifications = await StaffNotification.find({
      recipientRole: req.staff.userRole,
      recipientId
    }).sort({ createdAt: -1 }).lean();
    return res.json({
      unreadCount: notifications.filter((notification) => !notification.readAt).length,
      notifications
    });
  } catch (error) {
    console.error("Unable to load staff notifications:", error);
    return res.status(500).json({ message: "Unable to load notifications." });
  }
});

app.patch("/api/staff/notifications/read-all", requireStaff("admin", "manager", "employee"), async (req, res) => {
  try {
    const recipientId = req.staff.userRole === "admin" ? req.staff.email : String(req.staff.id);
    const result = await StaffNotification.updateMany({
      recipientRole: req.staff.userRole,
      recipientId,
      readAt: null
    }, { $set: { readAt: new Date() } });
    return res.json({ updated: result.modifiedCount });
  } catch (error) {
    console.error("Unable to mark staff notifications as read:", error);
    return res.status(500).json({ message: "Unable to update notifications." });
  }
});

app.get("/api/users/check-email", async (req, res) => {
  const email = typeof req.query.email === "string" ? req.query.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  try {
    const data = await readDashboard();
    const existsInInvestors = (data.users || []).some((user) => String(user.email || "").trim().toLowerCase() === email);
    const existsInCredentials = await UserCredential.exists({ email });
    return res.json({ available: !existsInInvestors && !existsInCredentials });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to check email availability" });
  }
});

app.post("/api/kyc/face-photo", (req, res) => {
  facePhotoUpload.single("photo")(req, res, (uploadError) => {
    if (uploadError) {
      const message = uploadError.code === "LIMIT_FILE_SIZE"
        ? "Face photo must be 5 MB or smaller."
        : uploadError.message || "Unable to upload face photo.";
      return res.status(400).json({ message });
    }
    if (!req.file) return res.status(400).json({ message: "Choose a face photo to upload." });

    return res.status(201).json({
      url: `/api/kyc/face-photo/${req.file.filename}`,
      capturedAt: new Date().toISOString()
    });
  });
});

app.get("/api/kyc/face-photo/:filename", (req, res) => {
  if (!/^[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$/i.test(req.params.filename)) {
    return res.status(404).json({ message: "Face photo not found" });
  }
  const photoPath = path.join(kycFacePhotoDirectory, req.params.filename);
  return res.sendFile(photoPath, (error) => {
    if (error && !res.headersSent) {
      res.status(error.statusCode === 404 ? 404 : 500).json({
        message: error.statusCode === 404 ? "Face photo not found" : "Unable to open face photo"
      });
    }
  });
});

app.get("/api/users", async (req, res) => {
  try {
    const data = await readDashboard();
    const approvals = await KycApproval.find().select("userId facePhotos approvalDetails").lean();
    const facePhotosByUserId = new Map(approvals.map((approval) => [approval.userId, approval.facePhotos]));
    const approvalDetailsByUserId = new Map(approvals.map((approval) => [approval.userId, approval.approvalDetails]));
    const newestFirst = [...(data.users || [])]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map((user) => {
        const facePhotos = facePhotosByUserId.get(Number(user.id));
        const approvalDetails = approvalDetailsByUserId.get(Number(user.id));
        if (!facePhotos && !approvalDetails) return user;
        return {
          ...user,
          ...(user.kycApproval ? {} : approvalDetails ? { kycApproval: approvalDetails } : {}),
          ...(facePhotos ? { kycDetails: { ...(user.kycDetails || {}), facePhotos } } : {})
        };
      });
    res.json(newestFirst);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load users" });
  }
});

const createInvestorId = (users) => {
  const currentMax = users.reduce((max, user) => {
    const match = /^BHOOM(\d+)$/i.exec(user.investorId || "");
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `BHOOM${String(currentMax + 1).padStart(5, "0")}`;
};

app.post("/api/auth/login", async (req, res) => {
  const submittedEmail = req.body?.email ?? req.body?.username;
  const username = typeof submittedEmail === "string" ? submittedEmail.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!username || !password) {
    return res.status(400).json({ message: "Enter your registered email and password." });
  }

  try {
    const credential = await UserCredential.findOne({ email: username }).lean();
    if (!credential) return res.status(401).json({ message: "Invalid username or password." });

    const [algorithm, salt, storedHash] = credential.passwordHash.split("$");
    if (algorithm !== "scrypt" || !salt || !storedHash) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    const actualHash = crypto.scryptSync(password, salt, 64);
    const expectedHash = Buffer.from(storedHash, "hex");
    if (actualHash.length !== expectedHash.length || !crypto.timingSafeEqual(actualHash, expectedHash)) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const data = await readDashboard();
    const user = (data.users || []).find((item) => Number(item.id) === Number(credential.userId));
    if (!user) return res.status(401).json({ message: "Invalid username or password." });

    const approvalStatus = user.approvalStatus || "Pending for Approval";
    if (approvalStatus === "Pending for Approval") {
      return res.status(403).json({ code: "APPROVAL_PENDING", message: "This application is pending for approval." });
    }
    if (approvalStatus === "Rejected") {
      return res.status(403).json({ code: "APPLICATION_REJECTED", message: "Your application is rejected." });
    }
    if (approvalStatus !== "Approved") {
      return res.status(403).json({ message: "Your account is not approved for login." });
    }

    const accessToken = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await InvestorSession.create({
      userId: user.id,
      tokenHash: hashInvestorToken(accessToken),
      expiresAt
    });

    return res.json({
      accessToken,
      expiresAt,
      user: {
        id: user.id,
        investorId: user.investorId,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        address: user.address,
        address1: user.address1,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        country: user.country,
        nomineeDetails: user.nomineeDetails,
        createdAt: user.createdAt,
        kycStatus: user.kycStatus || "Not Submitted"
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to sign in right now. Please try again." });
  }
});

const getInvestorLedger = (userId) => InvestorLedgerEntry.find({ userId })
  .sort({ createdAt: -1 })
  .lean();
const sumAmounts = (entries, predicate) => entries
  .filter((entry) => predicate(entry))
  .reduce((total, entry) => total + Number(entry.amount || 0), 0);
const getInvestorWalletSummary = (entries) => ({
  availableBalance:
    sumAmounts(entries, (entry) =>
      ["Deposit", "Earning"].includes(entry.type) && entry.status === "Completed") -
    sumAmounts(entries, (entry) =>
      ["Investment", "Withdrawal"].includes(entry.type) && entry.status === "Completed"),
  earningsReceived: sumAmounts(entries, (entry) =>
    entry.type === "Earning" && entry.status === "Completed"),
  pendingEarnings: sumAmounts(entries, (entry) =>
    entry.type === "Earning" && entry.status === "Pending"),
  totalInvested: sumAmounts(entries, (entry) =>
    entry.type === "Investment" && entry.status === "Completed"),
  totalWithdrawn: sumAmounts(entries, (entry) =>
    entry.type === "Withdrawal" && entry.status === "Completed")
});

app.get("/api/investor/investments", requireInvestor, async (req, res) => {
  try {
    const holdings = await InvestorHolding.find({ userId: req.investor.userId })
      .sort({ purchasedAt: -1, createdAt: -1 })
      .lean();
    const totalInvested = holdings.reduce((total, holding) => total + Number(holding.investedAmount || 0), 0);
    const currentPortfolioValue = holdings.reduce((total, holding) => total + Number(holding.currentValue || 0), 0);
    return res.json({
      summary: {
        totalInvested,
        totalUnits: holdings.reduce((total, holding) => total + Number(holding.units || 0), 0),
        currentPortfolioValue,
        appreciationProfit: currentPortfolioValue - totalInvested,
        holdingsCount: holdings.length
      },
      holdings: holdings.map(({ userId, ...holding }) => holding)
    });
  } catch (error) {
    console.error("Unable to load investor holdings:", error);
    return res.status(500).json({ message: "Unable to load investment data." });
  }
});

app.delete("/api/investor/session", requireInvestor, async (req, res) => {
  try {
    await InvestorSession.deleteOne({ tokenHash: req.investor.tokenHash });
    return res.json({ success: true });
  } catch (error) {
    console.error("Unable to end investor session:", error);
    return res.status(500).json({ message: "Unable to end investor session." });
  }
});

app.get("/api/investor/wallet", requireInvestor, async (req, res) => {
  try {
    const entries = await getInvestorLedger(req.investor.userId);
    return res.json({ summary: getInvestorWalletSummary(entries) });
  } catch (error) {
    console.error("Unable to load investor wallet:", error);
    return res.status(500).json({ message: "Unable to load wallet data." });
  }
});

app.get("/api/investor/earnings", requireInvestor, async (req, res) => {
  try {
    const entries = await InvestorLedgerEntry.find({
      userId: req.investor.userId,
      type: "Earning"
    }).sort({ createdAt: -1 }).lean();
    return res.json({
      summary: {
        received: sumAmounts(entries, (entry) => entry.status === "Completed"),
        pending: sumAmounts(entries, (entry) => entry.status === "Pending"),
        total: entries.length
      },
      entries: entries.map(({ userId, ...entry }) => entry)
    });
  } catch (error) {
    console.error("Unable to load investor earnings:", error);
    return res.status(500).json({ message: "Unable to load earnings data." });
  }
});

app.get("/api/investor/transactions", requireInvestor, async (req, res) => {
  try {
    const entries = await getInvestorLedger(req.investor.userId);
    return res.json({
      entries: entries.map(({ userId, ...entry }) => entry)
    });
  } catch (error) {
    console.error("Unable to load investor transactions:", error);
    return res.status(500).json({ message: "Unable to load transactions." });
  }
});

app.get("/api/investor/withdrawals", requireInvestor, async (req, res) => {
  try {
    const [withdrawals, entries] = await Promise.all([
      InvestorWithdrawal.find({ userId: req.investor.userId })
        .sort({ requestedAt: -1 })
        .lean(),
      getInvestorLedger(req.investor.userId)
    ]);
    return res.json({
      availableBalance: getInvestorWalletSummary(entries).availableBalance,
      withdrawals: withdrawals.map(({ userId, ...withdrawal }) => withdrawal)
    });
  } catch (error) {
    console.error("Unable to load investor withdrawals:", error);
    return res.status(500).json({ message: "Unable to load withdrawal data." });
  }
});

app.get("/api/investor/documents", requireInvestor, async (req, res) => {
  try {
    const [data, approval] = await Promise.all([
      readDashboard(),
      KycApproval.findOne({ userId: req.investor.userId }).select("facePhotos").lean()
    ]);
    const user = (data?.users || []).find((item) => Number(item.id) === req.investor.userId);
    if (!user) return res.status(404).json({ message: "Investor account not found." });

    const kycDetails = user.kycDetails || {};
    const documentFields = [
      ["uploadpancard", "PAN Card"],
      ["selfiephoto", "Selfie"],
      ["uploadaadhaar", "Aadhaar Front"],
      ["uploadaddressproof", "Aadhaar Back"]
    ];
    const documents = documentFields
      .map(([field, name]) => ({ name, url: kycDetails[field] }))
      .filter((document) => typeof document.url === "string" && document.url.trim())
      .map((document) => ({ ...document, url: document.url.trim() }));
    const facePhotos = approval?.facePhotos || kycDetails.facePhotos || {};
    for (const [angle, name] of [["front", "Face Verification - Front"], ["left", "Face Verification - Left"], ["right", "Face Verification - Right"]]) {
      const photo = facePhotos[angle];
      const url = typeof photo === "string" ? photo : photo?.url;
      if (typeof url === "string" && url.trim()) documents.push({ name, url: url.trim() });
    }

    return res.json({ documents });
  } catch (error) {
    console.error("Unable to load investor documents:", error);
    return res.status(500).json({ message: "Unable to load KYC documents." });
  }
});

app.get("/api/investor/notifications", requireInvestor, async (req, res) => {
  try {
    const notifications = await InvestorNotification.find({ userId: req.investor.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({
      unreadCount: notifications.filter((notification) => !notification.readAt).length,
      notifications: notifications.map(({ userId, ...notification }) => notification)
    });
  } catch (error) {
    console.error("Unable to load investor notifications:", error);
    return res.status(500).json({ message: "Unable to load notifications." });
  }
});

app.patch("/api/investor/notifications/read-all", requireInvestor, async (req, res) => {
  try {
    const result = await InvestorNotification.updateMany(
      { userId: req.investor.userId, readAt: null },
      { $set: { readAt: new Date() } }
    );
    return res.json({ updated: result.modifiedCount });
  } catch (error) {
    console.error("Unable to mark investor notifications as read:", error);
    return res.status(500).json({ message: "Unable to update notifications." });
  }
});

app.get("/api/investor/support", requireInvestor, async (req, res) => {
  try {
    const tickets = await InvestorSupportTicket.find({ userId: req.investor.userId })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ tickets: tickets.map(({ userId, ...ticket }) => ticket) });
  } catch (error) {
    console.error("Unable to load investor support tickets:", error);
    return res.status(500).json({ message: "Unable to load support requests." });
  }
});

app.post("/api/investor/support", requireInvestor, async (req, res) => {
  const { subject, category, message } = req.body || {};
  const allowedCategories = ["Account", "Documents", "Investments", "Payments", "Other"];
  if (typeof subject !== "string" || subject.trim().length < 3 || subject.trim().length > 120 ||
    typeof category !== "string" || !allowedCategories.includes(category) ||
    typeof message !== "string" || message.trim().length < 5 || message.trim().length > 2000) {
    return res.status(400).json({ message: "Enter a subject, category, and message to submit your request." });
  }

  try {
    const ticket = await InvestorSupportTicket.create({
      userId: req.investor.userId,
      subject: subject.trim(),
      category,
      message: message.trim()
    });
    const result = ticket.toObject();
    delete result.userId;
    return res.status(201).json({ ticket: result });
  } catch (error) {
    console.error("Unable to create investor support ticket:", error);
    return res.status(500).json({ message: "Unable to submit support request." });
  }
});

app.get("/api/staff/support", requireStaff("admin", "manager", "employee"), async (req, res) => {
  try {
    const [tickets, dashboard] = await Promise.all([
      InvestorSupportTicket.find().sort({ createdAt: -1 }).lean(),
      readDashboard()
    ]);
    const investorsById = new Map(
      (dashboard?.users || []).map((user) => [Number(user.id), user])
    );
    const requests = tickets.map(({ userId, ...ticket }) => {
      const investor = investorsById.get(Number(userId));
      return {
        id: String(ticket._id),
        subject: ticket.subject,
        category: ticket.category,
        message: ticket.message,
        status: ticket.status,
        submittedAt: ticket.createdAt,
        investor: {
          fullName: investor?.fullName || `Investor ${userId}`,
          email: investor?.email || "",
          investorId: investor?.investorId || ""
        }
      };
    });
    return res.json({ requests });
  } catch (error) {
    console.error("Unable to load investor support requests for staff:", error);
    return res.status(500).json({ message: "Unable to load investor support requests." });
  }
});

app.post("/api/users", async (req, res) => {
  const { basicInfo, addressInfo, credentials } = req.body || {};
  const requiredBasicFields = ["firstname", "lastname", "mobileNumber", "email"];
  const requiredAddressFields = ["address", "address1", "country", "state", "city", "pincode"];
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!basicInfo || !addressInfo ||
    requiredBasicFields.some((field) => typeof basicInfo[field] !== "string" || !basicInfo[field].trim()) ||
    requiredAddressFields.some((field) => typeof addressInfo[field] !== "string" || !addressInfo[field].trim()) ||
    typeof credentials?.password !== "string" || !passwordPattern.test(credentials.password) ||
    credentials.password !== credentials.confirmPassword) {
    return res.status(400).json({ message: "Complete the required information and enter matching passwords that meet the password requirements." });
  }

  try {
    const data = await readDashboard();
    data.users = Array.isArray(data.users) ? data.users : [];
    const email = basicInfo.email.trim().toLowerCase();
    if (data.users.some((user) => String(user.email || "").trim().toLowerCase() === email) || await UserCredential.exists({ email })) {
      return res.status(409).json({ message: "This email is already registered." });
    }

    const firstName = basicInfo.firstname.trim();
    const lastName = basicInfo.lastname.trim();
    const user = {
      id: Math.max(0, ...data.users.map((item) => Number(item.id) || 0)) + 1,
      investorId: createInvestorId(data.users),
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

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = crypto.scryptSync(credentials.password, salt, 64).toString("hex");
    let savedCredential;
    try {
      savedCredential = await UserCredential.create({
        userId: user.id,
        email,
        passwordHash: `scrypt$${salt}$${passwordHash}`
      });
      data.users.push(user);
      await saveDashboard(data);
    } catch (error) {
      if (savedCredential) await UserCredential.deleteOne({ _id: savedCredential._id });
      if (error.code === 11000) {
        return res.status(409).json({ message: "This email is already registered." });
      }
      throw error;
    }
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save user" });
  }
});

app.patch("/api/users/:id/status", requireStaff("admin", "manager"), async (req, res) => {
  const allowedStatuses = ["Pending for Approval", "Rejected", "Approved"];
  if (!allowedStatuses.includes(req.body.approvalStatus)) {
    return res.status(400).json({ message: "Invalid user approval status" });
  }

  try {
    const data = await readDashboard();
    const user = (data.users || []).find((item) => Number(item.id) === Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approvalStatus = req.body.approvalStatus;
    if (req.body.approvalStatus === "Approved") {
      user.basicDetailsApproval = {
        role: req.staff.userRole,
        name: req.staff.userRole === "admin" ? "Admin" : req.staff.fullName,
        employeeId: req.staff.userRole === "manager" ? req.staff.id : null,
        approvedAt: new Date().toISOString()
      };
    } else {
      user.basicDetailsApproval = null;
    }
    await saveDashboard(data);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update user status" });
  }
});

app.patch("/api/users/registration-details", async (req, res) => {
  const { email, nomineeInfo, bankInfo } = req.body || {};
  if (typeof email !== "string" || !email.trim() || (!nomineeInfo && !bankInfo)) {
    return res.status(400).json({ message: "Registration details are incomplete" });
  }
  if (nomineeInfo && ["UserName", "UserNumber", "Relationship"].some((field) =>
    typeof nomineeInfo[field] !== "string" || !nomineeInfo[field].trim()
  )) {
    return res.status(400).json({ message: "Complete all nominee details before saving" });
  }

  try {
    const data = await readDashboard();
    const user = (data.users || []).find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ message: "Registered user not found" });

    if (nomineeInfo) {
      user.nomineeDetails = {
        ...(user.nomineeDetails || {}),
        UserName: nomineeInfo.UserName.trim(),
        UserNumber: nomineeInfo.UserNumber.trim(),
        Relationship: nomineeInfo.Relationship.trim()
      };
    }
    if (bankInfo) {
      user.bankDetails = {
        ...(user.bankDetails || {}),
        accountholdername: bankInfo.accountholdername || "",
        bankname: bankInfo.bankname || "",
        accountnumber: bankInfo.accountnumber || "",
        ifsccode: bankInfo.ifsccode || "",
        upiid: bankInfo.upiid || "",
        cancelledcheque: bankInfo.cancelledcheque || ""
      };
    }

    await saveDashboard(data);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save registration details" });
  }
});

app.patch("/api/users/kyc", async (req, res) => {
  const { email, kycDetails } = req.body || {};
  const facePhotoKeys = ["front", "left", "right"];
  const validFacePhotos = facePhotoKeys.every((key) => {
    const photo = kycDetails?.facePhotos?.[key];
    return photo && typeof photo.url === "string" &&
      /^\/api\/kyc\/face-photo\/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$/i.test(photo.url) &&
      typeof photo.capturedAt === "string";
  });
  const requiredKycFields = [
    "pancardnumber",
    "aadhaarnumber",
    "uploadpancard",
    "uploadaadhaar",
    "uploadaddressproof",
    "selfiephoto"
  ];
  if (typeof email !== "string" || !email.trim() || !kycDetails ||
    requiredKycFields.some((field) => typeof kycDetails[field] !== "string" || !kycDetails[field].trim()) ||
    !validFacePhotos) {
    return res.status(400).json({ message: "Complete all KYC details and document uploads" });
  }

  try {
    const data = await readDashboard();
    const user = (data.users || []).find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ message: "Registered user not found" });

    user.kycDetails = Object.fromEntries(requiredKycFields.map((field) => [field, kycDetails[field].trim()]));
    user.kycStatus = "Pending for Approval";
    user.kycApproval = null;
    await KycApproval.findOneAndUpdate(
      { userId: user.id },
      {
        email: user.email,
        facePhotos: Object.fromEntries(facePhotoKeys.map((key) => [key, {
          url: kycDetails.facePhotos[key].url,
          capturedAt: kycDetails.facePhotos[key].capturedAt
        }])),
        status: user.kycStatus,
        approvalDetails: null
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    await saveDashboard(data);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save KYC details" });
  }
});

app.patch("/api/users/:id/kyc-status", requireStaff("admin", "manager"), async (req, res) => {
  const legacyStatusMap = { Accept: "Approved", Reject: "Rejected" };
  const kycStatus = legacyStatusMap[req.body.kycStatus] || req.body.kycStatus;
  const allowedStatuses = ["Pending for Approval", "Approved", "Rejected"];
  if (!allowedStatuses.includes(kycStatus)) {
    return res.status(400).json({ message: "Invalid KYC approval status" });
  }

  try {
    const data = await readDashboard();
    const user = (data.users || []).find((item) => Number(item.id) === Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    const requiredKycDocuments = ["uploadpancard", "uploadaadhaar", "uploadaddressproof", "selfiephoto"];
    if (!user.kycDetails || requiredKycDocuments.some((field) => !user.kycDetails[field])) {
      return res.status(400).json({ message: "User has not submitted all KYC documents" });
    }
    if (kycStatus === "Approved" && ["UserName", "UserNumber", "Relationship"].some((field) =>
      typeof user.nomineeDetails?.[field] !== "string" || !user.nomineeDetails[field].trim()
    )) {
      return res.status(400).json({ message: "User has not submitted all nominee details" });
    }

    user.kycStatus = kycStatus;
    if (kycStatus === "Approved") {
      user.kycApproval = {
        role: req.staff.userRole,
        name: req.staff.userRole === "admin" ? "Admin" : req.staff.fullName,
        employeeId: req.staff.userRole === "manager" ? req.staff.id : null,
        approvedAt: new Date().toISOString()
      };
    } else {
      user.kycApproval = null;
    }
    await saveDashboard(data);
    await KycApproval.updateOne({ userId: user.id }, {
      $set: { status: kycStatus, approvalDetails: user.kycApproval }
    });
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to update KYC status" });
  }
});

app.patch("/api/projects/:id", async (req, res) => {
  try {
    const data = await readDashboard();
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
    await saveDashboard(data);

    res.json({ project: nextProject, stats: { totalUnits: data.stats.totalUnits } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update project" });
  }
});

app.post("/api/projects", requireStaff("admin", "manager"), parseProjectUpload, async (req, res) => {
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
    const data = await readDashboard();
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
    await saveDashboard(data);

    try {
      const title = "New project added";
      const message = `${project.name} has been added.`;
      const activeEmployees = await Employee.find({ status: "Active" }).select("id userRole").lean();
      const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
      const staffRecipients = [
        ...(adminEmail ? [{ recipientRole: "admin", recipientId: adminEmail }] : []),
        ...activeEmployees
          .filter((employee) => ["manager", "employee"].includes(employee.userRole))
          .map((employee) => ({ recipientRole: employee.userRole, recipientId: String(employee.id) }))
      ];
      const staffNotifications = staffRecipients.map((recipient) => ({ ...recipient, title, message }));
      const investorNotifications = (data.users || []).map((user) => ({
        userId: Number(user.id),
        title,
        message
      }));
      await Promise.all([
        staffNotifications.length ? StaffNotification.insertMany(staffNotifications) : Promise.resolve(),
        investorNotifications.length ? InvestorNotification.insertMany(investorNotifications) : Promise.resolve()
      ]);
    } catch (notificationError) {
      console.error("Project was added, but notifications could not be sent:", notificationError);
    }

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
    status: mongoose.connection.readyState === 1 ? "success" : "error",
    message: mongoose.connection.readyState === 1
      ? "Bhoomani Admin API is running"
      : "MongoDB is not connected",
    database: mongoose.connection.readyState === 1 ? mongoose.connection.name : "disconnected"
  });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
      console.log(`Connected to MongoDB database "${mongoose.connection.name}"`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to MongoDB or initialize dashboard data.", error);
    process.exit(1);
  });
