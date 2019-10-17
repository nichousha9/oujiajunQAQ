(() => {
  require(["config"], function() {
    require(["xq", "ku", "jq", "fang"], function() {
      //模块导入
      $("#xq_login").load("loginbar.html");
      $("#xq_logo").load("head.html");
      $("#xq_guding").load("guding.html");
      $("#xq_footer1").load("bottom.html");
      $("#xq_footer2").load("footer.html");
      let data = decodeURI(location.search.slice(1));
      let id = data.split("=")[1];
        function xuan(arr){
            let html = arr.map(function (item) {
                return `
                <div class="main_fang">
        <div id="box">
          <div class="bigimg"></div>
          <div class="imgs">
            <div class="zhuai"></div>
          </div>
          <div class="box3">
            <ul class="samllimg"></ul>
          </div>
          <div class="lefts"></div>
          <div class="rights"></div>
        </div>
      </div>
      <div class="main_can">
        <h2>${item.names}</h2>
        <ul class="canshu">
          <li>
            <span>丫丫价 :</span>
            <i class="pirce">${item.pirce}</i>
            <em>[价格走势]</em>
            <em>[降价通知]</em>
          </li>
          <li>
            <span>促销信息 :</span>
            <em
              >专享800元换新补贴，携带任意价值旧机均可参与，不与免息分期、赠品及其它优惠叠加</em
            >
            <a href="###">点击详情</a>
          </li>
          <li class="ping">
            <ul>
              <li>
                <h5>用户评论</h5>
                <h6>${item.pinglun}</h6>
              </li>
              <li>
                <h5>用户质询</h5>
                <h6>0</h6>
              </li>
              <li>
                <h5>好评率</h5>
                <h6>0%</h6>
              </li>
            </ul>
          </li>
        </ul>
        <h3>
          <span>配置信息 :</span>
          <i>充电器x1，数据线x1，保护壳x1，耳机x1，笔尖x2（内置4300mAh电池）</i>
        </h3>
        <h3>
          <span>库存 :</span>
          <i>${item.kucun}</i>
        </h3>
        <h3>
          <span><b>容</b><b>量</b>:</span>
          <em class="cut">12GB+256GB</em>
        </h3>
        <h3>
          <span><b>套</b><b>餐</b>:</span>
          <em class="cut">官方标配</em>
          <em>推荐套餐</em>
        </h3>
        <div class="main_btn">
          <span class="gwc">加入购物车</span>
          <span class="lj">立即购买</span>
        </div>
      </div>
                `
            }).join('');
            $('#xq_main').html(html);
            $('#xq_renqi .renqi_left img').attr('src', arr[0].imgs);
            $('#xq_renqi .renqi_left dd').html(arr[0].names);
            $('.main_btn .gwc').click(function () {
               xiadan()
            })
            $('.main_btn .lj').click(function () {
                xiadan()
                window.open('gwc.html')
            })
        }
        function xiadan() {
            let imgs = $('#box .box3 .samllimg li:eq(0) img').attr('src')
            let name = $('.main_can h2').html();
            let pirce = $('.main_can .pirce').html();
            let quantity = 1;
            let uid = getCookie('uid');
            $.ajax({
                type: 'get',
                url: '../api/login.php',
                data: {
                    names: name, 
                    quantity: quantity,
                    pirce: pirce,
                    oid: id,
                    imgs: imgs,
                    yid: uid,
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
        }
        $.ajax({
            type: 'get',
            url: '../api/login.php',
            data: {
                id: id,
                num: '5',
            },
            dataType: "json",
            success: str => {
                xuan(str);
                fangdajing({
                    ele: 'box',//最外层盒子的id(必填)
                    imglist: [str[0].imgs,str[0].minimg1, str[0].minimg2, str[0].minimg3, str[0].minimg4],
                    scal: 2,
                    speed: 1,
                    Width: 80,
                    BoPa: 8
                });
            }
        });
        $('.renqi_right').on('click', 'li', function () {
            $(this).addClass('cur2').siblings().removeClass("cur2");
            let idx = $(this).index()
            $('.renqi_main .renqi_1').eq(idx).addClass('cur3').siblings().removeClass("cur3");
        });
        $('.xq_right .right_top').on('click', 'span', function () {
            $(this).addClass('acitve').siblings().removeClass("acitve");
            let idx = $(this).index();
            $('.xq_right .canshu_main').eq(idx).addClass('cur4').siblings().removeClass("cur4");
        })
    });
  });
})();
