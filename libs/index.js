// libs/index.js
import fs from "fs";
import { parse } from "csv-parse";

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    // Arreglo para almacenar los encabezados
    let headers = [];
    // Arreglo para almacenar los datos
    let data = [];

    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ",", from_line: 1 }))
      .on("data", (row) => {
        // Si headers está vacío, asumimos que estamos en la primera línea
        if (headers.length === 0) {
          headers = row;
        } else {
          // Procesar datos aquí, usando los encabezados
          const dataCsv = {};
          for (let i = 0; i < headers.length; i++) {
            dataCsv[headers[i]] = row[i];
          }
          // Agregar la fila al arreglo de datos
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

export { processCSV };
