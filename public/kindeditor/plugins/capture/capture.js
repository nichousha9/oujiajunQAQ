/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
var editor;
KindEditor.plugin('capture', function (K) {
    editor = this, name = 'capture';

    allowFileUpload = K.undef(this.allowFileUpload, true),
    formatUploadUrl = K.undef(this.formatUploadUrl, true),
    editor.plugin.capture = {
        captureFunc: function (e) {
            var captureRet = Capture(function(type, x, y, width, height, info, content, localpath){
                content = "data:image/jpeg;base64," + content;
                if (type < 0) {
                    showDownload();
                    return;
                }
                switch (type) {
                    case 1: {
                        if (!allowFileUpload){
                            alert("编辑器禁止上传图片,请与有关人员联系!");
                            return true;
                        }
                        sendfile(content, "image/jpeg",width,height);
                    }
                }
            });
            //从返回值来解析显示
            if (captureRet == emCaptureFailed) {
                showDownload();
            }
            else if (captureRet == emCaptureUnknown) {
                showDownload();
            }
        }
    };
    editor.clickToolbar(name, editor.plugin.capture.captureFunc);

    function sendfile(b, t,width,height) {
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        var isImg = t.indexOf("image/") === 0;
        var $Blob = getBlobBydataURI(b, t);
        formData.append("imgFile", $Blob,"untitled." + t.split('/')[1]);
        formData.append('dir', isImg ? 'image' : 'file');

        // data.append('imgFile', input.files[0])
        fetch(editor.uploadUrl() + "&paste=true", {
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then(function(response){
            return response.json()
        }).then(function(data){
            if (data.error) {
                if (typeof ($) !== "undefined" && $.messager && $.messager.alert) {
                    $.messager.alert('Error', data.message, 'warning');
                } else {
                    alert(data.message);
                }
            } else {
                if (formatUploadUrl) {
                    data.url =K.formatUrl(data.url, 'absolute');
                    var screenWidth = window.screen.width;
                    console.log(formatUploadUrl)
                    if(width<screenWidth/2){

                        editor.exec('insertimage', data.url, "from captured", width/1.5+"", height/1.5+"", undefined, undefined);
                    }else {
                        editor.exec('insertimage', data.url, "from captured", undefined, undefined, undefined, undefined);
                    }

                }
            }
        }).catch(function(ex){
            console.log(ex)
            alert('截屏失败')
        })
        return
        
        
        xhr.open('POST', editor.uploadUrl() + "&paste=true");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = K.trim(xhr.responseText);
                data =K.json(data);
                if (data.error) {
                    if (typeof ($) !== "undefined" && $.messager && $.messager.alert) {
                        $.messager.alert('Error', data.message, 'warning');
                    } else {
                        alert(data.message);
                    }
                } else {
                    if (formatUploadUrl) {
                        data.url =K.formatUrl(data.url, 'absolute');
                        var screenWidth = window.screen.width;
                        console.log(formatUploadUrl)
                        if(width<screenWidth/2){

                            editor.exec('insertimage', data.url, "from captured", width/1.5+"", height/1.5+"", undefined, undefined);
                        }else {
                            editor.exec('insertimage', data.url, "from captured", undefined, undefined, undefined, undefined);
                        }

                    }
                }
            }
        }
        xhr.send(formData);
    }
});

function getBlobBydataURI(dataURI, type) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: type});
}