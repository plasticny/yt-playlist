const Logger = require("./Logger");

class Router {
    static srcRoot = __dirname.substring(0, __dirname.lastIndexOf('\\server\\core'));;
    static webRoot = this.srcRoot+"\\web";
    static serverRoot = this.srcRoot+"\\server";
    static assetRoot = this.serverRoot+"\\asset";
    static tempRoot = this.serverRoot+"\\temp";

    static #server = undefined;

    static init(server) {
        this.#server = server;
        this.#setCommonRouting();
        this.#setPageRouting();
        this.#setJsRouting();
        this.#setCssRouting();
        this.#setComponentRouting();
        this.#setAssetRouting();
    }

   
    //////////////////////////////////////////////////
    /*************** private function ***************/
    static #setCommonRouting() {
        // css
        this.#addRoute("/css/common.css", this.webRoot+"/css/common/common.css");
        // jq
        this.#addRoute("/script/jquery.js", this.webRoot+"/plugin/jquery-3.6.0.min.js");

        // fontawesome
        const fontawesomeRoot = __dirname.substring(0, __dirname.lastIndexOf('\\src\\server\\core'))+"/node_modules/@fortawesome/fontawesome-free";
        this.#addRoute("/css/fontawesome.css", fontawesomeRoot+"/css/all.css");
        this.#addRoute("/webfonts/*", (req) => { return fontawesomeRoot+req.path; });
    }

    static #setPageRouting() {
        this.#addRoute("/", this.webRoot+"/page/index.html");
        this.#addRoute("/index.html", this.webRoot+"/page/index.html");
    }

    static #setJsRouting() {
        this.#addRoute("/script/index.js", this.webRoot+"/script/index.js");
        this.#addRoute("*/AjaxCommon", this.webRoot+"/script/AjaxCommon.js");
    }

    static #setCssRouting() {        
        this.#addRoute("/css/index.css", this.webRoot+"/css/index/index.css");
        this.#addRoute("/css/index.css.map", this.webRoot+"/css/index/index.css.map");
    }


    static #setComponentRouting() {
        this.#addRoute("*/component/ComponentCore.js", this.webRoot+"/component/ComponentCore.js");

        this.#addComponentRouting("MusicPlayer");
        this.#addComponentRouting("PlayListIndex");
    }

    static #addComponentRouting(name) {
        this.#addRoute("*/component/"+name+".js", this.webRoot+"/component/"+name+"/"+name+".js");
        this.#addRoute("*/component/"+name+".html", this.webRoot+"/component/"+name+"/"+name+".html");
        this.#addRoute("*/component/"+name+".css", this.webRoot+"/css/component/"+name+"/"+name+".css");
    }


    static #setAssetRouting() {
        this.#addRoute("/asset/*", (req) => { return this.webRoot+req.path });
        this.#addRoute("/css/font/*", (req) => { return `${this.webRoot}/asset/font/${req.params[0]}.ttf` });
        this.#addRoute("/audio/*", (req) => { return `${this.serverRoot}/temp/${req.params[0]}.wav` });
    }

    static #addRoute(routePath, filePath) {
        this.#server.get(routePath, (req, res) => { 
            Logger.logReq(req);

            if(typeof filePath === "function") {
                res.sendFile(filePath(req));
            } else {
                res.sendFile(filePath); 
            }
        });
    }
}
module.exports = Router;