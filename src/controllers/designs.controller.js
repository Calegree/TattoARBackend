const Design = require('../models/Design');
const User = require('../models/User');
const mongoose = require('mongoose');

// Listar diseños con filtros opcionales: city, style, search (title/description)
exports.getDesigns = async (req, res) => {
    try {
        const { city, style, search } = req.query;
        const filter = {};

        if (city) filter.city = city;
        if (style) filter.styles = style;
        if (search) filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];

        const designs = await Design.find(filter);
        res.status(200).json(designs);
    } catch (error) {
        console.error('Error retrieving designs:', error);
        res.status(500).json({ code: 500, message: 'Error retrieving designs' });
    }
};

// Crear nuevo diseño (solo tatuador)
exports.createDesign = async (req, res) => {
    try {
        const { name, description, styles, designURL } = req.body;
        const newDesign = new Design({
            name,
            description,
            styles,
            author: req.user.id,
            designURL,
            booleanAR: req.body.booleanAR || false, // Asignar valor por defecto si no se proporciona
        });
        await newDesign.save();
        // Agregar el diseño al usuario
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { designs: newDesign._id } },
            { new: true }
        );
        res.status(201).json(newDesign);
    } catch (error) {
        console.error("Error al crear diseño:", error); // muestra todo el objeto
        res.status(400).json({ code: 400, message: error.message, error });
    }
};

exports.addToPortfolio = async (req, res) => {
  try {
    const { name, description, styles, designURL } = req.body;

    const newDesign = new Design({
      name,
      description,
      styles,
      author: req.user.id,
      designURL,
      booleanAR: false, // Diseño de portafolio
    });

    await newDesign.save();

    // Agregar el diseño al portafolio del tatuador
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { portfolio: newDesign._id } },
      { new: true }
    );

    res.status(201).json(newDesign);
  } catch (error) {
    console.error("Error al agregar diseño al portafolio:", error);
    res.status(400).json({ code: 400, message: error.message, error });
  }
};

// Obtener detalle de un diseño
exports.getDesignById = async (req, res) => {
    try {
        const design = await Design.findById(req.params.designId).populate('author', 'fullName email');
        if (!design) return res.status(404).json({ code: 404, message: 'Diseño no encontrado' });
        res.status(200).json(design);
    } catch (error) {
        console.error('Error retrieving design:', error);
        res.status(500).json({ code: 500, message: 'Error retrieving design' });
    }
};

// Actualizar diseño (solo propietario)
exports.updateDesign = async (req, res) => {
    try {
        const { designId } = req.params;
        console.log('Updating design with ID:', designId);
        const data = {
            ...req.body,
            updatedAt: Date.now()
        };
        const updated = await Design.findOneAndUpdate(
            { _id: designId, author: req.user.id },
            data,
            { new: true }
        );
        if (!updated) return res.status(404).json({ code: 404, message: 'Elemento no encontrado en la base de datos.' });
        res.status(200).json(updated);
    } catch (error) {
        console.error('Error updating design:', error);
        res.status(500).json({ code: 500, message: 'Error updating design' });
    }
};

// Eliminar diseño (solo propietario)
exports.deleteDesign = async (req, res) => {
    try {
        const { designId } = req.params;
        const deleted = await Design.findOneAndDelete({ _id: designId, author: req.user.id });
        if (!deleted) return res.status(404).json({ code: 404, message: 'Elemento no encontrado en la base de datos.' });
        res.status(204).json({ code: 204, message: 'Solicitud procesada correctamente.' });
    } catch (error) {
        console.error('Error deleting design:', error);
        res.status(500).json({ code: 500, message: 'Error deleting design' });
    }
};
exports.getARDesigns = async (req, res) => {
    try {
        const designs = await Design.find({ booleanAR: true });
        res.status(200).json(designs);
    } catch (error) {
        console.error('Error retrieving AR designs:', error);
        res.status(500).json({ code: 500, message: 'Error retrieving AR designs' });
    }
};

