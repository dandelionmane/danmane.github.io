var div = d3.select("div");

function textAppender(selection, text) {
    var textbox = null;
    var counter = 0;
    return function () {
        counter++;
        if (textbox == null) {
            textbox = selection.append("div");
        }
        textbox.text(text + ":" + counter);
    }
}

function addListener(type) {
    div.on(type, textAppender(div, type));
}

var eventTypes =
['abort',
'afterprint',
'beforeprint',
'beforeunload',
'blur',
'canplay',
'canplaythrough',
'change',
'click',
'contextmenu',
'copy',
'cuechange',
'cut',
'dblclick',
'DOMContentLoaded',
'drag',
'dragend',
'dragenter',
'dragleave',
'dragover',
'dragstart',
'drop',
'durationchange',
'emptied',
'ended',
'error',
'focus',
'focusin',
'focusout',
'formchange',
'forminput',
'hashchange',
'input',
'invalid',
'keydown',
'keypress',
'keyup',
'load',
'loadeddata',
'loadedmetadata',
'loadstart',
'message',
'mousedown',
'mouseenter',
'mouseleave',
'mousemove',
'mouseout',
'mouseover',
'mouseup',
'mousewheel',
'offline',
'online',
'pagehide',
'pageshow',
'paste',
'pause',
'play',
'playing',
'popstate',
'progress',
'ratechange',
'readystatechange',
'redo',
'reset',
'resize',
'scroll',
'seeked',
'seeking',
'select',
'show',
'stalled',
'storage',
'submit',
'suspend',
'timeupdate',
'undo',
'unload',
'volumechange',
'waiting']

eventTypes.forEach(addListener);