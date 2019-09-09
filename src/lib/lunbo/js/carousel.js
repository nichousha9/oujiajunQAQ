function carousel(opt) {

    //默认参数
    let dafaultData = {
        //li盒子的宽度
        iw: 500,
        //li盒子的高度
        ih: 300,
        //定时器的执行时间
        time: 2
    }
    //使用用默认参数
    Object.assign(dafaultData, opt);

    //1.找节点

    //最外层盒子
    let box = document.getElementById(dafaultData.ele);
    //box下面的ul切换图片
    let list = box.getElementsByClassName('imglist')[0];
    //box下面的spen用来做焦点
    let light = box.getElementsByClassName('light')[0];
    //box下面的左按钮
    let prevBtn = box.getElementsByClassName('prev')[0];
    //box下面的右按钮
    let nextBtn = box.getElementsByClassName('next')[0];
    //box下面的按钮盒子
    let posibtn = box.getElementsByClassName('posibtn')[0];
    //定时器
    let timer = null;
    //可视区图片的下标
    let num = 0;
    //图片的路径
    let data = dafaultData.imgdata;
    //定时器的时间
    let time = dafaultData.time * 1000;

    //2.宽高设置
    //给li跟box添加行内样式的宽高 宽高的参数在html里设置也可以使用dafaultData对象里的默认宽高
    list.style = box.style = `width:${dafaultData.iw}px;height:${dafaultData.ih}px`;
    //给左右按钮盒子设置宽度 宽度等于对象里的iw参数
    posibtn.style.width = light.style.width = dafaultData.iw + 'px';

    //3.渲染数据到li节点
    //查找对象里面的图片路劲拼接成数组
    let arr = data.map(item => {
        //运用字符串模板拼接
        return `<li style="width:${dafaultData.iw}px;height:${dafaultData.ih}px;"><img src="${item}" alt=""></li>`;
        //用join将数组转成字符串
    }).join('');
    //渲染到list下面的子节点ul里面
    list.children[0].innerHTML = arr;
    // console.log(list.children[0])
    //找到list下面的li节点
    let imglist = list.getElementsByTagName('li');
    //用一个变量存放li节点的宽度
    let iw = imglist[0].offsetWidth;

    //4.开始制作轮播图特效
    //-1.用for on循环遍历imglist
    for (let ele of imglist) {
        //把每一个li节点向右挪一个iw的距离
        ele.style.left = iw + 'px'
    }
    //接着让其中一个li留在ul的可视区内
    imglist[0].style.left = 0;

    //-2.开启计时器让图片切换
    timer = setInterval(next, time);

    //-3.图片切换
    function next() {
        //--1.当前可视区窗口的图片往左移动
        startMove(imglist[num], { 'left': -iw });
        //--2.num每被执行一次就+1,当num执行到大于imglist的长度的时候num就等于0
        num = ++num > imglist.length - 1 ? 0 : num;
        //--3.让图片一直在可视区的右侧待命
        imglist[num].style.left = iw + 'px';
        //--4.让右侧待命的图进图可视区
        startMove(imglist[num], { 'left': 0 });
        //--5让焦点跟随
        focus()
    }
    function prev() {
        //--1.当前可视区窗口的图片往右移动
        startMove(imglist[num], { 'left': iw });
        //--2.num每被执行一次就-1,当num执行到小于imglist的长度的时候num就等于imglist的长度
        num = --num < 0 ? imglist.length - 1 : num;
        //--3.让图片一直在可视区的左侧待命
        imglist[num].style.left = -iw + 'px';
        //--4.让左侧待命的图进图可视区
        startMove(imglist[num], { 'left': 0 });
        //--5.让焦点跟随
        focus()
    }

    //5.添加事件
    //(1)当鼠标移入最外层的盒子的时候定时器停止
    box.onmouseover = () => {
        clearInterval(timer);
    }
    //(2)当鼠标移出的时候定时器开始
    box.onmouseout = () => {
        //先停止计时器在开启 否则定时器会叠加执行
        clearInterval(timer);
        timer = setInterval(next, time);
    }
    //(3)当鼠标点击到左侧按钮时就切换到上一张
    prevBtn.onclick = () => {
        prev()
    }
    //(4)当鼠标点击到右侧按钮时就切换到下一张
    nextBtn.onclick = () => {
        next()
    }

    //焦点切换
    //1.设置一个空变量拿来拼接字符串
    let html = '';
    //2.遍历一下imglist的长度 因为有多少张图片就有多少个焦点
    for (let i = 0; i < imglist.length; i++) {
        //拼接spen节点
        html += `<span>${i + 1}</span>`
    }
    //将拼接好的字符串渲染到p标签里面
    light.innerHTML = html;
    //给p节点下面的子节点添加高亮显示
    light.children[0].className = 'active'

    //3.焦点跟着图片一起改变
    function focus() {
        //排他
        for (let i = 0; i < imglist.length; i++) {
            light.children[i].className = '';
        }
        //跟随着图片的num改变span的高亮
        light.children[num].className = 'active'
    }
    //4.用事件委托给spen绑定点击事件
    light.onclick = ev => {
        //利用target找到SPAN 转成小写
        if (ev.target.tagName.toLowerCase() == 'span') {
            //点击ev.target拿到内容
            let index = ev.target.innerHTML - 1;
            //当内容大于下标的时候
            if (index > num) {
                //图片在右边待命
                startMove(imglist[num], { 'left': -iw });
                imglist[index].style.left = iw + 'px'
                //从右边进入可视区
                startMove(imglist[index], { 'left': 0 });
            }
            //当内容小于num的时候
            if (index < num) {
                //图片在左边待命
                startMove(imglist[num], { 'left': iw });
                imglist[index].style.left = -iw + 'px';
                //从左边进入可视区
                startMove(imglist[index], { 'left': 0 });
            }
            num = index;
            focus()
        }
    }
}
