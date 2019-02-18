"use strict";
exports.__esModule = true;
var Response = /** @class */ (function () {
    function Response(status) {
        if (status === void 0) { status = Response.OK; }
        this.status = status;
    }
    Object.defineProperty(Response, "OK", {
        get: function () { return 'ok'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response, "ERROR", {
        get: function () { return 'error'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response, "INVALID", {
        get: function () { return 'invalid'; },
        enumerable: true,
        configurable: true
    });
    return Response;
}());
exports["default"] = Response;
