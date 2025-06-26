const express = require("express");
const router = express.Router();
const designsController = require("../controllers/designs.controller");
const authenticate  = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");
const validateOwner = require("../middlewares/owner.middleware");

const multer = require("multer");
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only PNG and JPEG images are allowed"));
        }
        cb(null, true);
    },
});
// Public
router.get("/", designsController.getDesigns);
router.get("/:designId", designsController.getDesignById);
router.get("/author/:authorId/filter", designsController.getDesignsByAuthorAndIds); 


// Protected
router.post(
    "/",
    authenticate,
    authorizeRole("tattooer"),
    upload.single("image"),
    designsController.createDesign
);

router.post(
    "/portfolio",
    authenticate,
    authorizeRole("tattooer"),
    upload.single("image"),
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
