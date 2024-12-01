var http = require("http"),
    url = require("url"),
    mysql = require("mysql");

function getData(callback) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "studb038",
        password: "xyz456",
        database: "db038"
     });
    
    con.connect(function(err) {
        if (err) throw err;
        con.query("select k.*,t.* from kutato k join kapcsol ka on k.fkod=ka.fkod join talalmany t on t.tkod=ka.tkod", function (err, result, fields) {
          if (err) throw err;
          var columns = [];
          for(var x in fields)
            columns.push(fields[x].name);
          getHtmlText(columns, result, callback);
        });
    });
}
module.exports = { getData };

function getHtmlText(columns, rows, callback) {
    const columnLabels = {
        fkod: "Fkód",
        nev: "Név",
        szul: "Születési év",
        meghal: "Halálozási év",
        tkod: "Tkód",
        talnev: "Találmány neve"
    };

    const tableHeaders = columns
        .map(col => `<th style="background-color: darkgrey; color: white; padding: 10px;">${columnLabels[col] || col}</th>`)
        .join("");

    const tableRows = rows.map((row, index) => {
        const rowStyle = index % 2 === 0 ? "background-color: #f9f9f9;" : "background-color: #ffffff;";
        const cells = Object.values(row).map(value => {
            return `<td style="padding: 10px;">${value}</td>`;
        }).join("");
        return `<tr style="${rowStyle}">${cells}</tr>`;
    }).join("");

    const table = `
        <table style="border-collapse: collapse; text-align:center; width: 100%; border: 1px solid #ddd;">
            <tr>${tableHeaders}</tr>
            ${tableRows}
        </table>
    `;
    callback(table);
}
