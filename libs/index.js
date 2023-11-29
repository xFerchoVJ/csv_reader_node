import fs from "fs";
import { parse } from "csv-parse";

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

export { processCSV };
