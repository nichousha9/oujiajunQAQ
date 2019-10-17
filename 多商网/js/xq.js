(function () {
    require(['config'], function () {
        require(['xq', 'ku', 'jq', 'fang'], function () {
            $('#xq_head').load('loginbar.html');
            $('#xq_logo').load('head.html', () => {
                $('#xq_logo').css('height', '90px');
                $('#head .inp_search .inp_btn').click(() => {
                    let num = $('#head .inp_search .inp_chaxun').val();
                    location.href = 'alis.html?' + num;
                });
            });
            $('#xq_nav').load('nav.html');
            $('#xq_guding').load('guding.html');
            $('#xq_footer').load('footer.html');
            let data = decodeURI(location.search.slice(1));
            let id = data.split('=')[1];
            function xuan(arr) {
                let html = arr.map(function (item) {
                    return `
                        <h1>${item.names}</h1>
        <p>2019春节放假时间：1.20—2.13 新疆全部地区停发，近期更换合作快递，汇通韵达停发，目前只发圆通。请各位分销知悉。如有变动会再通知！</p>
        <div class="main_tao">
            <h2>
                <img src="../img/pfdximg.jpg" alt="">
                <span>支持淘宝店快速上架和一件代发货</span>
            </h2>
            <h2 style="margin-left: 20px">
                <img src="../img/pfdximgc.jpg" alt="">
                <span>支持多件商品批发采购</span>
            </h2>
        </div>
        <div class="xq_fangdajing">
            <div id="box">
                <div class="bigimg">
                    <!-- <img src="/img/主板plus1.jpg" alt=""> -->
                </div>
                <div class="imgs">
                    <!-- <img src="/img/主板plus1.jpg" alt="">
                        <div class="zhuai"></div> -->
                </div>
                <div class="box3">

                    <ul class="samllimg">
                        <!-- <img src="/img/主板plus1.jpg" alt="">
                            <img src="/img/主板plus2.jpg" alt="">
                            <img src="/img/主板plus3.jpg" alt="">
                            <img src="/img/主板plus4.jpg" alt="">
                            <img src="/img/主板plus5.jpg" alt=""> -->
                    </ul>
                </div>
                <div class="lefts"></div>
                <div class="rights"></div>
            </div>
            <div class="xq_xinxi">
                <div class="xq_yun">
                    <em>运费</em>
                    <div class="yun_1">
                        <p>编辑</p>
                        <span>≥1件</span>
                        <span class="jiage">￥${item.price}</span>
                        <i>分销价</i>
                    </div>
                </div>
                <div class="xq_xiangqing">
                    <div class="xq_main_1">
                        <div class="baokuan">
                            <i>爆款指数:</i>
                            <img src="../img/xqy_10.jpg" alt="">
                            <h4>
                                <span>${item.sales}</span>
                                <i>件成交</i>
                            </h4> 
                        </div>
                        <p>
                            <i>建议零售价</i>
                            <span>￥${item.price}</span>
                        </p>
                        <p>
                            <i>货号</i>
                            <i>1321321321</i>
                            <b>复制</b>
                        </p>
                        <p>
                            <i>店家：</i>
                            <i>${item.dianjia}</i>
                        </p>
                        <p>已上活动场次：13次</p>
                        <input type="button" value="淘宝报名登记处">
                    </div>
                    <div class="xq_main_2">
                        <span>上架淘宝店</span>
                        <span>加入购物篮</span>
                        <span>数据包下来</span>
                    </div>
                    <div class="xq_main_3">
                        <span class="gaoliang">${item.color}</span>
                        <span>${item.color2}</span>
                        <span>${item.color3}</span>
                        <div class="jiajian">
                            <em>${item.cheng}</em><b>件可售</b>
                            <i>${item.price}</i>
                            <div class="xq_main_3_jia">
                                <h5 class="jian">-</h5>
                                <input type="text" value="0" class="shu">
                                <h5 class="jia">+</h5>
                            </div>  
                        </div>
                    </div>
                    <div class="xq_main_4">
                        <div class="main_4color">
                            <span>蓝色</span>
                            <span>(1)件</span>
                            <p>(1)</p>
                        </div>
                    </div>
                    <div class="xq_main_5">
                        <p>
                            共<span>0</span>件，总共￥<i>0.00</i>元<a href="###">批量下单</a>
                        </p>
                        <div class="xq_main_5_btn">
                            <h4 class="xiadian">立即下单</h4>
                            <h4 class="jinhuo">加入购物车</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div> ` }).join('')
                $('#xq_main').html(html);
            }
            $.ajax({
                type: 'get',
                url: '../api/login.php',
                data: {
                    id: id,
                    num: '5',
                },
                success: str => {
                    let arr = JSON.parse(str);
                    xuan(arr);
                    fangdajing({
                        ele: 'box',//最外层盒子的id(必填)
                        imglist: [arr[0].minimg1, arr[0].minimg2, arr[0].minimg3, arr[0].minimg4, arr[0].minimg5],
                        scal: 2,
                        speed: 1,
                        Width: 80,
                        BoPa: 8
                    });
                }
            });
            let num = '黑色'
            $('#xq_main').on('click', '.xq_main_3 span', function () {
                $(this).addClass('gaoliang').siblings().removeClass('gaoliang');
                num = $(this).html();
            })
            let icu = 0;
            let sum = 0;
            function bian(name) {
                $('#xq_main .xq_main_4 span').eq(0).html(num)
                $('#xq_main .xq_main_4 span').eq(1).html(name + '件')
                $('#xq_main .xq_main_4 p').html(name)
                $('#xq_main .xq_main_5 span').html(name);
                let pic = $('#xq_main .xq_main_3 .jiajian i').html();
                $('#xq_main .xq_main_5 i').html((name * pic).toFixed(2));
            }
            $('#xq_main').on('click', '.xq_main_3_jia .jia', function () {
                sum = $('#xq_main .xq_main_3 .jiajian em').html() * 1
                icu++
                if (icu > sum) {
                    icu = sum;
                    $('#xq_main .xq_main_5 span').html(icu);
                } else {
                    shi = $('#xq_main .shu').val(icu);
                    $('#xq_main .xq_main_4').show();
                    bian(icu)
                }
                $('#xq_main .shu').val(icu);
            })
            $('#xq_main').on('click', '.xq_main_3_jia .jian', function () {
                icu--
                if (icu <= 0) {
                    icu = 0;
                    $('#xq_main .xq_main_4').hide();
                    $('#xq_main .xq_main_5 span').html(icu);
                    $('#xq_main .xq_main_5 i').html(0.00);
                } else {
                    $('#xq_main .xq_main_4').show();
                    bian(icu)
                }
                $('#xq_main .shu').val(icu);
            })
            $('#xq_main').on('focus', ' .xq_main_3_jia .shu', function () {
                $('#xq_main .shu').val('');
            })
            $('#xq_main').on('input', ' .xq_main_3_jia .shu', function () {
                let sie = $('#xq_main .shu').val();
                sum = $('#xq_main .xq_main_3 .jiajian em').html() * 1
                if (sie > sum) {
                    sie = sum;
                    $('#xq_main .shu').val(sie);
                    bian(sie)
                    icu = sie
                } else if (sie < 0 || sie == '') {
                    sie = 0
                    $('#xq_main .xq_main_4').hide();
                    $('#xq_main .xq_main_5 span').html(sie);
                    $('#xq_main .xq_main_5 i').html(0.00);
                } else {
                    $('#xq_main .xq_main_4').show();
                    bian(sie)
                    icu = sie
                }
            })
            $('#xq_main').on('blur', ' .xq_main_3_jia .shu', function () {
                if ($('#xq_main .shu').val() == '') {
                    $('#xq_main .shu').val(0)
                }
                if ($('#xq_main .shu').val() == 0) {
                    $('#xq_main .xq_main_4').hide();
                    $('#xq_main .xq_main_5 span').html(0);
                    $('#xq_main .xq_main_5 i').html(0.00);
                }
            })
            window.onscroll = function () {
                if (window.scrollY > 1195) {
                    $('#xq_can .xq_xxk').addClass('xq_gu');
                    $('#xq_can .xq_xxk .xxk_right').css('display', 'block');
                } else {
                    $('#xq_can .xq_xxk').removeClass('xq_gu');
                    $('#xq_can .xq_xxk .xxk_right').css('display', 'none');
                }
            };
            $('#xq_can .xq_xxk .xxk_left').on('click', 'span', function () {
                $(this).addClass('biankuang').siblings().removeClass('biankuang');
                window.scrollTo(0, 1200);
                let num = $(this).index();
                $('#xq_can .xq_neirong .xq_bian').eq(num).css('display', 'block').siblings().css('display', 'none')
            });
            let fid = getCookie('gid');
            let names = fid.split('&');
            for (let i = 0; i < names.length; i++) {
                $.ajax({
                    type: 'get',
                    url: '../api/login.php',
                    data: {
                        id: names[i],
                        num: '5',
                    },
                    success: str => {
                        let arr = JSON.parse(str);
                        let html = arr.map(function (item) {
                            return `
                            <li>
                                <dl>
                                    <dt>
                                        <img src="${item.imgs}" alt="">
                                    </dt>
                                    <dd>
                                        <p>${item.names}</p>
                                        <i>￥${item.price}</i>
                                    </dd>
                                </dl>
                            </li>
                            `
                        }).join('');
                        $('#xq_can .home_xxk_2:eq(2) .xxk_bian').append(html)
                    }
                });
            }


            $('#xq_main').on('click', '.xq_main_5_btn .xiadian', function () {
                let quantity = $('#xq_main .xq_main_5 span').html();//个数
                let total = $('#xq_main .xq_main_5 i').html();//总价
                let name = $('#xq_main h1').html();//名字
                let imgs = $('#xq_main #box .imgs img').attr('src');//图片
                let unit = $('#xq_main .xq_main_3 .jiajian i').html();//单价
                let dian = $('#xq_main .xq_fangdajing  .xq_main_1 p:eq(2) i').eq(1).html();//店家
                let ku = $('#xq_main  .xq_xiangqing .xq_main_3 .jiajian em').html()//库存
                let yid = $('#loginbar .logintop .dl').data('uid');//用户名id
                if (quantity != '0' || total !== '0.00') {
                    $.ajax({
                        type: 'get',
                        url: '../api/login.php',
                        data: {
                            names: name,
                            unit: unit,
                            total: total,
                            quantity: quantity,
                            color: num,
                            imgs: imgs,
                            oid: id,
                            dian: dian,
                            ku: ku,
                            yid:yid,
                            num: '6',
                        },
                        success: str => {
                            if (str == 'yes') {
                                location.href = ('gwc.html');
                            } else {
                                alert('加入失败')
                            }
                        }
                    })
                } else {
                    alert('请先选择规格与个数')
                }
            });
            $('#xq_main').on('click', '.xq_main_5_btn .jinhuo', function () {
                let quantity = $('#xq_main .xq_main_5 span').html();//个数
                let total = $('#xq_main .xq_main_5 i').html();//总价
                let name = $('#xq_main h1').html();//名字
                let imgs = $('#xq_main #box .imgs img').attr('src');//图片
                let unit = $('#xq_main .xq_main_3 .jiajian i').html();//单价
                let dian = $('#xq_main .xq_fangdajing  .xq_main_1 p:eq(2) i').eq(1).html();//店家
                let ku = $('#xq_main  .xq_xiangqing .xq_main_3 .jiajian em').html()//库存
                let yid = $('#loginbar .logintop .dl').data('uid');//用户名id
                if (quantity != '0' || total !== '0.00') {
                    $.ajax({
                        type: 'get',
                        url: '../api/login.php',
                        data: {
                            names: name,
                            unit: unit,
                            total: total,
                            quantity: quantity,
                            color: num,
                            oid: id,
                            dian: dian,
                            imgs: imgs,
                            ku: ku,
                            yid:yid,
                            num: '6',
                        },
                        success: str => {
                            if (str == 'yes') {
                                alert('商品已放入购物车')
                            } else {
                                alert('加入失败')
                            }
                        }
                    })
                } else {
                    alert('请先选择规格与个数')
                }
            });

        })
    })
})();
