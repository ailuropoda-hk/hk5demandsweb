class Gallery extends React.Component{
  constructor(props) {
    super(props)
    let events = JSON.parse(props.events)
    let titleClose = "關閉"
    let titleGallery = "影像資料庫"
    let titleIntro = "簡介"
    if (this.props.locale == "zh-Hans") {
      titleClose = "关闭"
      titleGallery = "影像资料库"
      titleIntro = "简介"
    } else if (this.props.locale == "en") {
      titleClose = "Close"
      titleGallery = "Visual Gallery"
      titleIntro = "Summary"
    }
    // console.log("locale", this.props.locale)
    this.state = {
      isShowBoth: (window.innerWidth > 1000),
      visualDataIndex: 0,
      visualdata: [],
      isShowGallery: false,
      isShowVisualData: false,
      isShowIntro: (window.innerWidth > 1000),
      renderMode: 'sepscreen',
      events: events,
      event: events[0].event,
      locale: props.locale,
      titleClose: titleClose,
      titleGallery: titleGallery,
      titleIntro: titleIntro,
      winHeight: window.innerHeight,
      winWidth: window.innerWidth,
    }

    this.updateDimensions = this.updateDimensions.bind(this)
    this.fetchVisualData = this.fetchVisualData.bind(this)
    this.clickVisualData = this.clickVisualData.bind(this)
    this.clickEvent = this.clickEvent.bind(this)
    this.renderSepScreen = this.renderSepScreen.bind(this)
    this.renderTimeline = this.renderTimeline.bind(this)
    this.renderGallery = this.renderGallery.bind(this)
    this.renderVisualData = this.renderVisualData.bind(this)

  }

  componentDidMount() {
    this.fetchVisualData()
    window.addEventListener("resize", this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions)
  }

  updateDimensions() {
    this.setState({
      winHeight: window.innerHeight,
      winWidth: window.innerWidth,
    })
    if (window.innerWidth > 1000) {
      this.setState({isShowBoth: true})
    } else {
      this.setState({isShowBoth: false})
    }
  }

  fetchVisualData() {
    let urlPath = '/' + this.state.locale + '/event?event=' + this.state.event
    urlPath = '/' + this.state.locale + '/event'
    fetchServer(urlPath, 'GET', {}).then((res) => {
      if (res.data.visualdata) {
        this.setState({visualdata: res.data.visualdata})
      } else {
        this.setState({visualdata: []})
      }
      // console.log(res)
    }, (err) => {
      console.log(err)
    })
  }

  clickVisualData(idx) {
    if (window.innerWidth < 680) {
      window.open(this.state.visualdata[idx].url ,'_blank')
    } else {
      this.setState({visualDataIndex: idx}, this.goToScreen('visualdata'))
    }
  }

  clickEvent(idx) {
    this.setState({event: this.state.events[idx].event}, 
      this.goToScreen('intro'))
  }

  goToScreen(screen) {
    switch (screen) {
    case 'gallery':
      this.setState({isShowIntro: false, isShowGallery: true, isShowVisualData: false})
      break
    case 'intro':
      this.setState({isShowIntro: true, isShowGallery: false, isShowVisualData: false})
      break
    case 'visualdata':
      this.setState({isShowIntro: false, isShowGallery: false, isShowVisualData: true})
      break
    case 'timeline':
      this.setState({isShowIntro: false, isShowGallery: false, isShowVisualData: false})
      break
    }
  }

  renderGallery() {
    let galleryList = []
    let containerStyle
    if (this.state.isShowBoth) {
      containerStyle = { marginLeft: 35, marginTop: 14, marginRight: 35, marginBottom: 35 }
    } else {
      containerStyle = { marginLeft: 5, marginTop: 14, marginRight: 5}
    }
    
    for (let i=0; i<this.state.visualdata.length; i++) {
      let item = this.state.visualdata[i]
      galleryList.push(
<span onClick={this.clickVisualData.bind(this, i)} className="col-md-3 thumb-info thumb-info-centered-info ">
  <span className="thumb-info-wrapper">
    <img src={item.thumbnail} className="img-responsive" alt=""/>
    <span className="thumb-info-title">
      <span className="thumb-info-inner">{item.title}</span>
      <span className="thumb-info-type">{item.desc}</span>
    </span>
  </span>
</span>
      )
    }

    return (
<div className="row" 
  style={containerStyle}>
  <ul className="nav nav-pills">
    <li onClick={this.goToScreen.bind(this, 'intro')}><a href="#">{this.state.titleIntro}</a></li>
    <li className="active" ><a href="#">{this.state.titleGallery}</a></li>
    <li className="pull-right" onClick={this.goToScreen.bind(this, 'timeline')}><a href="#">{this.state.titleClose}</a></li>
  </ul>
  <hr/>
  {galleryList}
</div>
    )
  }

  renderTimeline() {
    let articleList = []
    let events = this.state.events
    let dir = "right"

    for (let i=0; i<events.length; i++) {
      if (dir == "left") {
        dir = "right"
      } else {
        dir = "left"
      }
      articleList.push(
<article className={"timeline-box post post-small " + dir}
  onClick={this.clickEvent.bind(this, i)}>
  <div className="row">
    <div className="col-md-12">
      <div className="post-content">
        <h6 className="heading-primary">
          {moment(events[i].date).format("DD MMM YYYY")}
        </h6>
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col-md-12">
      <div className="post-image">
        <p className="center" >
          <img className="img-responsive center" src={"/img/events/" + events[i].event + ".jpg"} alt=""/>
        </p>
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col-md-12">
      <div className="post-content">
        <h6 className="heading-primary">{events[i].title}</h6>
        <p>{events[i].desc}</p>
      </div>
    </div>
  </div>
</article>
      )
    }

    return(
<div className="blog-posts">
  <section className="timeline" style={{width: "100%", marginLeft: 0}}>
    <div className="timeline-body">
      {articleList}
    </div>
  </section>
</div>
    )
  }

  renderVisualData() {
    var visualdata = this.state.visualdata[this.state.visualDataIndex]
    var idx = this.state.visualDataIndex
    var resultDim = calWidthHeight(
      visualdata.dim.width, visualdata.dim.height,
      window.innerWidth-150, window.innerHeight-350
    )

    var tagList = [(<a>#{visualdata.event} </a>)]
    if (visualdata.tags) {
      for (let tag of visualdata.tags) {
      tagList.push(
<a>#{tag} </a>
        )
      }
    }

    let src  = visualdata.embedded
    return (
<div className="row" 
  style={{ marginLeft: 35, marginTop: 14, marginRight: 35, width: this.state.winWidth-50, position: "fixed"}}>
  <ul className="nav nav-pills">
    { (idx > 0) && (
      <li className="active" onClick={this.clickVisualData.bind(this, idx-1)}><a href="#">{this.state.visualdata[idx-1].title}</a></li>
    )}
    <li className="pull-right" onClick={this.goToScreen.bind(this, 'gallery')}><a href="#">{this.state.titleClose}</a></li>
    { (idx < this.state.visualdata.length - 1) && (
      <li className="active pull-right"  onClick={this.clickVisualData.bind(this, idx+1)}><a href="#">{this.state.visualdata[idx+1].title}</a></li>
    )}
  </ul>
  <hr/>
  <p className="center">
    {visualdata.type == "facebook-photo" ? (
      <img className="center" style={{height: resultDim.height, width: resultDim.width}} src={src} alt=""/>
    ) : (
      <iframe height={resultDim.height} width={resultDim.width} src={src} frameBorder="0"/>
    )}
  </p>
  <h6>
    {tagList}<br/>
    Source: <a href={visualdata.url} target="_blank">{visualdata.source}</a><br/>
    {visualdata.desc}<br/>
  </h6>
</div>
    )
  }

  renderIntro() {
    let containerStyle
    let iframeStyle
    if (this.state.isShowBoth) {
      containerStyle = { marginLeft: 35, marginTop: 14, marginRight: 35, position: "fixed"}
      iframeStyle = {width: this.state.winWidth-50, height: this.state.winHeight-220}
    } else {
      containerStyle = { marginLeft: 5, marginTop: 14, marginRight: 5}
      iframeStyle = {width: this.state.winWidth, height: this.state.winHeight+220}
    }
    let src = "/" + this.state.locale + "/eventintro/" + this.state.event
    return (
<div className="row" 
  style={containerStyle}>
  <ul className="nav nav-pills">
    <li className="active"><a href="#">{this.state.titleIntro}</a></li>
    <li onClick={this.goToScreen.bind(this, 'gallery')}><a href="#">{this.state.titleGallery}</a></li>
    <li className="pull-right" onClick={this.goToScreen.bind(this, 'timeline')}><a href="#">{this.state.titleClose}</a></li>
  </ul>
  <hr/>
  <iframe style={iframeStyle} src={src} frameBorder="0"/>
</div>
    )
  }

  renderSepScreen() {
    let src = "/" + this.state.locale + "/eventintro/" + this.state.event
    return (
<div className="row">
  <div className="container col-md-6" style={{height: this.state.winHeight}}>
    <div className="pin-wrapper" style={{height: 256}}>
      <div className="row sticky-active" id="sidebar" data-plugin-sticky="" 
        style={{width: this.state.winWidth/2-50, left: 50, top: 110, position: "fixed"}}>
        <ul className="nav nav-pills">
          <li className="active"><a href="#">{this.state.titleIntro}</a></li>
          <li onClick={this.goToScreen.bind(this, 'gallery')}><a href="#">{this.state.titleGallery}</a></li>
        </ul>
        <hr/>
        <iframe style={{width: this.state.winWidth/2-50, height: this.state.winHeight-220}} src={src} frameBorder="0"/>
      </div>
    </div>
  </div>
  <div className="col-md-6">
    {this.renderTimeline()}
  </div>
</div>
    )
  }

  renderWebScreen() {
    return(
<div>
  {this.state.isShowGallery && this.renderGallery()}
  {this.state.isShowVisualData && this.renderVisualData()}
  {!this.state.isShowGallery && !this.state.isShowVisualData && this.renderSepScreen()}
</div>
    )
  }

  renderMobileScreen() {
    if (this.state.isShowGallery) {
      return this.renderGallery()
    } else if (this.state.isShowVisualData) {
      return this.renderVisualData()
    } else if (this.state.isShowIntro) {
      return this.renderIntro()
    } else {
      return this.renderTimeline()
    }
  }

  render() {
    return (
<div>
  {(this.state.isShowBoth)?(this.renderWebScreen()):(this.renderMobileScreen())}
</div>
    )
  }
}

let props = window.globalStore.datasetToObject(document.getElementById("gallery"));
ReactDOM.render( <Gallery {...props}/>,  document.getElementById("gallery"))