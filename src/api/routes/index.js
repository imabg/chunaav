const express = require("express");
const multer = require("multer")
const auth = require("../middlewares/Auth");

const router = express.Router();
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const AdminController = require("../controller/AdminController");
const VoterController = require("../controller/VoterController");

router.get("/api/admin/voter/details", auth, AdminController.fetchVoter)
router.post("/api/admin/addVoter", auth, AdminController.addVoter);
router.put("/api/admin/updateVoter", auth, AdminController.updateVoter);
router.delete("/api/admin/deleteVoter", auth, AdminController.deleteVoter);

router.get("/api/admin/candidate/details", auth, AdminController.candidateDetails)
router.post("/api/admin/addCandidate", auth, AdminController.addCandidate);
router.put("/api/admin/updateCandidate", auth, AdminController.updateCandidate);
router.delete(
  "/api/admin/deleteCandidate",
  auth,
  AdminController.deleteCandidate
);

router.post("/api/login", VoterController.login);
router.get("/api/voter/details", auth, VoterController.voterDetails);

//Cast Vote
router.post("/api/vote", auth, VoterController.vote);

// router.get("/api/admin/dashboard", auth, AdminController.dashboard);

// ! ADMIN API's
router.post("/api/admin/add", AdminController.add);
router.post("/api/admin/login", AdminController.login);
router.get("/api/admin/details", auth, AdminController.fetchAdmin);

// ? SCREEN
router.get('/api/screen', auth, VoterController.generateVotinScreen)

// ! on-HOLD
// Upload routes
router.post("/api/admin/upload/voter", auth, upload.single("file"), AdminController.uploadVoterImage)
router.post("/api/admin/upload/candidate/logo", auth, AdminController.uploadCandidateLogo)

module.exports = router;
