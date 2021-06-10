/*
*
* Copyright (c) 2021 Melvin Jones Repol (mrepol742.github.io). All rights reserved.
*
* License under the GNU General Public License, Version 3.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     https://www.gnu.org/licenses/gpl-3.0.en.html
*
* Unless required by the applicable law or agreed in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

const node = document.getElementById("search");
node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        a();
    }
});

var su = WebviumSearchHelper.query().split(":");
if (su != "null") {
for (let i = 0; i < su.length; i++) {
let opt = document.createElement("option")
opt.setAttribute("value", atob(su[i]))
suggestions.appendChild(opt)
}
}

function a() {
"use strict";
    let t = search.value;
    if (t.trim()) {
        const a = document.getElementById("search").value;
        const aq = a.toLowerCase();
        if (aq.startsWith("https://") || aq.startsWith("http://")) {
            if (WebviumSearchHelper.isValidDomain(aq)) {
                window.location.href = a;
            } else {
                window.location.href = WebviumSearchHelper.getSearchEngine() + a;
            }
        } else {
            if (WebviumSearchHelper.isValidDomain(aq)) {
                window.location.href = "https://" + a;
            } else {
                window.location.href = WebviumSearchHelper.getSearchEngine() + a;
            }
        }
        WebviumSearchHelper.saveQuery(a);
    }
}
