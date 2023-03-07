export default class AjaxCommon {
    static get(url, data) {
        return new Promise((resolve, reject) => {
            $.get({
                url: url,
                data: data || {},
                success: resolve,
                error: reject
            })
        }); 
    }
}