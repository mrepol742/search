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
            res.writeHead(301, { Location: "https://mrepol742.github.io/unauthorized" });
            res.end();
        } else {
            if (url == "/img" || url == "/img/index.html") {
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
            } else if (url == "/" || url == "/index.html") {
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
                res.writeHead(301, { Location: "https://mrepol742.github.io/404.html" });
                res.end();
            }
        }
    };
}
