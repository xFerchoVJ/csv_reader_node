import fs from "fs";
import { parse } from "csv-parse";
import moment from "moment";

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    let headers = [];
    let data = [];

    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on("data", (row) => {
        if (headers.length === 0) {
          headers = row;
        } else {
          const dataCsv = {};
          for (let i = 0; i < headers.length; i++) {
            // Verifica si la celda está vacía y reemplaza con cero si es así
            dataCsv[headers[i]] = row[i] === "" ? "0" : row[i];
          }
          data.push(dataCsv);
        }
      })
      .on("error", (error) => {
        reject(error.message);
      })
      .on("end", function () {
        console.log("finished");
        resolve(data);
      });
  });
};

const calculateRatingsDistribution = (data = []) => {
  const ratingsDistribution = {
    service: {
      Excelente: 0,
      "Muy Bueno": 0,
      Neutral: 0,
      Pobre: 0,
      Terrible: 0,
    },
    atmosphere: {
      Excelente: 0,
      "Muy Bueno": 0,
      Neutral: 0,
      Pobre: 0,
      Terrible: 0,
    },
    food: { Excelente: 0, "Muy Bueno": 0, Neutral: 0, Pobre: 0, Terrible: 0 },
  };

  data.forEach((review) => {
    const serviceRating = parseFloat(review.review_rating_service);
    const atmosphereRating = parseFloat(review.review_rating_atmosphere);
    const foodRating = parseFloat(review.review_rating_food);

    if (!isNaN(serviceRating)) {
      if (serviceRating >= 50) {
        ratingsDistribution.service["Excelente"]++;
      } else if (serviceRating >= 40) {
        ratingsDistribution.service["Muy Bueno"]++;
      } else if (serviceRating >= 30) {
        ratingsDistribution.service["Neutral"]++;
      } else if (serviceRating >= 10) {
        ratingsDistribution.service["Pobre"]++;
      } else {
        ratingsDistribution.service["Terrible"]++;
      }
    }

    if (!isNaN(atmosphereRating)) {
      if (atmosphereRating >= 50) {
        ratingsDistribution.atmosphere["Excelente"]++;
      } else if (atmosphereRating >= 70) {
        ratingsDistribution.atmosphere["Muy Bueno"]++;
      } else if (atmosphereRating >= 50) {
        ratingsDistribution.atmosphere["Neutral"]++;
      } else if (atmosphereRating >= 30) {
        ratingsDistribution.atmosphere["Pobre"]++;
      } else {
        ratingsDistribution.atmosphere["Terrible"]++;
      }
    }

    if (!isNaN(foodRating)) {
      if (foodRating >= 50) {
        ratingsDistribution.food["Excelente"]++;
      } else if (foodRating >= 40) {
        ratingsDistribution.food["Muy Bueno"]++;
      } else if (foodRating >= 30) {
        ratingsDistribution.food["Neutral"]++;
      } else if (foodRating >= 10) {
        ratingsDistribution.food["Pobre"]++;
      } else {
        ratingsDistribution.food["Terrible"]++;
      }
    }
  });

  return ratingsDistribution;
};

const reviewStats = (data = []) => {
  // Número total de revisiones
  const totalReviews = data.length;

  // Tendencia de revisiones a lo largo del tiempo
  const reviewsOverTime = {};

  data.forEach((review) => {
    const reviewDate = moment(review.review_date).format("YYYY-MM-DD"); // Formatear la fecha

    // Si aún no existe la fecha en el objeto reviewsOverTime, inicialízala con valor 1, de lo contrario, incrementa el contador
    if (!reviewsOverTime[reviewDate]) {
      reviewsOverTime[reviewDate] = 1;
    } else {
      reviewsOverTime[reviewDate]++;
    }
  });

  return { totalReviews, reviewsOverTime };
};

export { processCSV, calculateRatingsDistribution, reviewStats };
