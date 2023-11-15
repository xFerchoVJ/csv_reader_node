import fs from "fs";
import { parse } from "csv-parse";

const processCSV = (file = "") => {
  // Arreglo para almacenar los encabezados
  let headers = [];
  // Arreglo para almacenar los datos
  let data = [];

  if (!file) {
    throw new Error("No se ha especificado un archivo");
  }
  fs.createReadStream(file)
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
      console.log(error.message);
    })
    .on("end", function () {
      console.log("finished");
    });
  return data;
};

export { processCSV };
