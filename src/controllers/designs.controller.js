const Design = require("../models/Design");
const User = require("../models/User");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const r2 = require("../config/r2.config"); // Configuración de R2 para subir

// Listar diseños con filtros opcionales: city, style, search (title/description)
exports.getDesigns = async (req, res) => {
  try {
    const { city, style, search } = req.query;
    const filter = {
      booleanAR: true, // Solo obtener los diseños que son diseños (no portafolios)
    };

    if (city) filter.city = city;
    if (style) filter.styles = style;
    if (search)
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];

    const designs = await Design.find(filter)
      .populate("author", "fullName username profileImageUrl _id")
      .exec();

    res.status(200).json(designs);
  } catch (error) {
    console.error("Error retrieving designs:", error);
    if (error.code === 50) {
      res.status(503).json({
        code: 503,
        message: "Query timeout (Mongo muy lento o sin índice)",
      });
    } else {
      res.status(500).json({ code: 500, message: "Error retrieving designs" });
    }
  }
};

// Obtener diseños por IDs filtrando que author sea el dueño del perfil
exports.getDesignsByAuthorAndIds = async (req, res) => {
  try {
    const { authorId } = req.params;
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ code: 400, message: "Falta parámetro ids" });
    }

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({ code: 400, message: "authorId inválido" });
    }

    const designIds = ids
      .split(',')
      .filter(id => mongoose.Types.ObjectId.isValid(id)) // ✅ solo IDs válidos
      .map(id => mongoose.Types.ObjectId.createFromHexString(id));

    const designs = await Design.find({
      _id: { $in: designIds },
      author: authorId
    }).populate("author", "username profileImageUrl _id fullName");

    res.status(200).json(designs);
  } catch (error) {
    console.error("Error retrieving designs by author and ids:", error);
    res.status(500).json({ code: 500, message: "Error retrieving designs" });
  }
};


// Crear nuevo diseño (solo tatuador)
exports.createDesign = async (req, res) => {
  try {
    // 1) Sube la imagen si viene en req.file
    let imageURL = req.body.designURL; // fallback
    if (req.file) {
      const key = `designs/${req.user.id}/${req.file.originalname}`;
      await r2
        .putObject({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
        .promise();
      imageURL = `${process.env.R2_DEV_ENDPOINT}/${key}`;
    }

    // 2) Crea el documento en MongoDB
    const newDesign = new Design({
      name: req.body.name,
      description: req.body.description,
      styles: req.body.styles,
      author: req.user.id,
      designURL: imageURL,
      booleanAR: true,
    });
    await newDesign.save();

    // 3) Asocia al usuario
    await User.findByIdAndUpdate(req.user.id, {
      $push: { designs: newDesign._id },
    });
    await newDesign.populate("author", "username profileImageUrl _id");
    res.status(201).json(newDesign);
  } catch (error) {
    console.error("Error al crear diseño:", error);
    res.status(400).json({ code: 400, message: error.message });
  }
};

exports.addToPortfolio = async (req, res) => {
  try {
    let imageURL = null;
    if (req.file) {
      const key = `portfolio/${req.user.id}/${req.file.originalname}`;
      await r2
        .putObject({
          Bucket: process.env.R2_BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
        .promise();
      imageURL = `${process.env.R2_DEV_ENDPOINT}/${key}`;
    }

    const newDesign = new Design({
      name: req.body.name,
      description: req.body.description,
      styles: req.body.styles,
      author: req.user.id,
      designURL: imageURL,
      booleanAR: false,
    });
    await newDesign.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { portfolio: newDesign._id },
    });

    res.status(201).json(newDesign);
  } catch (error) {
    console.error("Error al agregar diseño al portafolio:", error);
    res.status(400).json({ code: 400, message: error.message });
  }
};

// Obtener detalle de un diseño
exports.getDesignById = async (req, res) => {
  try {
    const design = await Design.findById(req.params.designId).populate(
      "author",
      "fullName email username profileImageUrl _id"
    );
    if (!design)
      return res
        .status(404)
        .json({ code: 404, message: "Diseño no encontrado" });
    res.status(200).json(design);
  } catch (error) {
    console.error("Error retrieving design:", error);
    res.status(500).json({ code: 500, message: "Error retrieving design" });
  }
};

// Actualizar diseño (solo propietario)
exports.updateDesign = async (req, res) => {
  try {
    const { designId } = req.params;
    console.log("Updating design with ID:", designId);
    const data = {
      ...req.body,
      updatedAt: Date.now(),
    };
    const updated = await Design.findOneAndUpdate(
      { _id: designId, author: req.user.id },
      data,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({
        code: 404,
        message: "Elemento no encontrado en la base de datos.",
      });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating design:", error);
    res.status(500).json({ code: 500, message: "Error updating design" });
  }
};

// Eliminar diseño (solo propietario)
exports.deleteDesign = async (req, res) => {
  try {
    const { designId } = req.params;
    const deleted = await Design.findOneAndDelete({
      _id: designId,
      author: req.user.id,
    });
    if (!deleted)
      return res.status(404).json({
        code: 404,
        message: "Elemento no encontrado en la base de datos.",
      });
    res
      .status(204)
      .json({ code: 204, message: "Solicitud procesada correctamente." });
  } catch (error) {
    console.error("Error deleting design:", error);
    res.status(500).json({ code: 500, message: "Error deleting design" });
  }
};
exports.getARDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ booleanAR: true });
    res.status(200).json(designs);
  } catch (error) {
    console.error("Error retrieving AR designs:", error);
    res.status(500).json({ code: 500, message: "Error retrieving AR designs" });
  }
};
