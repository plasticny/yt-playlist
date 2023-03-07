const Router = require("./Router");
const Action = require("./Action")

class Server {
    static #server = null;
    static #doPublicServer = false;
    static #PORT = 8888;
    static #IP = "192.168.0.107";
    // IPv4 218.252.62.18

    ///////////////////////////////////////////////////
    /**************** public function ****************/
    static getServer() {
        if(this.#server == null) {
            console.error("Server is not started!!");
        }
        return this.#server;
    }

    static start() {
        if(this.#server == null) {
            this.#startServer();
        }
        return this.#server;
    }


    ///////////////////////////////////////////////////
    /**************** private function ***************/
    static #startServer() {
        this.#server = require("express")();

        Action.init(this.#server);
        Router.init(this.#server);

        // start server
        if(this.doPublicServer) {
            this.#server.listen(this.#PORT, this.#IP);
        } else {
            this.#server.listen(this.#PORT);
        }

        console.log("Server started")
        console.log("Src Root:", Router.srcRoot);
        console.log("Port:", this.#PORT);
        console.log("IP:", this.#doPublicServer ? this.#IP : "Not Public");
        console.log("**************** LOG START *****************");
    }
}
module.exports = Server;