const express = require("express");
const router = express.Router();
const {
  getUsersByRole,
  getDesignsByStyle,
  getTopLikedDesigns,
  getTattooerStyles,
  getTotalTattoos,
} = require("../controllers/metrics.controller");

router.get("/users-by-role", getUsersByRole);
router.get("/designs-by-style", getDesignsByStyle);
router.get("/top-liked-designs", getTopLikedDesigns);
router.get("/tattooer-styles", getTattooerStyles);
router.get("/total-tattoos", getTotalTattoos);

module.exports = router;
