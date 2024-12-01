const mysql = require("mysql");
const qs = require("querystring");

function createDbConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "studb038",
        password: "xyz456",
        database: "db038"
    });
}

function uzenetKuldes(req, res) {
    if (req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const formData = qs.parse(body);

            const con = createDbConnection();
            con.connect(err => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("HIBA!");
                    return;
                }

                const sql = "INSERT INTO kapcsolat (nev, email, targy, uzenet) VALUES (?, ?, ?, ?)";
                const params = [formData.nev, formData.email, formData.targy, formData.uzenet];

                con.query(sql, params, (err, result) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Adatbázis hiba.");
                    } else {
						res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                        res.end("<h1>Sikeres beküldés!</h1>");
                        //response.writeHead(200, {


                    }
                    con.end();
                });
            });
        });
    } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Nem támogatott HTTP metódus.");
    }
}
module.exports = { uzenetKuldes };
