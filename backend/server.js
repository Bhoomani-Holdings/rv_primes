const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();

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
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  phone: { type: String, required: true, trim: true },
  userRole: { type: String, required: true, enum: ["manager", "employee"] },
  department: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  joiningDate: { type: String, required: true },
  bankName: { type: String, required: true, trim: true },
  accountHolderName: { type: String, required: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  ifscCode: { type: String, required: true, trim: true, uppercase: true },
  bankBranch: { type: String, required: true, trim: true },
  status: { type: String, default: "Active" }
}, { collection: "employees", timestamps: true, versionKey: false });
const Employee = mongoose.model("Employee", employeeSchema);
const userCredentialSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { collection: "usercredentials", timestamps: true, versionKey: false });
const UserCredential = mongoose.model("UserCredential", userCredentialSchema);

const cleanDashboard = (dashboard) => {
  if (!dashboard) return null;
  const result = dashboard.toObject ? dashboard.toObject() : dashboard;
  delete result._id;
  return result;
};

const readDashboard = async () => cleanDashboard(await Dashboard.findById("primary"));
const saveDashboard = async (dashboard) => {
  const saved = await Dashboard.findOneAndReplace(
    { _id: "primary" },
    { ...dashboard, _id: "primary" },
    { upsert: true, new: true }
  );
  return cleanDashboard(saved);
};

const initializeDatabase = async () => {
  await mongoose.connect(MONGODB_URI);
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
const maxImageSize = 5 * 1024 * 1024;
const maxVideoSize = 50 * 1024 * 1024;
const maxResumeSize = 5 * 1024 * 1024;

fs.mkdirSync(uploadDirectory, { recursive: true });
fs.mkdirSync(resumeUploadDirectory, { recursive: true });
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
    res.json(await readDashboard());
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
      const hasPassword = Boolean(employee.passwordHash);
      delete employee.passwordHash;
      return { ...employee, hasPassword };
    }));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to load employees" });
  }
});

app.post("/api/employees", async (req, res) => {
  const { fullName, email, password, phone, userRole, department, designation, joiningDate, bankName, accountHolderName, accountNumber, ifscCode, bankBranch } = req.body || {};
  const fields = [fullName, email, password, phone, userRole, department, designation, joiningDate, bankName, accountHolderName, accountNumber, ifscCode, bankBranch];
  if (fields.some((value) => typeof value !== "string" || !value.trim()) ||
    !["manager", "employee"].includes(userRole) ||
    password.length < 8 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !/^[0-9+() .-]{7,24}$/.test(phone.trim())) {
    return res.status(400).json({ message: "Enter valid employee, contact, joining date, and salary bank details." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const highestId = await Employee.findOne().sort({ id: -1 }).select({ id: 1 }).lean();
    const employee = {
      id: (highestId?.id || 0) + 1,
      fullName: fullName.trim(),
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
      joiningDate,
      bankName: bankName.trim(),
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      bankBranch: bankBranch.trim(),
      status: "Active"
    };
    const savedEmployee = await Employee.create(employee);
    const result = savedEmployee.toObject();
    delete result.passwordHash;
    return res.status(201).json({ ...result, hasPassword: true });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An employee with this email already exists." });
    console.error(error);
    return res.status(500).json({ message: "Unable to add employee" });
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

app.get("/api/users", async (req, res) => {
  try {
    const data = await readDashboard();
    const newestFirst = [...(data.users || [])]
      .sort((a, b) => Number(b.id) - Number(a.id));
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

    return res.json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        kycStatus: user.kycStatus || "Not Submitted"
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to sign in right now. Please try again." });
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

app.patch("/api/users/:id/status", async (req, res) => {
  const allowedStatuses = ["Pending for Approval", "Rejected", "Approved"];
  if (!allowedStatuses.includes(req.body.approvalStatus)) {
    return res.status(400).json({ message: "Invalid user approval status" });
  }

  try {
    const data = await readDashboard();
    const user = (data.users || []).find((item) => Number(item.id) === Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approvalStatus = req.body.approvalStatus;
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

  try {
    const data = await readDashboard();
    const user = (data.users || []).find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ message: "Registered user not found" });

    if (nomineeInfo) {
      user.nomineeDetails = {
        ...(user.nomineeDetails || {}),
        UserName: nomineeInfo.UserName || "",
        UserNumber: nomineeInfo.UserNumber || "",
        Relationship: nomineeInfo.Relationship || ""
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
    const data = await readDashboard();
    const user = (data.users || []).find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return res.status(404).json({ message: "Registered user not found" });

    user.kycDetails = Object.fromEntries(requiredKycFields.map((field) => [field, kycDetails[field].trim()]));
    user.kycStatus = "Pending for Approval";
    await saveDashboard(data);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to save KYC details" });
  }
});

app.patch("/api/users/:id/kyc-status", async (req, res) => {
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

    user.kycStatus = kycStatus;
    await saveDashboard(data);
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

app.post("/api/projects", parseProjectUpload, async (req, res) => {
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
