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

function crud(req, res) {
    const con = createDbConnection();
    con.connect(err => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("HIBA!");
            return;
        }

        const urlParts = req.url.split("/");

		if (req.method === "GET" && urlParts[1] === "crud") {
				con.query("SELECT * FROM talalmany order by talnev", (err, results) => {
					if (err) {
						console.error("GET hiba");
						res.writeHead(500);
						res.end("Hiba történt.");
						return;
					}
					res.writeHead(200, { "Content-Type": "application/json" });
					res.end(JSON.stringify(results));
					con.end();
				});
			
		} else if (req.method === "POST" && urlParts[1] === "crud") {
			let body = "";
			req.on("data", chunk => {
				body += chunk;
			});
			req.on("end", () => {
				const parsedBody = qs.parse(body);
				const talnev = parsedBody.talnev;
				con.query("INSERT INTO talalmany (talnev) VALUES (?)", [talnev], err => {
					if (err) {
						console.error("POST hiba", err);
						res.writeHead(500);
						res.end("Rekord létrehozása sikertelen.");
						return;
					}
					res.writeHead(201);
					res.end("Rekord létrehozva.");
					con.end();
				});
			});
			
		} 
		else if (req.method === "PUT" && urlParts[1] === "crud") {
            let body = "";
            req.on("data", chunk => {
                body += chunk;
            });
            req.on("end", () => {
                const parsedBody = qs.parse(body);
                const talnev = parsedBody.talnev;
                const tkod = parsedBody.tkod;
                
                if (!tkod) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("Hiányzó tkod paraméter.");
                    return;
                }
                
                con.query("UPDATE talalmany SET talnev = ? WHERE tkod = ?", [talnev, tkod], err => {
                    if (err) {
                        console.error("PUT hiba");
                        res.writeHead(500);
                        res.end("Rekord módosítása sikertelen.");
                        return;
                    }
                    res.writeHead(200);
                    res.end("Rekord frissítve!");
                    con.end();
                });
            });
        } 
		else if (req.method === "DELETE" && urlParts[1] === "crud") {
					let body = "";
					req.on("data", chunk => {
						body += chunk;
					});
					req.on("end", () => {
						const parsedBody = qs.parse(body);
						const tkod = parsedBody.tkod;
						
						if (!tkod) {
							res.writeHead(400, { "Content-Type": "text/plain" });
							res.end("Hiányzó tkod paraméter.");
							return;
						}
						
						con.query("DELETE FROM kapcsol WHERE tkod = ?", [tkod], (err) => {
							if (err) {
								console.error("DELETE hiba", err);
								res.writeHead(500, { "Content-Type": "text/plain" });
								res.end("DELETE hiba");
								return;
							}
							
							con.query("DELETE FROM talalmany WHERE tkod = ?", [tkod], (err) => {
								if (err) {
									console.error("Hiba a talalmany törlése során:", err);
									res.writeHead(500, { "Content-Type": "text/plain" });
									res.end("DELETE hiba");
									return;
								}
								
								res.writeHead(200, { "Content-Type": "text/plain" });
								res.end("Rekord törölve!");
								con.end();
							});
						});
					});
		}
		else {
            res.writeHead(405, { "Content-Type": "text/plain" });
            res.end("Nem támogatott művelet.");
			con.end();
        }
    });
}
module.exports = { crud };
