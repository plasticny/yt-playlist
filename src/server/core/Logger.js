class Logger {
    // simply log a msg
    static logMsg(msg) {
        console.log("[" + new Date().toLocaleString() + "] " + msg);
    }

    static logReq(req) {
        this.logMsg(req.ip + " " + decodeURI(req.url));
    }

    static logRejected(req) {
        this.logMsg(req.ip + " rejected");
    }

    // friend apporach for logging a msg with header
    static logActionMsg(header, body) {
        this.logMsg("{"+header+"} "+body);
    }
}
module.exports = Logger;