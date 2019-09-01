class Dashboard extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      slides: JSON.parse(props.dashboardslides),
      slideMaxHeight: window.innerHeight-150,
      slideMaxWidth: window.innerWidth-150,
    }

    this.updateDimensions = this.updateDimensions.bind(this)
    this.renderSlideSwiper = this.renderSlideSwiper.bind(this)
    this.renderSlideList = this.renderSlideList.bind(this)
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions)
  }

  updateDimensions() {
    // if (Math.abs((this.state.slideMaxWidth+150)-window.innerWidth) > 10 ||
    // Math.abs((this.state.slideMaxHeight+150)-window.innerHeight) > 10) {
      this.setState({
        slideMaxHeight: window.innerHeight-150,
        slideMaxWidth: window.innerWidth-150,
      })
    // }
  }

  renderSlideSwiper() {
    var slidelist = []
    var ratio = this.state.slideMaxWidth / this.state.slideMaxHeight
    
    for (let slide of this.state.slides) {
      var height, width
      var r = slide.dim.width / slide.dim.height
      if (ratio > r) {
        height = this.state.slideMaxHeight
        width = height * r
      } else {
        width = this.state.slideMaxWidth
        height = width / r
      }
      let src = slide.embedded + "&mute=1"
      if (slidelist.length == 0) {
        src += ("&autoplay=1")
      }
      slidelist.push(
<div className="swiper-slide" id={slide.md5} >
  <p className="center">
    <iframe style = {{height: height, width: width}} display="block"  src={src} frameBorder="0"  allowfullscreen="">
    </iframe>
  </p>
</div>
      )
    }
    return (
<div className="swiper-container">
  <div className="swiper-wrapper">
    {slidelist}
  </div>
  <div className="swiper-pagination"></div>
  <div className="swiper-button-next"></div>
  <div className="swiper-button-prev"></div>
</div>
    )
  }

  renderSlideList() {
    var slidelist = []
    var ratio = window.innerWidth / window.innerHeight

    for (let slide of this.state.slides) {
      var height, width
      var r = slide.dim.width / slide.dim.height
      if (ratio > r) {
        height = window.innerHeight * 0.9
        width = height * r
      } else {
        width = window.innerWidth * 0.9
        height = width / r
      }
      let src = slide.embedded + "&mute=1"
      if (slidelist.length == 0) {
        src += ("&autoplay=1")
      }
      slidelist.push(
<p className="center" id={slide.md5}>
  <iframe style = {{height: height, width: width}} display="block"  src={src} frameBorder="0"  allowfullscreen="">
  </iframe>
</p>
      )
    }
    return slidelist
  }

  render() {


    setTimeout(() =>{
      $(function () {
        var swiper = new Swiper('.swiper-container', {
          pagination: {
            el: '.swiper-pagination',
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })
      })
    }, 1000)

    return (
 <div className="row">
  <div className="col-md-12 ">
    <br/>
    {(this.state.slideMaxWidth > 700) ? this.renderSlideSwiper() : this.renderSlideList()}
  </div>
</div> 


    )
  }
}

let props = window.globalStore.datasetToObject(document.getElementById("dashboard"))
ReactDOM.render( <Dashboard {...props}/>,  document.getElementById("dashboard"))
