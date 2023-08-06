import * as http from "http";
import * as google from "googlethis";

const corsWhitelist = ["https://mrepol742.github.io"];

const server = http.createServer(getRoutes());

server.listen(8000, function () {
    console.log("Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...");
});

function getRoutes() {
    return async function (req, res) {
        let ress = req.url;
        let url = ress.split("?")[0];
        console.log(req.method + " " + req.headers.origin + " " + url);
        if (req.method != "GET") {
            res.writeHead(301, { Location: "https://mrepol742.github.io/unauthorized" });
            res.end();
            return;
        }
        if (url == "/img" || url == "/img/index.html") {
            if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
                let data = ress.split("?")[1];
                let results = [];
                try {
                    const images = await google.image(data, { safe: true });
                    let i;
                    for (i = 0; i < images.length; i++) {
                        results.push(images[i]);
                    }
                    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(results));
                } catch (err) {
                    console.log(err);
                }
            } else {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end('{error:"Undefined Parameters"}');
            }
        } else if (url == "/" || url == "/index.html") {
            if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
                let data = ress.split("?")[1];
                let results = [];
                try {
                    let response1 = await google.search(data, {
                        page: 0,
                        safe: true,
                        parse_ads: false,
                    });
                    let i;
                    for (i = 0; i < response1.results.length; i++) {
                        results.push(response1.results[i]);
                    }
                    try {
                        let response2 = await google.search(data, {
                            page: 1,
                            safe: true,
                            parse_ads: false,
                        });
                        let i1;
                        for (i1 = 0; i1 < response2.results.length; i1++) {
                            results.push(response2.results[i1]);
                        }
                        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(200);
                        res.end(JSON.stringify(results));
                    } catch (err) {}
                } catch (err) {}
            } else {
                res.setHeader("Content-Type", "text/html");
                res.writeHead(200);
                res.end('{error:"Undefined Parameters"}');
            }
        } else {
            res.writeHead(301, { Location: "https://mrepol742.github.io/unauthorized" });
            res.end();
        }
    };
}
