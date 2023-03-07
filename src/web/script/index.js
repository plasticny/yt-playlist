import AjaxCommon from "./AjaxCommon"

export default function index() {
    /////////////////////////////////////////////////
    /****************** Attribute ******************/
    const $btnPlay = $("#btnPlay");
    const $progress_bar = $("#progress_bar")
    const $song_title = $("#song_title")
    const $player = $("#player")

    var audio = undefined

    construct();
    return;

    async function construct() {
        let playList_index = await AjaxCommon.get("/action/getPlayListDir")
        let playList = await AjaxCommon.get("/action/getPlayList", {idx:playList_index[0].index})

        musicPlayer(playList_index[0].index)
    }


    //////////////////////////////////////////////////
    /*************** private function ***************/

    // Music player
    // TODO: make this a component

    function musicPlayer(playList_idx) {
        // progress bar
        setInterval(()=>{
            let presentage = audio ? (audio.currentTime/audio.duration*100) : 0
            $progress_bar.css({width: `${presentage}%`})
        }, 100)
        
        $btnPlay.click(togglePlay);

        nextSong(playList_idx)
    }

    function togglePlay() {
        if(!audio) { return }

        if(audio.paused) {
            audio.play();
            $btnPlay.addClass("fa-pause")
            $btnPlay.removeClass("fa-play")
        } else {
            audio.pause();
            $btnPlay.addClass("fa-play")
            $btnPlay.removeClass("fa-pause")
        }
    }

    async function nextSong(playList_idx) {
        let song = await AjaxCommon.get("/action/nextSong", {playList_idx:playList_idx})
        $song_title.html(song.title)
        $("title").html(song.title)
        $player.css({"background-image": `url("${song.thumbnail_url}")`})

        audio = new Audio(`audio/${song.file_nm}`)
        try { audio.play() } catch(e) { console.log(e) }

        $(audio).on("ended", () => {
            nextSong(playList_idx);
        })
    }

    // Music player end

    //////////////////////////////////////////////////
    /********************* Ajax *********************/
}
(index());