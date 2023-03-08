from json import dump, load
from uuid import uuid1
from pathlib import Path
from pytube import Playlist
import sys

def run(url):
    PLAYLISTJSON_FOLDER_PATH = f"{Path().absolute()}/src/server/asset/json"

    # read playlist    
    ls = Playlist(url)

    urls = ls.video_urls
    videos = ls.videos

    video_dict = {
        "next_record_id": 0,
        "records": {}
    }
    record_id = 0
    for i in range(len(videos)):
        while True:
            try:
                video_dict["records"][record_id] = {
                    "title":videos[i].title, 
                    "thumbnail_url":videos[i].thumbnail_url, 
                    "url":urls[i],
                    "latest_play": 0,
                }
                record_id += 1
            except:
                None
            break
    video_dict["next_record_id"] = record_id

    # save playlist
    index = None
    with open(f"{PLAYLISTJSON_FOLDER_PATH}/playListIndex.json", "r", encoding='utf8') as file:
        index = load(file)
                
    uuid = str(uuid1())
    record_id = index["next_record_id"]
    index["records"][record_id] = {
        "title":ls.title,
        "url": url,
        "json_file": uuid
    }
    index["next_record_id"] += 1
    
    with open(f"{PLAYLISTJSON_FOLDER_PATH}/playListIndex.json", "w", encoding='utf8') as file:
        print(index)
        dump(index, file, ensure_ascii=False, indent=0)
    with open(f"{PLAYLISTJSON_FOLDER_PATH}/{uuid}.json", "w", encoding='utf8') as file:
        dump(video_dict, file, ensure_ascii=False, indent=0)


sys.stdout.reconfigure(encoding="utf-8")

for i, arg in enumerate(sys.argv):
    if i == 0:
        continue
    else:
        try:
            run(arg)
        except:
            print(500)