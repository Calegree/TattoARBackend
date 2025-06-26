const mongoose = require("mongoose");
const Log = require("../models/Log"); // ajusta según la ubicación real de tu modelo

mongoose.connect("mongodb://localhost:27017/TU_BASE_DE_DATOS", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

(async () => {
  try {
    const logs = await Log.find({});

    let count = 0;
    for (const log of logs) {
      if (typeof log.user === "string") {
        log.user = mongoose.Types.ObjectId(log.user);
        await log.save();
        count++;
      }
    }

    console.log(`✔ Migración completada: ${count} logs actualizados.`);
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
  } finally {
    mongoose.disconnect();
  }
})();