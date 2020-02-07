"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xhr = function (url, method, mimeType, body) {
    if (method === void 0) { method = 'GET'; }
    var headers = new Headers();
    headers.append('User-Agent', 'Mesh/1.0');
    if (mimeType) {
        headers.append('Accept', mimeType);
        headers.append('Content-Type', mimeType);
    }
    var request = new Request(url, {
        method: method,
        cache: 'reload',
        mode: 'cors',
        credentials: 'same-origin',
        headers: headers,
        body: body
    });
    return fetch(request);
};
//# sourceMappingURL=Xhr.js.map