/*
 *
 * Copyright (c) 2023 Melvin Jones Repol (mrepol742.github.io). All Rights Reserved.
 *
 * License under the GNU GENERAL PUBLIC LICENSE, version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://github.com/mrepol742/search/blob/master/LICENSE
 *
 * Unless required by the applicable law or agreed in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as http from "http";
import * as google from "googlethis";
import { Innertube, UniversalCache, Utils } from "youtubei.js";

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
        if (req.method != "GET" || !(corsWhitelist.indexOf(req.headers.origin) !== -1)) {
            res.writeHead(301, { Location: "https://mrepol742.github.io/unauthorized?utm_source=mrepol742.repl.co" });
            res.end();
        } else {
            let data = ress.split("?")[1];
            let results = [];
            if (url == "/vid" || url == "/vid/index.html") {
                try {
                    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
                    const search = await yt.search(data, { type: "video" });
                    if (search.results) {
                        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(200);
                        res.end(JSON.stringify(search.results));
                    }
                } catch (err) {
                    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(500);
                    res.end('{error: "Internal Server Error", code: 500}');
                }
            } else if (url == "/mus" || url == "/mus/index.html") {
                try {
                    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
                    const search = await yt.music.search(data, { type: "song" });
                    if (search.results) {
                        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(200);
                        res.end(JSON.stringify(search.results));
                    }
                } catch (err) {
                    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(500);
                    res.end('{error: "Internal Server Error", code: 500}');
                }
            } else if (url == "/img" || url == "/img/index.html") {
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
                    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(500);
                    res.end('{error: "Internal Server Error", code: 500}');
                }
            } else if (url == "/" || url == "/index.html") {
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
                    } catch (err) {
                        res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                        res.setHeader("Content-Type", "application/json");
                        res.writeHead(500);
                        res.end('{error: "Internal Server Error", code: 500}');
                    }
                } catch (err) {
                    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                    res.setHeader("Content-Type", "application/json");
                    res.writeHead(500);
                    res.end('{error: "Internal Server Error", code: 500}');
                }
            } else {
                res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                res.setHeader("Content-Type", "application/json");
                res.writeHead(400);
                res.end('{error: "Bad Request", code: 400}');
            }
        }
    };
}
