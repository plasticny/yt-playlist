import AjaxCommon from "./AjaxCommon"
import MusicPlayer from "/component/MusicPlayer.js";
import PlayListIndex from "/component/PlayListIndex.js";

export default function index() {
    /////////////////////////////////////////////////
    /****************** Attribute ******************/

    var playListIndex;
    var musicPlayer;

    construct();
    return;

    async function construct() {
        let playList_index = await AjaxCommon.get("/action/getPlayListDir")
        let playlist_idx = playList_index[1].index
        let playList = await AjaxCommon.get("/action/getPlayList", {idx:playlist_idx})

        // init the playlist index
        playListIndex = new PlayListIndex();
        await playListIndex.init();

        // init the player
        musicPlayer = new MusicPlayer();
        await musicPlayer.init();
        musicPlayer.setPlayList(playlist_idx)
        musicPlayer.nextSong()
    }


    //////////////////////////////////////////////////
    /*************** private function ***************/


    //////////////////////////////////////////////////
    /********************* Ajax *********************/
}
(index());