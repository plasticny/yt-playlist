export default async function loadResource(tabName, ObjName) {
    const $tab = $(tabName);
    if($tab.length == 0) {
        throw `html tab with ${tabName} is not found`
    }

    /* load css */
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "../component/"+ObjName+".css";
    $("head").append(link);

    /* load html */
    return await new Promise(resolve => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "../component/"+ObjName+".html");
        xhr.onload = res => { 
            const tabHtml = res.currentTarget.responseText;
            resolve({$tab, tabHtml});
            return;
        }
        xhr.send();
    });
}