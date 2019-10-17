(function() {
  let num2 = getCookie("number");
  if (num2 == "") {
    $("#loginbar .zc").html("注册");
    $("#loginbar .dl").html("登录");
  } else {
    $.ajax({
      type: "get",
      url: "../api/login.php",
      data: {
        num: "8",
        yonghu: num2
      },
      success: str => {
        let arr = JSON.parse(str);
        $("#loginbar .logintop .dl").attr("data-uid", arr[0].cid);
        setCookie("uid", arr[0].cid, 7);
        $("#loginbar .dl").html(arr[0].number + "欢迎您回来!");
        $("#loginbar .zc").html("退出");
      }
    });
  }

  $("#loginbar .dl").click(() => {
    location.href = "login.html";
    $("#loginbar .zc").html("退出");
  });

  $("#loginbar .zc").click(() => {
    if ($("#loginbar .dl").html() == "登录") {
      location.href = "enroll.html";
    } else {
      location.href = "shouye.html";
      setCookie("number", "", 7);
      setCookie("passw", "", 7);
      setCookie("uid", "", 7);
      $("#loginbar .zc").html("注册");
      $("#loginbar .dl").html("登录");
    }
  });
  $(".geren").mouseover(function() {
    $(this)
      .children("ul")
      .show();
  });
  $(".geren").mouseout(function() {
    $(this)
      .children("ul")
      .hide();
  });

  $(".nav1").mouseover(function() {
    $("#login_nav").show();
  });
  $(".nav").mouseout(function() {
    $("#login_nav").hide();
  });
  $(".header-cart-a").mouseover(function() {
    $(".header-cart-box").show();
  });
  $(".header-cart-a").mouseout(function() {
    $(".header-cart-box").hide();
  });
})();
