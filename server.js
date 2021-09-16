const http = require("http");
const fs = require("fs");
const qs = require("querystring");
let users = []
let next_turn = {action: false, change: null, remove: false}


function servResponse(req, res) {
    switch (req.url) {
        case "/login": {
            let allData = ""
            req.on("data", function (data) {
                allData += data;
            })
            req.on("end", function (data) {
                let parsed_data = qs.parse(allData)
                if (users.length < 2) {
                    users.push(parsed_data.nick)
                    let start = {start: true, user: users.length, nick: parsed_data.nick}
                    res.end(JSON.stringify(start))
                } else {
                    let start = {start: false}
                    res.end(JSON.stringify(start))
                }
                res.end();
            })
            break
        }
        case "/reset": {
            users = []
            next_turn = {action: false, change: null, remove: false}
            res.end();
            break
        }
        case"/secondplayer": {
            let secondplayer = {active: users.length === 2, enemy_nick: users[1]}
            res.end(JSON.stringify(secondplayer));
            break
        }
        case "/playersturn": {
            let temp_obj = {
                next_turn: next_turn.action,
                change: next_turn.change,
                remove: next_turn.remove
            }
            res.end(JSON.stringify(temp_obj));
            next_turn = {action: false, change: null, remove: false}
            break
        }
        case "/playersmove": {
            let allData = ""
            req.on("data", function (data) {
                allData += data
            })
            req.on("end", function (data) {
                allData = qs.parse(allData)
                next_turn.action = true
                next_turn.change = allData
                res.end();
            })
            break
        }
        case "/checkerdelete": {
            next_turn.remove = true
            res.end();
            break
        }
    }
}

const server = http.createServer(function (req, res) {
    switch (req.method) {
        case "GET":
            switch (req.url) {
                case "/":
                    fs.readFile("./static/index.html", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/ui.js":
                    fs.readFile("./static/scripts/UI.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/net.js":
                    fs.readFile("./static/scripts/Net.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/game.js":
                    fs.readFile("./static/scripts/Game.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/main.js":
                    fs.readFile("./static/scripts/Main.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/three.js":
                    fs.readFile("./static/scripts/three.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/three_97.js":
                    fs.readFile("./static/scripts/three_97.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/Pionek.js":
                    fs.readFile("./static/scripts/Pionek.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/Pole.js":
                    fs.readFile("./static/scripts/Pole.js", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/style":
                    fs.readFile("./static/style.css", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/black_box":
                    fs.readFile("./static/images/square_dark_texture.jpg", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'image/jpeg; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/white_box":
                    fs.readFile("./static/images/square_light_texture.jpg", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'image/jpeg; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/light_pawn":
                    fs.readFile("./static/images/light_pawn.jpg", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'image/jpeg; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                case "/dark_pawn":
                    fs.readFile("./static/images/dark_pawn.jpg", function (error, data) {
                        res.writeHead(200, {'Content-Type': 'image/jpeg; charset=utf-8'});
                        res.write(data);
                        res.end();
                    });
                    break;
                default:
                    break;
            }
            break;
        case "POST":
            servResponse(req, res);
            break;

    }

}).listen(3000);

