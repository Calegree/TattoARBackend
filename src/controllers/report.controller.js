exports.sendReport = async (req, res) => {
  try {
    const { reports_id, type, reason, description, image } = req.body;

    if (!reports_id || !type || !reason || !description) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    // Crear el nuevo reporte
    const newReport = new Report({
      user_id: req.user.id,
      reports_id,
      type,
      reason,
      description,
      image
    });

    await newReport.save();

    // Si es un reporte a un tatuador o diseño, incrementar su contador
    if (type === 'tattooer' || type === 'design') {
      await User.findByIdAndUpdate(
        reports_id,
        { $inc: { reportCounter: 1 } },
        { new: true }
      );
    }

    // Crear notificación para el administrador
    const Notification = require('../models/Notification');
    const adminUsers = await User.find({ role: 'admin' });
    const notificationPromises = adminUsers.map(admin =>
      Notification.create({
        user: admin._id,
        title: 'Nuevo reporte recibido',
        message: `Se ha recibido un nuevo reporte de tipo "${type}".`,
        link: `/admin/reports/${newReport._id}`,
        isRead: false,
        createdAt: new Date()
      })

    );
    console.log('Notificaciones creadas para administradores:', notificationPromises.length);
    await Promise.all(notificationPromises);

    res.status(201).json({ mensaje: 'Reporte enviado correctamente', reporte: newReport });
  } catch (error) {
    console.error('Error al enviar el reporte:', error);
    res.status(500).json({ mensaje: 'Error al enviar el reporte' });
  }
};