import AjaxCommon from "/AjaxCommon";
import loadResource from "/component/componentCore.js";

const TAB = "playlist-index";
const OBJ = "PlayListIndex";

export default class PlayListIndex {
    // fix
    $tab
    // fix

    // variable
    playlist_dict;

    async init() {
        return new Promise(async function(resolve){
            // fix
            const {$tab, tabHtml} = await loadResource(TAB, OBJ);
            this.$tab = $tab;
            this.$tab.html(tabHtml);

            this.#buildUI();
            resolve();
            // fix
        }.bind(this))
    }

    async #buildUI() {
        this.playlist_dict = await AjaxCommon.get("/action/getPlayListDir")
        this.$tab.find(".playlist-name").html(this.playlist_dict[0].title);
    }


    // public functions

}