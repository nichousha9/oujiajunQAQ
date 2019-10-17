(() => {
  require(["config"], () => {
    require(["shouye", "ku", "jq", "lun", "nav"], () => {
      //模块导入
      $("#head").load("loginbar.html");
      $("#shou_gu").load("guding.html");
      $("#bottom").load("bottom.html");
      $("#footer").load("footer.html");
      $("#shou_nav").load("nav.html");
      $("#jiyou").load("biao.html");
      //轮播图
      let Carousel1 = new Carousel({
        ele: "shou_lun",
        iw: 760,
        ih: 480,
        imgdata: [
          "https://img2.yaya.cn//pic/edt/ad/20191011/20191011200340_1990.jpg",
          "https://img2.yaya.cn//pic/edt/ad/20191008/20191008175335_4143.jpg",
          "https://img2.yaya.cn//pic/edt/ad/20190923/20190923085946_0179.jpg",
          "https://img2.yaya.cn//pic/edt/ad/20191010/20191010140704_9181.jpg",
          "https://img2.yaya.cn//pic/edt/ad/20190902/20190902091604_1838.jpg",
          "https://img2.yaya.cn//pic/edt/ad/20191010/20191010183243_2005.jpg"
        ],
        time: 2
      });
      Carousel1.init();
      $(".header-cart-a span").html(getCookie('gwc'));
      //信息栏
      $(".header-cart-a").click(function() {
        let num = getCookie("number");
        if (num == "") {
          alert("请先登录账号");
        } else {
          location.href = "gwc.html";
        }
      });

      let name = getCookie("number");
      if (name !== "") {
        $("#shou_xin .dl").html(name + "欢迎回来");
        $("#shou_xin .zc").html('退出')
      }
      $("#shou_xin .dl").click(function () {
        if ($(this).html() == '登录') {
          location.href = "login.html";
        }
      });
      $("#shou_xin .zc").click(function() {
        if ($(this).html() == '退出') {
          location.href = "shouye.html";
          setCookie("number", "", 7);
          setCookie("passw", "", 7);
        } else {
          location.href = "enroll.html"
        }
      });
      $(".xin_tese").on("mouseover", "ul li", function() {
        $(this)
          .addClass("cur1")
          .siblings()
          .removeClass("cur1");
      });
      $(".xin_tese").on("mouseout", "li", function() {
        $(".xin_tese ul li").removeClass("cur1");
      });
      //楼层渲染
      $.ajax({
        type: "GET",
        url: "../api/index.json",
        dataType: "json",
        success: function(str) {
          let html = str
            .map(function(item) {
              let html2 = "";
              for (let i = 0; i < item.alis.length; i++) {
                html2 += `<span>${item.alis[i]}</span>`;
              }
              let html3 = "";
              for (let i = 0; i < item.Fname.length; i++) {
                html3 += `<span>${item.Fname[i]}</span>`;
              }
              let html4 = "";
              for (let i = 0; i < item.list.length; i++) {
                html4 += `
              <li>
                <div class="cen_top">
                <h3 style="color:${item.color}">${item.list[i].name}</h3>
                <p>${item.list[i].dianjia}</p>
                <i style="color:${item.color}">${item.list[i].price}</i>
                        </div>
                <img src="${item.list[i].imgs}">
              </li>`;
              }
              let html5 = "";
              for (let i = 0; i < item.minlist.length; i++) {
                html5 += `
              <dl>
                  <dt>
                      <h3 style="color:${item.color}">${item.minlist[i].name}</h3>
                      <p>${item.minlist[i].dianjia}</p>
                  </dt>
                  <dd>
                     <img src="${item.minlist[i].imgs}">
                  </dd>
              </dl>`;
              }
              return `<li class="shou_ele_lou">
            <img class="louceng" src="${item.Fnum}">
           <div class="ele_main">
               <div class="main_left">
                        <img src="${item.imgs}">
                        <div class="diy-tip">
                            <h3 style="color:${item.color}">${item.Hname}</h3>
                            <p>${item.dianjia}</p>
                        </div>
                    <div class="bottomAD" style="background:${item.color}">
                        <a href="###" style="background:${item.color}">${item.name}</a>
                        <dl>
                            <dt>热销榜</dt>
                            <dd>
                                ${html3}
                            </dd>
                        </dl>
                    </div>
                </div>
                <ul class="main_cen">
                    ${html4}
                </ul>
                <div class="main_right">
                     ${html5}
                </div>
           </div>
            <div class="shou_bottom_nav" style="background:${item.color}">
                <i>品质保证</i>
              ${html2}
            </div>
        </li>
            `;
            })
            .join("");
          $("#shou_ele").html(html);
          $("#shou_ele").on("click", ".shou_ele_lou .main_cen li", function() {
            location.href = "alis.html";
          });
        }
      });
      //跳楼
      $(".diy-elevator").on("click", "a", function() {
        let ih = $("#shou_ele .shou_ele_lou").height();
        let idx = $(this).index() - 1;
        if ($(this).html() == "返回顶部") {
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, idx * ih + $("#shou_ele").offset().top);
          $(this)
            .addClass("active")
            .siblings()
            .removeClass("active");
        }
      });
      window.onscroll = function() {
        if (window.scrollY > 500) {
          $(".diy-elevator").show();
        } else {
          $(".diy-elevator").hide();
        }
        for (let i = 1; i < $("#shou_ele .shou_ele_lou").length; i++) {
          if (window.scrollY >= $("#shou_ele .shou_ele_lou")[i].offsetTop) {
            $(".diy-elevator a")
              .eq(i + 1)
              .addClass("active")
              .siblings()
              .removeClass("active");
          }
        }
      };
      //加载更多
      $(".geng h6").click(() => {
        $(".geng h6").hide();
        $(".shou_ul").css("height", "960px");
      });
    });
  });
})();
