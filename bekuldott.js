var http = require("http"),
    url = require("url"),
    mysql = require("mysql");

function getKapcsolat(callback) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "studb038",
        password: "xyz456",
        database: "db038"
     });
    
    con.connect(function(err) {
        if (err) throw err;
        con.query("select * from kapcsolat order by kuldes_ideje desc;", function (err, result, fields) {
          if (err) throw err;
          var columns = [];
          for(var x in fields)
            columns.push(fields[x].name);
          getHtmlText(columns, result, callback);
        });
    });
}
module.exports = { getKapcsolat };

function getHtmlText(columns, rows, callback) {
    const columnLabels = {
        id: "ID",
        nev: "Név",
        email: "E-mail",
        targy: "Tárgy",
        uzenet: "Üzenet",
        kuldes_ideje: "Küldés ideje"
    };

    const tableHeaders = columns
        .map(col => `<th style="background-color: darkgrey; color: white; padding: 10px;">${columnLabels[col] || col}</th>`)
        .join("");

    const tableRows = rows.map((row, index) => {
        const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "background-color: #ffffff;";
        const cells = Object.values(row).map(value => {
            if (value instanceof Date) {
                return `<td style="padding: 10px;text-align:center;">${new Date(value).toLocaleString("hu-HU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })}</td>`;
            }
            return `<td style="padding: 10px;text-align:center;">${value}</td>`;
        }).join("");
        return `<tr style="${rowStyle}">${cells}</tr>`;
    }).join("");

    const table = `
        <table style="border-collapse: collapse; width: 100%; border: 1px solid #ddd;text-align:center;">
            <tr>${tableHeaders}</tr>
            ${tableRows}
        </table>
    `;
    callback(table);
}
