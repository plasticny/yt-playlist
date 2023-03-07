from json import load, dump
import sys

def run(playlist_idx, song_idx, new_latest_play, serverRoot):
    JSONFOLDER_PATH = f"{serverRoot}/asset/json"
    PLAYLISTINDEX_PATH = f"{JSONFOLDER_PATH}/playListIndex.json"

    playList_json_path = None
    playList_data = None

    with open(PLAYLISTINDEX_PATH, "r", encoding="utf8") as file:
        playList_info = load(file)["records"][str(playlist_idx)]
        playlist_json_nm = playList_info["json_file"]
        playList_json_path = f"{JSONFOLDER_PATH}/{playlist_json_nm}.json"

    with open(playList_json_path, "r", encoding="utf8") as file:
        playList_data = load(file)

    # update latest play time
    playList_data["records"][str(song_idx)]["latest_play"] = int(new_latest_play)

    # save data
    with open(playList_json_path, "w", encoding="utf8") as file:
        dump(playList_data, file, ensure_ascii=False, indent=0)

    print(200)

sys.stdout.reconfigure(encoding="utf-8")

arg_ls = [arg for _, arg in enumerate(sys.argv)]
try:
    run(arg_ls[1], arg_ls[2], arg_ls[3], arg_ls[4])
except Exception as e:
    print(e)