const express = require("express");

const auth = require("../middlewares/Auth");

const router = express.Router();

const AdminController = require("../controller/AdminController");
const VoterController = require("../controller/VoterController");

router.post("/api/admin/addVoter", auth, AdminController.addVoter);
router.put("/api/admin/updateVoter", auth, AdminController.updateVoter);
router.delete("/api/admin/deleteVoter", auth, AdminController.deleteVoter);

router.post("/api/admin/addCandidate", auth, AdminController.addCandidate);
router.put("/api/admin/updateCandidate", auth, AdminController.updateCandidate);
router.delete(
  "/api/admin/deleteCandidate",
  auth,
  AdminController.deleteCandidate
);

router.post("/api/login", VoterController.login);
router.get("/api/voter/details", auth, VoterController.voterDetails);

//Caste Vote
router.post("/api/vote", auth, VoterController.vote);

// router.get("/api/admin/dashboard", auth, AdminController.dashboard);

// ! Add admin API
router.post("/api/admin/add", AdminController.add);

// ADMIN LOGIN
router.post("/api/admin/login", AdminController.login);

module.exports = router;
