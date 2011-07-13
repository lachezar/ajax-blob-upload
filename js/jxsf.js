jx.generateBoundry = function(fileData) {
    var boundry = '';
    do {
        boundry = parseInt(Math.random()*Math.pow(10, 16)).toString(36) + '' + parseInt(Math.random()*Math.pow(10, 16)).toString(36);
    } while(fileData.indexOf(boundry) > -1);
    
    return boundry;
};

jx.error = function(rcode) {
    alert('Error! Response Code: ' + rcode);
};

jx.loadImage = function(url, fileData, callback) {
    if (!fileData.match(/^data:image\/(jpeg|png);base64,(.+)$/)) {
        alert('Invalid image format!');
    }  
    this.loadFile(url, fileData, 'image', callback);
};

jx.loadFile = function(url, fileData, fileName, callback, opt) {
    var http = this.init(); //The XMLHttpRequest object is recreated at every call - to defeat Cache problem in IE
    if(!http||!url) return;
    
    var boundary = this.generateBoundry(fileData);

    var parts = url.split('?');
    var url = parts[0];
    var parameters = parts[1] ? parts[1].split('&') : [];

    var body = '';
    for (var i = 0; i < parameters.length; i++) {
        var p = parameters[i].split('=');
        body += "--" + boundary + "\r\n\
Content-Disposition: form-data; name='"+p[0]+"'\r\n\
\r\n\
"+(p[1] || '')+"\r\n";
    }
        
    body += "--" + boundary + "\r\n\
Content-Disposition: form-data; name='" + fileName + "'; filename='" + fileName + "'\r\n\
Content-Type: image/png\r\n\
\r\n\
"+ fileData + "\r\n\
--" + boundary + "--\r\n";
    
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "multipart/form-data; boundary="+boundary);
    http.setRequestHeader("Content-Length", body.length);
    http.setRequestHeader("Connection", "close");

    if (opt && opt.handler) { 
        http.onreadystatechange = function() { opt.handler(http); };
    } else {
        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4) {//Ready State will be 4 when the document is loaded.
                if(http.status == 200) {
                    var result = "";
                    if (http.responseText) result = http.responseText;

                    //Give the data to the callback function.
                    if (callback) callback(result);
                } else {
                    if(this.error) this.error(http.status);
                }
            }
        }
    }
    
    http.send(body);
};
