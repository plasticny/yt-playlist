const Logger = require("./Logger");
const PlayControllAction = require("./PlayControllAction");
const Router =  require("./Router");

// Master class of backend action
class Action {
    static #server = undefined;

    //////////////////////////////////////////////////
    /**************** public function ***************/
    static setAction(url, action, type) {
        this.#server[type](url, (req, res) => {
            Logger.logReq(req);
            action(req, res);
        });
    }

    static init(server) {
        this.#server = server;
        PlayControllAction.init(this)
    }    
}
module.exports = Action;