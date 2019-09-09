//生成随机颜色
function Color(a) {
    var res = '';
    if (a == 16) {//判断是不是16进制
        var res = '#';//给16进制前加个井号
        var html = '123456789abcdef';//添加16进制数值
        for (var i = 0; i < 6; i++) {//循环生成六个不同的数
            var j = parseInt(Math.random() * (html.length));
            res += html[j];
        }
    } else if (a == 'rgb') {
        var r = parseInt(Math.random() * 256);
        var g = parseInt(Math.random() * 256);
        var b = parseInt(Math.random() * 256);
        var res = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }

    return res;
}

//生成随机验证码
function yanzheng(n) {
    var html = '';
    var num = '0987654321QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
    for (var i = 0; i < n; i++) {
        html += num[parseInt(Math.random() * num.length)];
    }
    //返回生成数字
    return html;
}

//阶乘
function jie(a) {//假如num = 5
    var sum = 1;//放置一个变量
    if (a <= 1) {//判断形参是否小于等于1
        return 1;//小于或等于1的时候将1返回到入口处
    }
    sum = a * jie(a - 1)//不小于1的时候 就 a*（a - 1）将结果放进sum
    return sum;//返回入口处
}

//任意范围的值
function renyi(min, max) {
    return parseInt(Math.random() * (max - min + 1)) + min;
}

//最大最小值并返回
function maxmin(num) {
    //num拿来装形参传过来的数组合成一个数组
    var html = '';
    //假设最大值跟最小值是第一个数的时候
    var max = num[0];
    var min = num[0];
    //假设最大值跟最小值位置是第一个数的时候
    var max1 = 0;
    var min1 = 0;
    //平均值
    var jun = 0;
    //
    var zong = 0;
    //假设第一个数是最大值那么第二个数就开始循环
    //循环到数值的最后一个值
    for (var i = 1; i < num.length; i++) {
        //最大值跟循环后的数组比较
        if (max < num[i]) {
            //发现另一个比前一个值大的时候新的值就代替上一个值
            max = num[i];
            //i是数组的长度自然也就等于索引
            max1 = i;
        } else if (min > num[i]) {
            min = num[i];
            min1 = i;
        }
        zong += num[i];
    }
    jun = (zong / num.length).toFixed(2);
    html = '最大值是：' + max + ' 最大值索引是：' + max1 + ' 最小值是：' + min + ' 最小值索引是：' + min1 + ' 平均值' + jun
    return html;
}

//找节点
function getid(id) {
    return document.getElementById(id);
}

//去掉重复数
function quchong(arr) {
    //生成一个空变量
    var num1 = "";
    //遍历数组的值
    for (var i = 0; i < arr.length; i++) {
        //找到下标值
        if (num1.indexOf(arr[i]) == -1) {
            //去掉重复数
            if (arr[i] == ',') {
                continue;
            }
            //去掉重复数后的数组
            num1 += arr[i];
        }
    }
    return num1
}

//去掉敏感字
function mingan(str) {
    var arr = ['操', 'fuck', '妈逼', '妈蛋', '傻逼', '你妈逼', '日你妈逼'];
    for (var i = 0; i < arr.length; i++) {
        var word = arr[i];
        var reg = new RegExp(word, 'ig');
        str = str.replace(reg, '**');
    }
    return str;
}

//参数转对象
function duixiang(str) {
    var obj = {};
    var arr = str.split('&');
    arr.forEach(function (item) {
        var arr2 = item.split('=');
        obj[arr2[0]] = arr2[1];
    });
    return obj;
}

//对象转参数
function canshu(obj) {
    var str = '';
    for (var key in obj) {
        str += key + '=' + obj[key] + '&';
    }
    return str.slice(0, -1);
}

//补零 
function Zero(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return '' + num;
    }
}

//换算
function nianyueri(num) {
    var shijian = new Date(num);
    var nian = shijian.getFullYear();
    var yue = shijian.getMonth() + 1;
    var ri = shijian.getDate();
    var shi = shijian.getHours();//时
    var fen = shijian.getMinutes();//分
    var miao = shijian.getSeconds();//秒 
    var num1 = nian + '-' + Zero(yue) + '-' + Zero(ri) + '-' + Zero(shi) + '-' + Zero(fen) + '-' + Zero(miao);
    return num1
}

//css
function css() {
    //判断进来的参数
    if (arguments.length == 2) {
        //如果进来2个的话就判断兼容             arguments[h1 , color]
        if (getComputedStyle(arguments[0], false)) {//getComputedStyle(h1, false).color
            //高级浏览器
            return getComputedStyle(arguments[0], false)[arguments[1]];
        } else {
            //IE8以下的浏览器
            return arguments[0].currentStyle[arguments[1]];//h1.currentStyle[color]
        }
        //如果进来3个的话就设置样式
    } else if (arguments.length == 3) {
        //  arguments[h1 , color, #fff]
        arguments[0].style[arguments[1]] = arguments[2];//h1.style.color = #fff;
    }
}

//正则验证
var checkReg = {
    //账号验证
    username: function (str) {
        var reg = /^[a-zA-Z]?[a-zA-Z0-9_]{4,15}$/;
        return reg.test(str);
    },
    //密码验证
    password: function (str) {
        var reg = /^[a-zA-Z]?\w{5,17}$/;
        return reg.test(str);
    },
    //确认密码验证
    confirm_pwd: function (str) {
        var reg = /^[a-zA-Z]?\w{5,17}$/;
        return reg.test(str);
    },
    //用户名验证
    nickname: function (str) {
        var reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
        return reg.test(str);
    },
    //昵称验证
    realkname: function (str) {
        var reg = /^[\u4e00-\u9fa5]{0,}$/;
        return reg.test(str);
    },
    //邮箱验证
    email: function (str) {
        var reg = /^[\w&%$#!\-]+@[\w&%$#!\-]+\.[a-zA-Z]+$/;
        return reg.test(str);
    },
    //身份证验证
    identity: function (str) {
        var reg = /^\d{15}|\d{18}$/;
        return reg.test(str);
    },
    //手机验证
    phone: function (str) {
        var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
        return reg.test(str);
    },
    //生日验证
    birthday: function (str) {
        var reg = /^\d{4}-\d{1,2}-\d{1,2}/;
        return reg.test(str);
    },
}

//                  表单验证

function checkInput(ele, reg, inf, meg) {
    /*
                参数一：ele 要正则验证的表单
                参数二：reg 正则不同
                参数三：inf 提示信息节点不同
                参数四：meg 提示信息不同,对象
    */

    ele.onblur = function () {
        //获取到输入框的内容去掉空格
        var val = ele.value.trim();
        var index = this.dataset.index;//用自定义属性的值作为开关对象的属性名
        //1.非空验证
        if (val) {
            //把获取到的消息丢进正则验证返回一个值装进变量
            var res = checkReg[reg](val);
            if (res) {
                //符合规则
                //返回通过的信息
                inf.innerHTML = meg.success;
                //信息添加颜色
                inf.style.color = '#58bc58';
                //开关为真
                ele.istrue = true;
            } else {
                //不符合规则
                //返回不通过消息
                inf.innerHTML = meg.failure;
                //提示信息为红色
                inf.style.color = 'red';
                //开关为假
                ele.istrue = false;
            }
        } else {
            //文本框为空的时候返回提示
            inf.innerHTML = meg.null;
            inf.style.color = 'red';
            //开关为假
            ele.istrue = false;
        }
    }
}

/*
	运动框架封装：startMove()过渡    jq animate()
	最终版：多对象，多属性，链式运动框架(运动队列)
	参数一：对象名
	参数二：属性，目标值  键名：属性名，键值：目标值    {'width':200,'heigth':400}  实现：宽度和高度一起改变，宽度变成200，高度变成400
	参数三：回调函数(可选参数)
 */

function startMove(obj, json, fnend) {

    clearInterval(obj.timer); //防止定时器叠加
    obj.timer = setInterval(function () {

        var istrue = true;

        //1.获取属性名，获取键名：属性名->初始值
        for (var key in json) { //key:键名   json[key] :键值
            //			console.log(key); //width heigth opacity
            var cur = 0; //存初始值

            if (key == 'opacity') { //初始值
                cur = css(obj, key) * 100; //透明度
            } else {
                cur = parseInt(css(obj, key)); // 300px  300  width heigth borderwidth px为单位的

            }

            //2.根据初始值和目标值，进行判断确定speed方向，变形：缓冲运动
            //距离越大，速度越大,下面的公式具备方向
            var speed = (json[key] - cur) / 6; //出现小数
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed); //不要小数部分，没有这句话或晃动

            //保证上一个属性全部都达到目标值了
            if (cur != json[key]) { //width 200 heigth 400
                istrue = false; //如果没有达到目标值，开关false
            } else {
                istrue = true; //true true
            }

            //3、运动
            if (key == 'opacity') {
                obj.style.opacity = (cur + speed) / 100; //0-1
                obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')'; //0-100
            } else {
                obj.style[key] = cur + speed + 'px'; //针对普通属性 left  top height 
            }

        }

        //4.回调函数:准备一个开关,确保以上json所有的属性都已经达到目标值,才能调用这个回调函数
        if (istrue) { //如果为true,证明以上属性都达到目标值了
            clearInterval(obj.timer);
            if (fnend) { //可选参数的由来
                fnend();
            }
        }

    }, 30); //obj.timer 每个对象都有自己定时器

}

//ajax的封装 get和post的操作

function ajax(opt) {
    //默认参数
    let defaultData = {
        data: '',
        asyn: true,
        failure: null
    }

    Object.assign(defaultData, opt);//用默认参数

    let xhr = new XMLHttpRequest();
    if (defaultData.type.toLowerCase() == 'get') {
        //get方式
        if (defaultData.data) {
            defaultData.data = canshu(defaultData.data);
            defaultData.url += '?' + defaultData.data;
        }
        xhr.open('get', defaultData.url, defaultData.asyn);
        xhr.send(null);
    } else if (defaultData.type.toLowerCase() == 'post') {
        //post方式
        xhr.open('post', defaultData.url, defaultData.asyn);
        xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        defaultData.data = canshu(defaultData.data);
        xhr.send(defaultData.data);
    }

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status == 200 || xhr.status == 304) {
                //成功了
                let data = xhr.responseText;
                defaultData.success(data);//实参
            } else {
                //失败
                if (defaultData.failure) {
                    //写了这个回调
                    defaultData.failure(xhr.status);
                }
            }
        }
    }
}


//Cookie的方法

//增加属性 修改属性

function setCookie(key, val, day) {
    let now = new Date();
    now.setDate(now.getDate() + day);
    document.cookie = key + '=' + val + ';expires=' + now.toUTCString() + ';path=/';
}

//获取属性
function getCookie(key) {
    let cookies = document.cookie;
    let arr = cookies.split('; ');
    for (let i = 0; 1 < arr.length; i++) {
        let arr2 = arr[i].split('=');
        if (key == arr2[0]) {
            return arr2[1];
        }
    }
}

//删除属性

function removeCookie(key) {
    setCookie(key, '', -1);
}
