const child_process = require("child_process")

class Tools {
    // param_ls: ls of parameter that passing to the python script
    // callback: function that handle a parameter "data"
    static runPython(filePath, param_ls, callback) {
        return new Promise(resolve => {
            let execute_ls = [filePath]
            for(let param of param_ls) {
                execute_ls.push(param)
            }
            
            callback = callback || (()=>{})
            child_process.spawn('python', execute_ls).stdout.on('data', (data) => {
                callback(data);
                resolve()
            });
        })
    }
}

module.exports = Tools