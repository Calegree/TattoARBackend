const express = require("express");
const router = express.Router();
const designsController = require("../controllers/designs.controller");
const authenticate  = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");
const validateOwner = require("../middlewares/owner.middleware");

// Public
router.get("/", designsController.getDesigns);
router.get("/:designId", designsController.getDesignById);

// Protected
router.post(
    "/",
    authenticate,
    authorizeRole("tattooer"),
    designsController.createDesign
);

router.post(
    "/portfolio",
    authenticate,
    authorizeRole("tattooer"),
    designsController.addToPortfolio
);

// Private (owner only)
router.put(
    "/:designId",
    authenticate,
    validateOwner("Design"),
    designsController.updateDesign
);

router.delete(
    "/:designId",
    authenticate,
    validateOwner("Design"),
    designsController.deleteDesign
);

module.exports = router;
