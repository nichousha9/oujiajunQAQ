function ojtKA(opt) {
    let dafaultData = {
        ih: 400,
    }
    Object.assign(dafaultData, opt);

    var xuan = document.getElementById(dafaultData.ele);//获取节点
    var btns = xuan.getElementsByTagName('input');//添加数组
    var bians = xuan.getElementsByClassName('bian');//添加数组


    for (var i = 0; i < btns.length; i++) {//循环找到按钮对应的数组
        btns[i].index = i; //绑定索引
        btns[i].onmouseover = function () {//给按钮添加绑定事件
            for (var i = 0; i < btns.length; i++) {
                //清空之前的样式
                btns[i].className = '';
                bians[i].style.display = 'none';
            }
            this.className = 'bai';//让按钮变成白色
            bians[this.index].style.display = 'block';//让按钮对应的盒子出现
        }
    }
}
