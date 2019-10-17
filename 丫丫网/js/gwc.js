(() => {
  require(["config"], () => {
      require(["gwc", "ku", "jq"], () => {
          $('#gwc_top').load('loginbar.html');
          $('#gwc_footer1').load('bottom.html');
          $('#gwc_footer2').load('footer.html');
          function xuan(arr) {
              let html = arr.map(function (item) {
                  return `
                    <li class="cart-item" data-id="${item.oid}">
                    <ul>
                        <li><input type="checkbox" class="fx"></li>
                        <li><img src="${item.imgs}" alt=""></li>
                        <li>
                            <span>${item.names}</span>
                            <span style="margin-top: 10px"><i></i>选服务</span>
                        </li>
                        <li>${item.pirce}</li>
                        <li>
                            <span class="cutnum">－</span>
                            <input type="text" value="${item.quantity}" class="kunum" data-num="10">
                            <span class="addnum">+</span>
                        </li>
                        <li><b class="total">${item.pirce}</b></li>
                        <li>
                            <a href="###" class="del">删除</a>
                        </li>
                    </ul>
                </li>`}).join('');
              $('#gwc_list').html(html);
              let num = $('#gwc_list').children().length;
              $('.cart-tab h6 span').html(num);
              
        }
          let uid = getCookie('uid');
          $.ajax({
              type: 'get',
              url: '../api/login.php',
              data: {
                  yong:uid,
                  num: '7'
              },
              dataType: "json",
              success: str => {
                  xuan(str);
              }
          })
          class Car {
              constructor() {
                  this.carBox = null;
              }
              init() {
                  this.carBox = $('#gwc_list');
                  this.addNum(this);//加
                  this.cutNum(this);//减
                  this.manualNum(this);//手动输入
                  this.removeLine(this);//删除单行
                  this.CheckBox(this);//复选
                  this.CheckAll(this);//全选
                  this.removeAll();//删除全部
              }
              addNum(_this) {
                  this.carBox.on('click', '.addnum', function () {
                      let num = $(this).prev().val();
                      num++;
                      _this.total($(this), num);
                  });
              }
              cutNum(_this) {
                  this.carBox.on('click', '.cutnum', function () {
                      let num = $(this).next().val();
                      num--;
                      _this.total($(this), num)
                  });
              }
              manualNum(_this) {
                  this.carBox.on('input', '.kunum', function () {
                      let num = $(this).val();
                      _this.total($(this), num);
                  });
              }
              removeLine(_this) {
                  this.carBox.on('click', '.del', function () {
                      let uid = $(this).parent().parent().parent().attr('data-id');
                      $.ajax({
                          type: "GET",
                          url: "../api/login.php",
                          data: {
                              uid: uid,
                              num: '9',
                          },
                          success: str => {
                              console.log(str);
                          }
                      })
                      $(this).parent().parent().parent().remove();
                      if ($('.cart-box .addnum').size() == 0) {
                          $('.cart-box').css('display', 'none');
                      }
                      _this.allNum(_this.checkedArr()); 
                  });
              }
              CheckBox(_this) {
                  this.carBox.on('click', '.fx', function () {
                      _this.allNum(_this.checkedArr());
                  })
              }
              CheckAll(_this) {
                  $('.allchecked').click(function () {
                      let isok = $('.allchecked').prop('checked');
                      $('#gwc_list .fx').prop('checked', isok);
                      _this.allNum(_this.checkedArr());
                  })
              }
              removeAll() {
                  $('.alldel').click(() => {
                      let arr = this.checkedArr().reverse();//返回被勾选的下标数组  
                      arr.forEach(function (item, index) {
                          let uid = $('#gwc_list .cart-item').eq(arr[index]).attr('data-id');
                          $.ajax({
                              type: "GET",
                              url: "../api/login.php",
                              data: {
                                  uid: uid,
                                  num: '9',
                              },
                              success: str => {
                                  console.log(str);
                              }
                          })
                          $('#gwc_list .cart-item').eq(arr[index]).remove();
                      });
                      this.allNum([]);
                      if ($('#gwc_list .addnum').size() == 0) $('.cart-box').css('display', 'none');;
                  });
              }
              total(now, num) {
                  let kucun = $(now).parent().find('.kunum').data('num');
                  if (num < 1) {
                      num = 1;
                  } else if (num > kucun) {
                      num = kucun;
                  }
                  $(now).parent().find('.kunum').val(num);
                  let price = $(now).parent().prev().text()//单价
                  let all = (num * price).toFixed(2);//小计
                  $(now).parent().next().children().html(all);
                  this.allNum(this.checkedArr());
              }//数量跟小计
              checkedArr() {
                  let arr = [];
                  $('.fx').each(function (index, item) {
                      if ($(item).prop('checked')) arr.push(index);
                  });
                  return arr;
              }//复选框控制总量和总价
              allNum(arr) {
                  let num = 0;//放商品总数量
                  let total = 0;//放总价
                  arr.forEach(function (item, index) {
                      num += $('#gwc_list .kunum').eq(arr[index]).val() * 1;//累加
                      total += $('#gwc_list .total').eq(arr[index]).text() * 1
                  });
                  $('.allnum').html(`已选 ${num} 件商品`);
                  $('.totalprice').html(`总计（不含运费）：￥ ${total.toFixed(2)}`);

                  //控制全选按钮
                  let len = $('.fx').length;//本事复选框的个数
                  let achecknum = $('.fx:checked').length;
                  if (len == achecknum) {
                      //已经全选
                      $('.allchecked').prop('checked', true);
                  } else {
                      $('.allchecked').prop('checked', false);
                  }
              }//渲染总价与总数量
          }

          let c1 = new Car();
          c1.init();    
    });
  });
})();
