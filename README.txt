This javascript library extension is based on `jx` (http://www.openjs.com/scripts/jx/) and allows a large set of binary data to be send as a file.
Usually the cheap host providers are limiting the size of a request to few megabytes, so if you need to send a blob via ajax post request you could just "simulate" sending a file.

Currently you need to send your data encoded in base64, because of some text encoding/decoding problems. I will try to fix this soon.

For example you can use it in combination with html5's canvas.toDataURL (http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl) which will return base64 encoded image.
