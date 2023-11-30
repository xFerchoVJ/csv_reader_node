// controllers/index.js
import {
  calculateRatingsDistribution,
  processCSV,
  reviewStats,
} from "../libs/index.js";
import fs from "fs/promises";
import path from "path";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { kmeans } from "ml-kmeans";
import { Apriori } from "node-apriori";
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

const getRatingsDistribution = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ msg: "Se tiene que mandar los datos del dataset" });
    }

    const ratingsDistribution = calculateRatingsDistribution(data);

    // Aquí se pueden construir los datos de distribución de calificaciones
    // Supongamos que tienes la data en un formato similar a ratingsData
    const ratingsData = {
      service: {
        labels: ["Excelente", "Muy Bueno", "Neutral", "Pobre", "Terrible"],
        datasets: [
          {
            label: "Calificaciones de Servicio",
            data: ratingsDistribution.service, // Aquí se usa la distribución calculada
          },
        ],
      },
      atmosphere: {
        labels: ["Excelente", "Muy Bueno", "Neutral", "Pobre", "Terrible"],
        datasets: [
          {
            label: "Calificaciones de Atmosfera",
            data: ratingsDistribution.atmosphere, // Aquí se usa la distribución calculada
          },
        ],
      },
      food: {
        labels: ["Excelente", "Muy Bueno", "Neutral", "Pobre", "Terrible"],
        datasets: [
          {
            label: "Calificaciones de Comida",
            data: ratingsDistribution.food, // Aquí se usa la distribución calculada
          },
        ],
      },
    };

    res.status(200).json(ratingsData);
  } catch (error) {
    console.error("Error obteniendo la distribución de calificaciones:", error);
    res
      .status(500)
      .json({ error: "Error obteniendo la distribución de calificaciones" });
  }
};

const getReviewStats = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res
        .status(400)
        .json({ msg: "Se tiene que mandar los datos del dataset" });
    }
    const { totalReviews, reviewsOverTime } = reviewStats(data);
    res.status(200).json({ totalReviews, reviewsOverTime });
  } catch (error) {
    console.error("Error al obtener los stats de las Reviews:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los stats de las Reviews" });
  }
};

const clusterAnalysis = async (req, res) => {
  try {
    console.log("entre");
    const { data } = req.body;
    const features = data.map((review) => [
      Number(review.review_rating_service),
      Number(review.review_rating_atmosphere),
      Number(review.review_rating_food),
    ]);

    const k = 3; //Numero de clusters
    const clusters = kmeans(features, k);
    const ans = clusters.computeInformation(data);
    res.status(200).json(ans);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error al obtener el Cluster Analysis" });
  }
};

const getAssociationAnalysis = async (req, res) => {
  try {
    const { reviewsData } = req.body;

    const transactions = reviewsData.map((review) => [
      review.review_rating_service,
      review.review_rating_atmosphere,
      review.review_rating_food,
    ]);

    // Configurar y ejecutar el análisis de asociación
    const apriori = new Apriori(0.01, 0.6);
    const result = await apriori.exec(transactions);
    const associationData = result.itemsets.map((itemset) => ({
      items: itemset.items.join(", "), // Convertir los ítems en una cadena para mostrar
      support: itemset.support, // Obtener el soporte del conjunto de ítems
    }));

    // Devolver los datos al frontend
    res.json({ associationData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export {
  importCsv,
  getRatingsDistribution,
  getReviewStats,
  clusterAnalysis,
  getAssociationAnalysis,
};
