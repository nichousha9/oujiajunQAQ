(function() {
  require(["config"], function() {
    require(["enroll", "ku", "jq"], function() {
      //尾部结构插入
      $("#log_footer").load("footer.html");

      //首页跳转
      $(".enroll_head img").click(() => {
        location.href = "shouye.html";
      });

      //登录页跳转
      $(".login_wrap .right a").click(() => {
        location.href = "login.html";
      });

      function tan(number) {
        $(".tan").show();
        $(".tan h1").html(number);
        setTimeout(function() {
          $(".tan").hide();
        }, 2000);
      }

      //用户名
      let ok1 = false;
      $("#userUID").blur(function() {
        let name = $("#userUID").val();
        if (name) {
          let reg = /^[a-zA-Z]\w\d{5,15}$/;
          let num = reg.test(name);
          if (num == true) {
            ok1 = true;
          } else {
            ok1 = false;
            tan("用户名格式不正确");
          }
        } else {
          tan("用户名不能为空");
          ok1 = false;
        }
      });

      //手机号码
      let ok = false;
      $("#usermobile2").blur(function() {
        let arr = $("#usermobile2").val();
        if (arr) {
          let reg = /^1[3-9]\d{9}$/;
          let num = reg.test(arr);
          if (num == true) {
            $.ajax({
              type: "post",
              url: "../api/login.php",
              data: {
                phone: arr,
                num: "4"
              },
              success: str => {
                if (str == "yes") {
                  ok = true;
                } else {
                  tan("手机号码已被注册");
                  ok = false;
                }
              }
            });
          } else {
            tan("手机号码格式不正确");
            ok = false;
          }
        } else {
          tan("号码不能为空");
          ok = false;
        }
      });

      //密码验证
      let ok2 = false;
      $("#userpwd3").blur(function() {
        let arr = $("#userpwd3").val();
        if (arr) {
          let reg = /^[a-zA-Z]?\w{6,99}$/;
          let num = reg.test(arr);
          if (num == true) {
            ok2 = true;
          } else {
            tan("请输入6位以上以英文开头的密码");
            ok2 = false;
          }
        } else {
          tan("密码不能为空");
          ok2 = false;
        }
      });

      //重复密码验证
      let ok6 = false;
      $("#userpwd4").blur(function() {
        let arr = $("#userpwd4").val();
        let arr1 = $("#userpwd3").val();
        if (arr) {
          if (arr == arr1) {
            ok6 = true;
          } else {
            tan("两次输入密码不一致");
            ok6 = false;
          }
        } else {
          tan("密码不能为空");
          ok6 = false;
        }
      });

      //验证码
      function suiji() {
        let arr = yanzheng(4);
        $("#codedl2 h5")
          .html(arr)
          .css({
            color: Color(16),
            background: Color(16),
            "font-size": "16px"
          });
        return arr;
      }
      let arr = "";
      arr = suiji().toLowerCase();
      let ok3 = false;
      $("#codedl2 a").click(() => {
        arr = suiji().toLowerCase();
      });
      $("#yzmcode2").blur(function() {
        let num = $("#yzmcode2")
          .val()
          .toLowerCase();
        if (num) {
          if (num == arr) {
            ok3 = true;
          } else {
            ok3 = false;
            tan("请输入正确的验证码");
            arr = suiji().toLowerCase();
          }
        } else {
          ok3 = false;
        }
      });

      //邮箱验证
      let ok7 = false;
      $("#usermail").blur(function() {
        let name = $("#usermail").val();
        if (name) {
          let reg = /^[\w&%$#!\-]+@[\w&%$#!\-]+\.[a-zA-Z]+$/;
          let num = reg.test(name);
          if (num == true) {
            ok7 = true;
          } else {
            ok7 = false;
            tan("邮箱格式不正确");
          }
        } else {
          tan("邮箱不能为空");
          ok7 = false;
        }
      });

      //协议复选
      let ok4 = true;
      $("#mmprovision2").prop("checked", true);
      let no = true;
      $("#mmprovision2").click(() => {
        if (no) {
          tan("请阅读丫丫网用户协议");
          ok4 = false;
        } else {
          ok4 = true;
        }
        no = !no;
      });

      //手机验证码
      let num = 10;
      let timer = null;
      let shuzi = "";
      let ok5 = false;
      function ding() {
        num--;
        $(".dxbtn").val(num + "秒后重新获取验证码");
        if (num <= 0) {
          clearInterval(timer);
          $(".dxbtn").val("获取短信验证码");
          $(".dxbtn").removeAttr("disabled");
        }
      }
      $(".dxbtn").click(() => {
        $.ajax({
          type: "post",
          data: {
            userphone: $("#usermobile2").val() //换成你的号码即可
          },
          url: "../api/duanxin.php",
          async: true,
          success: function(str) {
            let arr = JSON.parse(str);
            shuzi = arr.phonecode;
            console.log(shuzi);
          }
        });
        clearInterval(timer);
        num = 10;
        $(".dxbtn").val(num + "秒后重新获取验证码");
        timer = setInterval(ding, 1000);
        $(".dxbtn").attr({ disabled: "disabled" });
      });
      $("#phonecode2").blur(function() {
        let num = $("#phonecode2").val();
        if (num) {
          if (num == shuzi) {
            ok5 = true;
          } else {
            tan("验证码错误");
            ok5 = false;
          }
        } else {
          tan("请输入");
          ok5 = false;
        }
      });

      //注册
      $("#regbut2").click(() => {
        if (ok && ok1 && ok2 && ok3 && ok4 && ok6 && ok7 && ok5 == true) {
          $.ajax({
            type: "post",
            url: "../api/login.php",
            data: {
              email: $("#usermail").val(),
              phone: $("#usermobile2").val(),
              passw: $("#userpwd3").val(),
              name: $("#userUID").val(),
              num: "2"
            },
            success: str => {
              if (str == "yes") {
                location.href = "login.html";
              } else {
                tan("注册成功");
              }
            }
          });
        } else tan("信息有误");
      });
    });
  });
})();
