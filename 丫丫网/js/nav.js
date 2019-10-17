(function() {
  //导航
  $.ajax({
    type: "GET",
    //文件位置
    url: "../api/1.json",
    dataType: "json",
    success: function(str) {
      let html = str
        .map(function(item) {
          let html2 = "";
          for (let i = 0; i < item.num1.length; i++) {
            html2 += `<a href="">${item.num1[i]}</a>`;
          }
          return `  <li>
                            <div>
                                <i></i>
                                <em>${item.number}</em>
                            </div>
                             <span>
                                ${html2}
                            </span>
                        </li>`;
        })
        .join("");
      $(".home_nav2").html(html);
    }
  });
  //二级导航
  $("#nav2 .home_nav2").on("mouseover", "li", function() {
    $("#nav2 .home_xq").show();
    let idx = $(this).index();
    $(this)
      .addClass("cur")
      .siblings()
      .removeClass("cur");
    $.ajax({
      type: "GET",
      url: "../api/1.json",
      dataType: "json",
      success: function(str) {
        let num5 = "";
        let html1 = "";
        for (let i = 0; i < str[idx].num2.length; i++) {
          html1 += `</dl><dl class="home_dlbox_dl"><dt><spen>${str[idx].num2[i]}:</spen></dt>`;
          for (let j = 0; j < str[idx].num3[i].length; j++) {
            html1 += `<dd>${str[idx].num3[i][j]}</dd>`;
          }
          num5 = html1;
          num5 = num5 + "</dl>";
        }
        let html2 = '<div class="home_img">';
        let num6 = "";
        for (let k = 0; k < str[idx].imgs.length; k++) {
          num6 += `<img src="${str[idx].imgs[k]}" alt="">`;
        }
        html2 += num6 + "</div>";
        num5 += html2;
        $(".home_dlbox").html(num5);
      }
    });
  });
  $(".home_xq").mouseout(function() {
    $(".home_xq").hide();
    $("#nav2 .home_nav2 li").removeClass("cur");
  });
  $(".home_nav2").mouseout(function() {
    $(".home_xq").hide();
    $("#nav2 .home_nav2 li").removeClass("cur");
  });
  $(".home_xq").mouseover(function() {
    $(".home_xq").show();
  });
  $('.home_xq').on('click', '.home_dlbox .home_dlbox_dl dd', function () {
    window.open('alis.html')
  })
})();
