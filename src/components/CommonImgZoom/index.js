import React from 'react';
import { Icon } from 'antd';
import styles from './index.less'

function getOffset(o) {
  let left = 0;
  let top = 0;
  while (o != null && o !== document.body) {
    top += o.offsetTop;
    left += o.offsetLeft;
    o = o.offsetParent;
  }
  console.log(left,top)
  return {
    left,
    top,
  };
}
export  default class CommonImgZoom extends React.PureComponent{
  state = {
    iw:'',
    ih:'',
    imgW:'',
    imgH:'',
    boxW:'',
    boxH:'',
    scaleSize:1,
    bgX:'',
    bgY:'',
  }
  componentDidMount(){
    if (document.addEventListener) {
      document.addEventListener('DOMMouseScroll', this.handleMouseWheel.bind(this), false);
    }
    // 滚动滑轮触发scrollWheelFunc方法
    window.onmousewheel = document.onmousewheel = this.handleMouseWheel.bind(this);
    const { zoomImgSrc } = this.props;
    const that = this;
    const img =new window.Image();
    img.onload  =function(){
       that.handleImg(img);
    }
    img.src = zoomImgSrc;
  }
  componentWillUnmount(){
      if (document.addEventListener) {
         document.removeEventListener('DOMMouseScroll', this.handleMouseWheel, false);
      }
      // 移除滚动滑轮触发scrollWheelFunc方法
      window.onmousewheel = document.onmousewheel = null;
  }

  handleImg = (img) =>{
    if(!img) return;
    const imgW = img.width;
    const imgH = img.height;
    const boxW = imgW < 300 ? 300 : ( imgW > document.body.clientWidth-100 ? document.body.clientWidth -100: imgW + 100);
    const boxH = imgH < 200 ? 200 : ( imgH > document.body.clientHeight-100? document.body.clientHeight -100: imgH +100);
    const bgX = (boxW - imgW) / 2;
    const bgY = (boxH - imgH) / 2;
    this.setState({iw:imgW,ih:imgH,imgW, imgH, boxW, boxH,bgX,bgY});
     this.initImg(boxW,boxH,imgW,imgH)
  }
  handelMouseDown = (e) =>{
    if(!e) return;
    const { iw,ih,boxW,boxH} = this.state;
    if(e.nativeEvent && e.nativeEvent.which === 1){
      // 重置图片
      this.initImg(boxW,boxH,iw,ih)
    }
  }
  // 初始化图片的初始化比例
  initImg = (ww,wh,imgw,imgh) =>{debugger
    let w, h;
    if(imgw > ww|| imgh > wh){
      this.setState({isOver:true},()=>{
        const img = document.getElementById('zoomImg')
        this.setState({
          bgX: (ww - img.width) /2,
          bgY: (wh - img.height) / 2,
          scaleSize: ww / imgw,
          imgH:img.width,
          imgW:img.width,
          iw:img.width,
          ih:img.height,
          isOver: false,
        })
      })
      return;
    }
    // 以完全显示图片为基准,如果改为>，则为以铺满屏幕为基准
    if (ww / wh < imgw / imgh) {
      w = ww;
      h = imgh * ww / imgw;
      this.setState({
        bgX: 0,
        bgY: -(h - wh) / 2,
        scaleSize: ww / imgw,
        imgH:h,
        imgW:w,
      });
    } else {
      this.setState({
        bgX: -(w - ww) / 2,
        bgY:0,
        scaleSize: wh / imgh,
        imgH:h,
        imgW:w,
      })
    }
  }
  handleMouseWheel = (e) =>{
    if(!e || !e.target || e.target.className !=='zoomImg') return;

    // 以鼠标为中心缩放，同时进行位置调整
    let x = e.pageX;
    let y = e.pageY;
    e.preventDefault();
    const {iw,ih,bgX,bgY} = this.state;
    let {scaleSize } = this.state;
    if (e.target) {

      const l = getOffset(document.getElementById('box'));
      x = x - l.left;
      y = y - l.top;

      const p = (e.wheelDelta) / 1200;
      let ns = scaleSize + p;
      ns = ns < 0.5 ? 0.5 : (ns > 3 ? 3 : ns);  // 可以缩小到0.1,放大到5倍
      // 计算位置，以鼠标所在位置为中心
      // 以每个点的x、y位置，计算其相对于图片的位置，再计算其相对放大后的图片的位置
      const newBgX = bgX - (x - bgX) * (ns - scaleSize) / (scaleSize);
      const newBgY = bgY - (y - bgY) * (ns - scaleSize) / (scaleSize);
      scaleSize = ns; // 更新倍率
      this.setState({scaleSize,imgW:iw*ns,imgH:ih*ns,bgY:newBgY,bgX:newBgX});
    }
  }
  render(){
    const { zoomImgSrc,handleColose } = this.props;
    const {imgW, imgH, boxW, boxH,bgX,bgY,isOver} = this.state;
    return (
      <div id="box" style={{ width:boxW,height:boxH}} className={styles.imgZoomBox}>
        <a className="font14" style={{zIndex:100,position:'absolute',right:5,top:5}}onClick={handleColose}><Icon style={{}} type="close" /></a>
        <img
          className="zoomImg"
          id="zoomImg"
          onMouseDown={(e)=>{this.handelMouseDown(e)}}
          onMouseWheel={(e) => {this.handleMouseWheel(e)}}
          style={!isOver ?{width:imgW,height:imgH,left:bgX,top:bgY} : {maxHeight:'100%'}}
          src={zoomImgSrc}
        />
      </div>
    )
  }
}
