(() => {
  require(["config"], function() {
    require(["alis", "ku", "jq", "fen"], function() {
      $("#alis_head").load("loginbar.html");
      $("#alis_logo").load("head.html");
      $("#alis_gu").load("guding.html");
      $("#alis_footer1").load("bottom.html");
      $("#alis_footer2").load("footer.html");
      $.ajax({
        type: "GET",
        url: "../api/fenlei.json",
        dataType: "json",
        success: function(str) {
          let html = str
            .map(function(item) {
              let html2 = "";
              for (let i = 0; i < item.alis.length; i++) {
                html2 += `<li>${item.alis[i]}</li>`;
              }
              return `
                        <dl>
                            <dt>${item.Class}:</dt>
                            <dd>
                                <a href="###">全部</a>
                                <ul class="fenlei">
                                    ${html2}
                                </ul>
                            </dd>
                        </dl>`;
            })
            .join("");
          $(".right_lei").append(html);
        }
      });
      $(".lei_btn").click(function() {
        if ($(this).html() == "更多选项...") {
          $(".right_lei").height(792);
          $(".lei_btn").html("收起");
        } else {
          $(".lei_btn").html("更多选项...");
          $(".right_lei").height(320);
        }
      });
      let ipage = 1;
      let sum = 8;
      function fen(ipage) {
        function xuan(arr) {
          let html = arr
            .map(function(item) {
              return `     <li data-id= ${item.cid}>
                    <img src=${item.imgs} class="big_img" >
               <div class="min_img">
                    <img src="${item.minimg1}">
                    <img src="${item.minimg2}">
                    <img src="${item.minimg3}">
                    <img src="${item.minimg4}">
                </div>
                <p>${item.names}</p>
                <h3>￥ ${item.pirce}</h3>
                <span>已有${item.pinglun}个人评论</span>
              </li>`;
            })
            .join("");
          $(".right_phone").html(html);
        }
        $.ajax({
          type: "GET",
          url: "../api/fen.php",
          data: {
            page: ipage,
            sum: sum
          },
          dataType: "json",
          success: function(str) {
            xuan(str.data);
          }
        });
      }
      fen();
      $("#page").paging({
        nowPage: ipage, // 当前页码
        pageNum: sum, // 总页码
        buttonNum: 6, //要展示的页码数量
        callback: function(num) {
          //回调函数
        }
      });
      $("#page").on("click", "ul .xl-prevPage", function() {
        ipage -= 1;
        fen(ipage);
      });
      $("#page").on("click", "ul .xl-nextPage", function() {
        ipage++;
        fen(ipage);
      });
      $("#page").on("click", "ul li", function() {
        let num = $(this).html();
        let num2 = $(this).html();
        if (num2 == "上一页" || num2 == "下一页" || num2 == "...") {
        } else {
          ipage = num;
          fen(ipage);
        }
      });
      $(".right_phone").on("mouseover", "li .min_img img", function() {
        $(this)
          .parent()
          .parent()
          .children(".big_img")
          .attr("src", $(this).attr("src"));
      });
      $(".right_phone").on("click", "li", function() {
        let num = $(this).attr('data-id')
          window.open('xq.html?data-id=' + num);
      });
    });
  });
})();
