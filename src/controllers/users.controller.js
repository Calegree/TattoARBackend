const getProfile = async (req, res) => {
  try {
    // Assuming user ID is available in req.user.id (e.g., after authentication middleware)
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Replace with your user model and fetching logic
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const listTattooers = async (req, res) => {
  try {
    const { city, style, search } = req.query;
    const filter = { role: "tattooer" };

    if (city) filter.city = city;
    if (search) filter.fullName = { $regex: search, $options: "i" };
    if (style) filter["styles"] = { $regex: style, $options: "i" }; // si tienes un campo styles

    const tattooers = await User.find(filter).select("-password -__v");
    res.status(200).json(tattooers);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar tatuadores" });
  }
};

module.exports = {
  getProfile,
  listTattooers,
};
