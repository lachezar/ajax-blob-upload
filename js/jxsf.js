jx.generateBoundary = function(fieldsData) {
    var boundary = parseInt(Math.random()*Math.pow(10, 16)).toString(36) + '' + parseInt(Math.random()*Math.pow(10, 16)).toString(36);
    for (var i = 0; i < fieldsData.length; i++) {
        if (fieldsData[i] && fieldsData[i].indexOf(boundary) > -1) {
            // generate new boundary and check all fields again
            boundary = parseInt(Math.random()*Math.pow(10, 16)).toString(36) + '' + parseInt(Math.random()*Math.pow(10, 16)).toString(36);
            i = 0;
        }
    }
    
    return boundary;
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

    var parts = url.split('?');
    var url = parts[0];
    var parameters = parts[1] ? parts[1].split('&') : [];
    for (var i = 0; i < parameters.length; i++) {
        parameters[i] = parameters[i].split('=');
    }
    
    var fieldsData = [fileData];
    for (var i = 0; i < parameters.length; i++) {
        fieldsData.push(parameter[i][1]);
    }
    
    var boundary = this.generateBoundary(fieldsData);

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
Content-Type: application/octet-stream\r\n\
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
