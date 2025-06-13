const express = require("express");
const router = express.Router();
const designsController = require("../controllers/designs.controller");
const adminDesignsController = require("../controllers/admin.designs.controller");
const authenticate  = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");

// Solo admin puede ver todos los diseños
router.get("/", authenticate, authorizeRole("admin"), designsController.getDesigns);
router.put('/bantattoo/:id', authenticate, authorizeRole("admin"), adminDesignsController.banDesign);

module.exports = router;