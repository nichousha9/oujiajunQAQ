(() => {
  $("#head_nav").load("nav.html");
  let ok = true;
  $(".all_fen").click(function() {
    if (ok == true) {
      $("#head_nav").show();
      ok = false;
    } else {
      ok = true;
      $("#head_nav").hide();
    }
  });
  $(".header-cart-a").click(function() {
    let num = getCookie("number");
    if (num == "") {
      alert("请先登录账号");
    } else {
      location.href = "gwc.html";
    }
  });
  let uid = getCookie('uid');
  $.ajax({
    type: "get",
    url: "../api/login.php",
    data: {
      yong: uid,
      num: "7"
    },
    dataType: "json",
    success: str => {
      $(".header-cart-a span").html(str.length);
      setCookie('gwc',str.length,7)
    }
  });
})();
