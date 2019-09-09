(function () {
    require(['config'], function () {
        require(['index', 'ku', 'lun', 'jq', 'xxk'], function () {
            //登录条
            $('#home_loginbar').load('loginbar.html');
            //头部搜索栏
            $('#home_head').load('head.html', () => {
                $('#home_head').css('height', '90px');
            });
            //固定栏
            $('#home_celan').load('guding.html');
            //尾部信息
            $('#home_footer').load('footer.html');
            //导航1
            $('#home_nav ul').on('click', 'li', () => {
                window.open('404.html')
            })

            //导航2
            $.ajax({
                type: "GET",
                //文件位置  
                url: "../api/1.json",
                dataType: "json",
                success: function (str) {
                    let html = str.map(function (item) {
                        return ` <li>${item.number}</li>`
                    }).join('')
                    $('.home_nav2').prepend(html);
                    for (let i = 0; i < $('.home_nav2 li').length; i++) {
                        $('.home_nav2 li')[i].style.background = 'url(' + '../img/nav/nav' + [i] + '.jpg' + ')';
                    }
                }
            });
            //滑动出现数据
            $('#home_main1 .home_nav2').on('mouseover', 'li', function () {
                $('#home_main1 .home_xq').show();
                let idx = $(this).index();
                $(this).attr('style', 'background: url("../img/nav/nav' + idx + "(" + idx + ")" + '.jpg")')
                $(this).css('color', 'red')
                $.ajax({
                    type: "GET",
                    url: "../api/1.json",
                    dataType: "json",
                    success: function (str) {
                        let num5 = '';
                        let html1 = '';
                        for (let i = 0; i < str[idx].num2.length; i++) {
                            html1 += `</dl><dl class="home_dlbox_dl"><dt><spen>${str[idx].num2[i]}</spen></dt>`
                            for (let j = 0; j < str[idx].num3[i].length; j++) {
                                html1 += `<dd>${str[idx].num3[i][j]}</dd>`
                            }
                            num5 = html1
                        };
                        let html2 = '<div class="home_img">'
                        let num6 = ''
                        for (let k = 0; k < str[idx].imgs.length; k++) {
                            num6 += `<img src="${str[idx].imgs[k]}" alt="">`
                        }
                        html2 += num6 + '</div>'
                        num5 += html2
                        $('.home_dlbox').html(num5);
                    }

                });
            });
            $('#home_main1 .home_nav2').on('mouseout', 'li', function () {
                let idx = $(this).index();
                $(this).attr('style', 'background: url("../img/nav/nav' + idx + '.jpg")')
                $(this).css('color', '#fff')
            });

            $('.home_xq').mouseout(function () {
                $('.home_xq').hide();
            })
            $('.home_nav2').mouseout(function () {
                $('.home_xq').hide();
            })
            $('.home_xq').mouseover(function () {
                $('.home_xq').show();
            })
            $('#lunbo').mouseover(function () {
                $('#lunbo .posibtn').show();
            });
            $('#lunbo').mouseout(function () {
                $('#lunbo .posibtn').hide();
            });
            $('#home_main1').on('click', 'dd', function () {
                window.open('alis.html?' + $(this).html());
            })

            carousel({
                ele: 'lunbo',
                iw: 732,
                ih: 452,
                imgdata: ['../lib/lunbo/img/lunbo1(1).jpg',
                    '../lib/lunbo/img/lunbo1(2).jpg',
                    '../lib/lunbo/img/lunbo1(3).jpg',
                    '../lib/lunbo/img/lunbo1(4).jpg',
                    '../lib/lunbo/img/lunbo1(5).jpg',
                    '../lib/lunbo/img/lunbo1(6).jpg',
                    '../lib/lunbo/img/lunbo1(7).jpg',
                    '../lib/lunbo/img/lunbo1(8).jpg',
                    '../lib/lunbo/img/lunbo1(9).jpg',
                    '../lib/lunbo/img/lunbo1(10).jpg'],
                time: 1,
            });


            //个人信息
            $('.home_message .top_zc').click(() => {
                window.open('enroll.html')
            });
            $('.home_message .top_dl').click(() => {
                window.open('login.html')
            });
            let num2 = localStorage.getItem('number');
            if (num2) {
                $('.home_message .top_1').hide();
                $('.home_message .top_2').hide();
                $('.home_message .top_3').show();
                $('.home_message .top_3 i').html(num2);
                $('.home_message .top_4').show();
            }
            $('.home_message .top_tc').click(() => {
                location.href = ('shouye.html');
                localStorage.removeItem('number');
            });
            ojtKA({
                ele: 'message_xxk',
            })

            // 倒计时
            let jieshu = '2019-9-7 15:00:00';
            function dingshi() {
                let date = new Date()
                let jieshu1 = Date.parse(jieshu);
                let shijiancha = jieshu1 - date;
                let secs = parseInt(shijiancha / 1000);
                let miao = secs % 60;
                let fen = parseInt(secs / 60) % 60;
                let shi = parseInt(secs / 60 / 60) % 24;
                let ri = parseInt(secs / 60 / 60 / 24);
                let str = '' + Zero(ri) + Zero(shi) + Zero(fen) + Zero(miao);
                let html = '';
                let num = 0;
                if (secs <= 0) {
                    clearInterval(time)
                    $('.xsg_djs img').attr('src', '../img/sj/0.png');
                } else {
                    for (var i in str) {
                        num++;
                        html += `<img src="../img/sj/${str[i]}.png" alt="">`;
                        if (num % 2 == 0) {
                            html += ' ';
                        }
                    }
                    $('.xsg_djs').html(html)
                }
            }
            dingshi()
            let time = setInterval(dingshi, 1000);
            carousel({
                ele: 'xsg_lunbo',
                iw: 1200,
                ih: 177,
                imgdata: ['../img/xsg1.jpg','../img/xsg2.jpg','../img/xsg1.jpg','../img/xsg2.jpg',],
                 time: 2,
            });
            let lunbo_tex = `   <div class="xsg_lunbo_text">
                                    <h3>采薇 花月樱雪 四季平衡养生</h3>
                                    <h4>已抢0件</h4>
                                    <p>
                                        <i>秒杀价</i>
                                        <span class="xianija">￥22.00</span>
                                        <span class="shijia">￥158.00</span>
                                    </p>
                                </div>`
            $('#xsg_lunbo li ').append(lunbo_tex);
     
            // 轮播图2
            $('#xsg_lunbo').mouseover(function () {
                $('#xsg_lunbo .posibtn').show();
            });
            $('#xsg_lunbo').mouseout(function () {
                $('#xsg_lunbo .posibtn').hide();
            });
            //分类渲染
            $.ajax({
                type: "GET",
                url: "../api/names.php",
                data: {
                    order: "SELECT * FROM zhuye"
                },
                success: str => {
                    let arr = JSON.parse(str);
                    let html = arr.map(function (item) {
                        return `
        <div class="home_nvzhuang">
            <div class="home_h2">
                <h2>${item.number}货源</h2>
                <span>更多好货</span>
            </div>
            <div class="nvzhuang_box">
                <div class="home_xxk">
                    <div class="home_xxk_2">
                        <div class="xxk_top">
                            <h5>新鲜抢批</h5>
                            <div class="xxk_btn">
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <ul class="xxk_bian">
                       
                      
                          </ul>
                    </div>
                </div>
                <ul class="nvzhuang_img">
                    <li><img src="${item.minimg1}" alt=""></li>
                    <li><img src="${item.minimg2}" alt=""></li>
                    <li><img src="${item.minimg3}" alt=""></li>
                    <li><img src="${item.minimg4}" alt=""></li>
                </ul>
                <div class="home_bigimg">
                    <img src="${item.bigimg}" alt="">
                    <ul class="home_fenlei">
                        <li>
                            <span>${item.fenlei1}</span>
                        </li>
                        <li>
                            <span>${item.fenlei2}</span>
                        </li>
                        <li>
                            <span>${item.fenlei3}</span>
                        </li>
                        <li>
                            <span>${item.fenlei4}</span>
                        </li>
                        <li>
                            <span>${item.fenlei5}</span>
                        </li>
                        <li>
                            <span>${item.fenlei6}</span>
                        </li>
                        <li>
                            <span>${item.fenlei7}</span>
                        </li>
                        <li>
                            <span>${item.fenlei8}</span>
                        </li>
                        <li>
                            <span>${item.fenlei9}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
       `}).join('');
                    $('#home_shangpin').html(html);
                }
            });
            $('#home_bottoms .box_lie').on('mouseover', 'li', function () {
                $(this).addClass('box_lie_li').siblings().removeClass('box_lie_li');
            });
            $.ajax({
                type: "GET",
                url: "../api/names.php",
                data: {
                    order: "SELECT * FROM spliebiao"
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
                                        <h6>${item.names}</h6>
                                        <p>${item.pic}</p>
                                        <i>已售${item.shou}</i>
                                    </dd>
                                </dl>
                            </li> `}).join('');
                    $('#home_shangpin .home_xxk_2 .xxk_bian').html(html);
                    $('#home_shangpin .home_xxk_2 .xxk_bian').on('click', 'li', function () {
                        window.open('alis.html');
                    });
                    carousel({
                        ele: 'box_left_lunbo',
                        iw: 377,
                        ih: 245,
                        imgdata: ['../lib/lunbo/img/lunbo1.jpg',
                            '../lib/lunbo/img/lunbo2.jpg',
                            '../lib/lunbo/img/lunbo3.jpg',
                            '../lib/lunbo/img/lunbo4.png',
                            '../lib/lunbo/img/lunbo5.jpg'],
                        time: 1,
                    });
                }
            });
        });
    });
})();
