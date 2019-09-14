class GalleryCat extends React.Component{
  constructor(props) {
    super(props)
    let cat = ""
    if (props.cat != null && props.cat != undefined) {
      cat = props.cat
    }
    let titleClose = "關閉"
    if (this.props.locale == "zh-Hans") {
      titleClose = "关闭"
    } else if (this.props.locale == "en") {
      titleClose = "Close"
    }
    this.state = {
      locale: props.locale,
      cat: cat,
      isShowGallery: true,
      isShowVisualData: false,
      visualDataIndex: 0,
      visualdata: [],
      titleClose: titleClose,
      winHeight: window.innerHeight,
      winWidth: window.innerWidth,
    }

    this.updateDimensions = this.updateDimensions.bind(this)
    this.clickVisualData = this.clickVisualData.bind(this)
    this.renderGallery = this.renderGallery.bind(this)
    this.renderVisualData = this.renderVisualData.bind(this)

  }

  componentDidMount() {
    this.fetchVisualData(this.state.cat)
    window.addEventListener("resize", this.updateDimensions)
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

  fetchVisualData(cat) {
    let urlPath = '/' + this.state.locale + '/event?cat=' + cat
    // console.log("fetch url", urlPath)
    // urlPath = '/' + this.state.locale + '/event'
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

  goToScreen(screen) {
    switch (screen) {
    case 'gallery':
      this.setState({isShowGallery: true, isShowVisualData: false})
      break
    case 'visualdata':
      this.setState({isShowGallery: false, isShowVisualData: true})
      break
    }
  }

  clickVisualData(idx) {
    if (window.innerWidth < 680) {
      window.open(this.state.visualdata[idx].url ,'_blank')
    } else {
      this.setState({visualDataIndex: idx}, this.goToScreen('visualdata'))
    }
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
      <li className="active" onClick={this.clickVisualData.bind(this, idx-1)}><a href="#">{"< " + this.state.visualdata[idx-1].title}</a></li>
    )}
    <li className="pull-right" onClick={this.goToScreen.bind(this, 'gallery')}><a href="#">{this.state.titleClose}</a></li>
    { (idx < this.state.visualdata.length - 1) && (
      <li className="active pull-right"  onClick={this.clickVisualData.bind(this, idx+1)}><a href="#">{this.state.visualdata[idx+1].title + " >"}</a></li>
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
      let itemdom
      if (item.thumbnail == "") {
        itemdom = <iframe src={item.embedded} frameBorder="0"/>
      } else {
        itemdom = <img src={item.thumbnail} className="img-responsive" alt={item.embedded} /> 
      }

      galleryList.push(
<li className="col-md-3 isotope-item" onClick={this.clickVisualData.bind(this, i)} > 
  <span className="thumb-info thumb-info-centered-info">
    <span className="thumb-info-wrapper">
      {itemdom}
      <span className="thumb-info-title">
        <span className="thumb-info-inner">{item.title}</span>
        {(item.desc != "") && <span className="thumb-info-type">{item.desc}</span>}
      </span>
    </span>
  </span>
</li>
      )
    }

    return (
<div className="row" 
  style={containerStyle}>
  {/* <ul className="nav nav-pills">
    <li onClick={this.goToScreen.bind(this, 'intro')}><a href="#">{this.state.titleIntro}</a></li>
    <li className="active" ><a href="#">{this.state.titleGallery}</a></li>
    <li className="pull-right" onClick={this.goToScreen.bind(this, 'timeline')}><a href="#">{this.state.titleClose}</a></li>
  </ul>
  <hr/> */}
  <div className="row">
    <ul class="portfolio-list">
      {galleryList}
    </ul>
  </div>
  
</div>
    )
  }

  render() {
    if (this.state.isShowGallery) {
      return this.renderGallery()
    } else if (this.state.isShowVisualData) {
      return this.renderVisualData()
    }
  }
}

let props = window.globalStore.datasetToObject(document.getElementById("gallerycat"));
ReactDOM.render( <GalleryCat {...props}/>,  document.getElementById("gallerycat"))