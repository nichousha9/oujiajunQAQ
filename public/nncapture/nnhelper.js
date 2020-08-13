/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/
var captureObj = null;
var downloadUrl = 'http://www.ggniu.cn/download/CaptureInstall.exe?';
var captureDone = null;
function Init() {
    if (isMacintosh()) {
        downloadUrl = 'http://www.ggniu.cn/download/CaptureInstall.dmg?';
    }
    captureObj = new NiuniuCaptureObject();
    captureObj.NiuniuAuthKey = "niuniu";
    //此处可以设置相关参数
    captureObj.TrackColor = rgb2value(255, 0, 0);
    captureObj.EditBorderColor = rgb2value(0, 0, 255);

    //设置控件加载完成以及截图完成的回调函数
    captureObj.FinishedCallback = OnCaptureFinishedCallback;
    captureObj.PluginLoadedCallback = PluginLoadedCallback;
    captureObj.VersionCallback = VersionCallback;
    //初始化控件
    captureObj.InitNiuniuCapture();
}
/*
 用于初始化牛牛截图控件，此函数需要在页面加载完成后立即调用
 在此函数中，您可以设置相关的截图的UI控制，如，画笔大小、边框颜色等等 【这部分信息在niuniucapture.js中也有默认值，直接修改默认值也可 】
 */
function Capture(doWhenfinish) {
    var defaultName = "1.jpg"; //此处为了防止上传的数据过大，建议使用JPG格式
    var hideFlag = 0;
    var captureRet = true;
    captureDone = doWhenfinish;
    return captureObj.DoCapture("1.jpg", hideFlag, 0, 0, 0, 0, 0);
}

function showDownload() {
    var con;
    con = confirm("请先下载安装截图插件,如果您已经安装，请点击取消重试一遍"); //在页面上弹出对话框
    if (con == true) {
        window.location.href = downloadUrl;
    } else {
    }
}

function OnCaptureFinishedCallback(type, x, y, width, height, info, content, localpath) {
    if (type < 0) {
        showDownload();
        return;
    }
    switch (type) {
        case 1: {
            if(captureDone!=null){
                captureDone(type, x, y, width, height, info, content, localpath);
            }
        }
    }
}

function PluginLoadedCallback(success) {

}
//用于返回控件的版本号
function VersionCallback(ver) {

}
