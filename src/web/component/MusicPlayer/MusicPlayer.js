import AjaxCommon from "/AjaxCommon";
import loadResource from "/component/componentCore.js";

const TAB = "music-player";
const OBJ = "MusicPlayer";

export default class MusicPlayer {
    // fix
    $tab
    // fix

    // html element
    $btnPlay;
    $btnNextSong;
    $progress_bar;
    $song_title;
    $player;

    // attribute
    playlist_idx = undefined;
    audio = undefined;


    constructor() {}

    async init(callback) {
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

    #buildUI() {
        this.$btnPlay = this.$tab.find("#btnPlay");
        this.$btnNextSong = this.$tab.find("#btnNextSong")
        this.$progress_bar = this.$tab.find("#progress_bar")
        this.$song_title = this.$tab.find("#song_title")

        // progress bar
        setInterval(function(){
            let presentage = this.audio ? (this.audio.currentTime/this.audio.duration*100) : 0
            this.$progress_bar.css({width: `${presentage}%`})
        }.bind(this), 100)
        
        this.$btnPlay.click(function(){
            if(!this.audio) { return }

            if(this.audio.paused) this.play() 
            else this.pause()
        }.bind(this));

        this.$btnNextSong.click(function(){
            if(!this.audio) { return; }
            this.pause()
            this.nextSong();
        }.bind(this));
    }


    // public functions

    play() {
        if(!this.audio) { return }
        
        this.audio.play();
        if(!this.audio.paused) {
            this.$btnPlay.addClass("fa-pause")
            this.$btnPlay.removeClass("fa-play")
        }
    }

    pause() {
        if(!this.audio) { return }
        this.audio.pause();
        this.$btnPlay.addClass("fa-play")
        this.$btnPlay.removeClass("fa-pause")
    }

    setPlayList(playlist_idx) {
        this.playlist_idx = playlist_idx
    }

    async nextSong() {
        var playList_idx = this.playlist_idx;

        this.$tab.css({"background-image": ""})
        this.$song_title.html("")
        $("title").html("")
        
        let song = await AjaxCommon.get("/action/nextSong", {playList_idx:playList_idx})

        this.$song_title.html(song.title)
        $("title").html(song.title)
        this.$tab.css({"background-image": `url("${song.thumbnail_url}")`})

        this.audio = new Audio(`audio/${song.file_nm}`)
        this.play()

        $(this.audio).on("ended", function(){
            this.nextSong(playList_idx);
        }.bind(this))
    }
}