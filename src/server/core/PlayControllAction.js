const { randomInt } = require("crypto")
const { execFileSync } = require("child_process")
const fs = require("fs")
const Router = require("./Router")
const Tools = require("./Tools")
const uuid = require("uuid")

class PlayControllAction {
    static #action = undefined
    static #playList_index = undefined
    static #playList_dict = undefined // {idx:{playlist, queue}}
    static #jsonFolder_path = undefined

    static init(action) {
        this.#action = action
        this.#action.setAction("/action/getPlayListDir", this.#getPlayListDir.bind(this), "get");
        this.#action.setAction("/action/getPlayList", this.#getPlayList.bind(this), "get");
        this.#action.setAction("/action/nextSong", this.#nextSong.bind(this), "get");

        this.#jsonFolder_path = Router.serverRoot+"/asset/json";
        this.#loadPlayListIndex();

        this.#playList_dict = new Object()
    }

    static async #loadPlayListIndex() {
        const playListIndex_json =  fs.readFileSync(this.#jsonFolder_path+"/playListIndex.json")
        this.#playList_index= JSON.parse(playListIndex_json).records
    }

    static #getPlayListDir(req,res) {
        let dir = []
        for(let [index,item] of Object.entries(this.#playList_index)) {
            dir.push({
                index: index,
                title: item.title
            })
        }
        res.send(dir)
    }

    // query: {idx}
    static async #getPlayList(req, res) {
        const idx = req.query.idx;

        // if the playlist is not loaded into memory, load it first
        if(this.#playList_dict[idx] == undefined)
            this.#loadPlayList(idx);

        res.send(this.#playList_dict[idx].playlist)
    }

    // query: {playList_idx}
    static async #nextSong(req, res) {
        const playList_idx = req.query.playList_idx;
        
        // if the playlist is not loaded into memory, load it first
        if(this.#playList_dict[playList_idx] == undefined)
            this.#loadPlayList(playList_idx);

        const playlist = this.#playList_dict[playList_idx]

        // randomly choose a song of the first 5 song        
        let randint = randomInt(5)
        let item = playlist.queue[randint]
        
        // update first 5 item in the queue
        for(let idx = randint; idx > 0; idx--) {
            playlist.queue[idx] = playlist.queue[idx-1]
        }
        
        let time = new Date().getTime()
        item.latest_play = time
        
        let song_idx = item[0]
        let song = this.#playList_dict[playList_idx].playlist[item[0]];

        // download the audio into the server
        let file_nm = await this.#downloadAudio(song.url, song.title);
        
        // remove the first item and push the choosen song to the tail of queue
        playlist.queue.shift()
        playlist.queue.push(item)

        // update this song's latest play time
        await Tools.runPython(`${Router.serverRoot}/python/updateSongLatestPlay.py`, [playList_idx, song_idx, time, Router.serverRoot]);

        res.send({thumbnail_url: song.thumbnail_url, title: song.title, song_idx: song_idx, file_nm: file_nm})
    }



    static #downloadAudio(url) {
        return new Promise(async function(resolve) {
            const TEMPFOLDER_PATH = `${Router.serverRoot}/temp`

            // remove old file
            let dir = await fs.readdirSync(TEMPFOLDER_PATH);
            for(let file_nm of dir) {
                if(file_nm == "blank") continue
                await fs.unlinkSync(`${TEMPFOLDER_PATH}/${file_nm}`)
            }
            
            // download
            let file_nm = uuid.v1()
            const EXEPATH   = `${Router.serverRoot}/plugin/yt-dlp.exe`
            const PARAMETER = `-f 140 -x --audio-format wav -o ${TEMPFOLDER_PATH}/${file_nm}.wav ${url}`
            await execFileSync(EXEPATH, PARAMETER.split(' '))
            resolve(file_nm)
        })
    }

    // load the playlist data into memory
    static #loadPlayList(idx) {
        // playList_info : { title, url, json_file }
        let playList_info = this.#playList_index[idx]
        const playList_json =  fs.readFileSync(this.#jsonFolder_path+"/"+playList_info.json_file+".json")
        let playlist = JSON.parse(playList_json).records;

        // queue the playlist
        let playlist_queue = [];
        for(let [song_key, song_info] of Object.entries(playlist)) {
            playlist_queue.push([song_key, song_info.latest_play]);
        }
        playlist_queue = playlist_queue.sort((a,b) => { return a[1] - b[1]; });

        // save playlist info into memory
        this.#playList_dict[idx] = new Object();
        this.#playList_dict[idx].playlist = playlist;
        this.#playList_dict[idx].queue = playlist_queue;
    }
}

module.exports = PlayControllAction