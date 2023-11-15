// controllers/index.js
import { processCSV } from "../libs/index.js";
import fs from "fs/promises";
import path from "path";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const importCsv = async (req, res) => {
  
  if (!req.file) {
    return res.status(400).json({ msg: "No se ha enviado ningún archivo" });
  }
  try {
    const fileBuffer = req.file.buffer; // Obtener el búfer de memoria del archivo

    // Crear un archivo temporal con un nombre único
    const tempFilePath = path.join(__dirname, `temp-${Date.now()}.csv`);

    // Escribir el contenido del búfer en el archivo temporal
    await fs.writeFile(tempFilePath, fileBuffer);

    // Pasar la ruta del archivo temporal a la función processCSV
    const data = await processCSV(tempFilePath);

    // Eliminar el archivo temporal después de procesarlo
    await fs.unlink(tempFilePath);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export { importCsv };
