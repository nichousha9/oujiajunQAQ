class Carousel {
    constructor(data) {
        this.Data = {
            iw: 500,//默认高度
            ih: 300,//默认宽度
            time: 2//默认时间
        }
        Object.assign(this.Data, data);
        this.timer = null;
        this.imgs = data.imgdata;
        this.time = this.Data.time * 1000;
        this.box = `#${this.Data.ele}`
        this.Box = $(this.box);
        this.num = 0
    }
    init() {
        this.CarouselHTML();//渲染外层结构;
        this.that = this
        this.CarouselImgs();//渲染图片
        this.timer = setInterval(this.Next.bind(this.that), this.time);//自动轮播
        this.Over(this);//移入
        this.Out(this);//移出
        this.Posibtn(this)//点击切换
        this.focus()//渲染焦点
        this.FocusSwitch(this)//焦点切换
    }
    CarouselHTML() {
        let html = `
        <div class="imglist">
            <ul></ul>
        </div>
        <p class="light"></p>
       
        <div class="posibtn">
            <p data-id ="prev" class="prev"></p>
            <p data-id="next" class="next"></p>
        </div>
        `;
        this.Box.html(html);
        let wh = `${this.box},.imglist`;
        $(wh).css({
            'width': this.Data.iw,
            'height': this.Data.ih
        })
        $('.posibtn,.light').css({
            'width': this.Data.iw,
        })

    }//渲染结构
    CarouselImgs() {
        let imgs = this.imgs.map(item => {
            return `<li style="width:${this.Data.iw}px;height:${this.Data.ih}px;">
            <img src="${item}" alt="">
            </li>`;
        }).join('');
        $('.imglist').children().html(imgs);
        $('.imglist').children().children().css('left', this.Data.iw);
        $('.imglist').children().children().eq(0).css('left', 0);
    }//渲染图片
    Next() {
        let imgs = $('.imglist').children().children();
        startMove(imgs[this.num], { 'left': -this.Data.iw });
        this.num = ++this.num > imgs.length - 1 ? 0 : this.num;
        imgs[this.num].style.left = this.Data.iw + 'px';
        startMove(imgs[this.num], { 'left': 0 });
        this.focus();
        return this.num
    }//向左
    Prev() {
        let imgs = $('.imglist').children().children();
        startMove(imgs[this.num], { 'left': this.Data.iw });
        this.num = --this.num < 0 ? imgs.length - 1 : this.num;
        imgs[this.num].style.left = -this.Data.iw + 'px';
        startMove(imgs[this.num], { 'left': 0 });
        this.focus()
    }//向右
    Over(now) {
        this.Box.mouseover(function () {
            clearInterval(now.timer);
            $('.posibtn').show();
        })
    }//移入停止定时器显示左右标
    Out(now) {
        this.Box.mouseout(function () {
            clearInterval(now.timer);
            now.timer = setInterval(now.Next.bind(now.that), now.time)
            $('.posibtn').hide();
        })
    }//移出开启定时器隐藏左右标
    Posibtn(now) {
        $('.posibtn').on('click', 'p', function () {
            if ($(this).data().id == 'prev') now.Prev();
            if ($(this).data().id == 'next') now.Next();
        })
    }//左右切换
    focus() {
        let html = ''
        for (let i = 0; i < this.imgs.length; i++) {
            html += `<span>${i + 1}</span>`
        }
        $('.light').html(html);
        $('.light').children().eq(this.num).addClass('active');
    }//焦点变化
    FocusSwitch(now) {
        $('.light').on('click', 'span', function () {
            let index = $(this).index();
            if (index > now.num) {
                let imgs = $('.imglist').children().children();
                startMove(imgs[now.num], { 'left': -now.Data.iw });
                imgs[index].style.left = now.Data.iw + 'px';
                startMove(imgs[index], { 'left': 0 });
            }//焦点下标大于图片下标的时候从右边进入
            if (index < now.num) {
                let imgs = $('.imglist').children().children();
                startMove(imgs[now.num], { 'left': now.Data.iw });
                imgs[index].style.left = -now.Data.iw + 'px';
                startMove(imgs[index], { 'left': 0 });
            }//焦点下标小于图片下标的时候从左边进入
            now.num = index;
            now.focus();
        })
    }//焦点切换
}
