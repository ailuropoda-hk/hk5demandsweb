// import { Map, TileLayer, Marker, Popup } from '../../vendor/react-leaflet/src'
const Map = window.ReactLeaflet.Map
const TileLayer = window.ReactLeaflet.TileLayer
const Marker = window.ReactLeaflet.Marker
const Popup = window.ReactLeaflet.Popup

class MapEvent extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visualdata: JSON.parse(props.visualdata),
      itemPlayerIndex: 0,
      showItemPlayer: false,
      zoom: 11,
      mapWidth: window.innerWidth*2/3 - 50,
      windowWidth: window.innerWidth,
    }

    this.updateDimensions = this.updateDimensions.bind(this)
    this.closeItemPlayerModal = this.closeItemPlayerModal.bind(this)
    this.renderMap = this.renderMap.bind(this)
    this.renderMarker = this.renderMarker.bind(this)
    this.renderTimeline = this.renderTimeline.bind(this)
    this.renderPlayerModal = this.renderPlayerModal.bind(this)
  }
  
  componentDidMount(){
    let minlat = 9999
    let maxlat = 0
    let minlng = 9999
    let maxlng = 0
    for (let i=0; i<this.state.visualdata.length; i++) {
      if (this.state.visualdata[i].location.lat != 0 &&  this.state.visualdata[i].location.lng != 0) {
        if (minlat > this.state.visualdata[i].location.lat) {
          minlat = this.state.visualdata[i].location.lat
        }
        if (maxlat < this.state.visualdata[i].location.lat) {
          maxlat = this.state.visualdata[i].location.lat
        }
        if (minlng > this.state.visualdata[i].location.lng) {
          minlng = this.state.visualdata[i].location.lng
        }
        if (maxlng < this.state.visualdata[i].location.lng) {
          maxlng = this.state.visualdata[i].location.lng
        }

      }
    }
    this.setState({mapCenter: [(minlat + maxlat)/2, (minlng + maxlng)/2]})
    window.addEventListener("resize", this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions)
  }

  updateDimensions() {
    this.setState({
      mapWidth: window.innerWidth*2/3 - 50,
      windowWidth: window.innerWidth})
  }

  clickEvent(idx) {
    if (window.innerWidth < 680) {
      window.open(this.state.visualdata[idx].url ,'_blank')
    } else {
      this.setState({itemPlayerIndex: idx, showItemPlayer: true})
    }
    
  }
  
  closeItemPlayerModal() {
    this.setState({showItemPlayer: false})
  }

  renderTimeline() {
    let articleList = []
    let visualdata = this.state.visualdata
    let lastts
    let dir = "right"
    if (visualdata.length > 0) {
      lastts = visualdata[0].ts
      articleList.push(
<div className="timeline-date">
  <h3 className="heading-primary">
    {moment.unix(visualdata[0].ts).format("DD MMMM YYYY HH:mm")}
  </h3>
</div>
      )

    }
    for (let i=0; i<visualdata.length; i++) {
      let ts = visualdata[i].ts
      if (ts != lastts) {
        articleList.push(
<div className="timeline-date">
  <h3 className="heading-primary">
    {moment.unix(visualdata[i].ts).format("DD MMMM YYYY HH:mm")}
  </h3>
</div>
        )
        lastts = ts

      }
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
      <div className="post-image">
        <p className="center" >
          <img className="img-responsive center" src={visualdata[i].thumbnail} alt=""/>
        </p>
      </div>
    </div>
  </div>
  <div className="row">
    <div className="col-md-12">

      <div className="post-content">
        <h6 className="heading-primary">
          {visualdata[i].title}
        </h6>
        <p>{visualdata[i].desc}</p>
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

  renderPlayerModal() {
    var visualdata = this.state.visualdata[this.state.itemPlayerIndex]
    var idx = this.state.itemPlayerIndex
    var ratio = window.innerWidth / (window.innerHeight - 500)
    var r = visualdata.dim.width / visualdata.dim.height
    var height, width
    var tagList = []
    if (ratio > r) {
      height = (window.innerHeight - 400) * 0.9
      width = height * r
    } else {
      width = window.innerWidth * 0.9
      height = width / r
    }
    if (visualdata.tags) {
      for (let tag of visualdata.tags) {
      tagList.push(
<a>#{tag}</a>
        )
      }
    }

    let src  = visualdata.embedded
    return (
<ReactBootstrap.Modal show={this.state.showItemPlayer} onHide={this.closeItemPlayerModal} dialogClassName="custom-modal item-player">
  <ReactBootstrap.Modal.Header closeButton>
    <ReactBootstrap.Modal.Title>{visualdata.title}</ReactBootstrap.Modal.Title>
  </ReactBootstrap.Modal.Header>
  <ReactBootstrap.Modal.Body>
    <p className="center">
      {visualdata.type == "facebook-photo" ? (
        <img className="center" style={{height: height, width: width}} src={src} alt=""/>
      ) : (
        <iframe height={height*0.95} width={width*0.95} src={src} frameborder="0"/>

      )}
    </p>
    <h6>
      {tagList}<br/>
      Source: <a href={visualdata.url} target="_blank">{visualdata.source}</a><br/>
      {moment.unix(visualdata.ts).format("DD MMMM YYYY HH:mm")}<br/>
      {visualdata.desc}<br/>
    </h6>
  </ReactBootstrap.Modal.Body>
  <ReactBootstrap.Modal.Footer>
    { (idx > 0) && (
      <ReactBootstrap.Button className="pull-left" onClick={this.clickEvent.bind(this, idx - 1)} >
        {this.state.visualdata[idx - 1].title}</ReactBootstrap.Button>
    )}
    { (idx < this.state.visualdata.length - 1) && (
      <ReactBootstrap.Button  onClick={this.clickEvent.bind(this, idx + 1)}>
        {this.state.visualdata[idx + 1].title}</ReactBootstrap.Button>
    )}
    
  </ReactBootstrap.Modal.Footer>
</ReactBootstrap.Modal>
    )
  }

  renderMarker() {
    var markerList = []
    let center= [0, 0]
    let cnt =0
    for (let i=0; i<this.state.visualdata.length; i++) {
      let visualdata = this.state.visualdata[i]
      if (visualdata.location.lat != 0 &&  visualdata.location.lng != 0) {
        center[0] += visualdata.location.lat
        center[1] += visualdata.location.lng
        cnt++
        markerList.push(
<Marker position={[visualdata.location.lat, visualdata.location.lng]} 
  onClick={this.clickEvent.bind(this, i)}>
  <Popup>
    <span>{this.state.visualdata[i].title}</span>
  </Popup>
</Marker>
        )
      }

    }
    return (
      markerList
    )
  }


  renderMap() {
    return (
    // <div className="center-col" style={{height: 500}}>
      <Map center={this.state.mapCenter} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {this.renderMarker()}
      </Map>
      // </div>
    )
  }

  render() {
    
    return (

  <div className="row">
    {(this.state.windowWidth > 1000) ? (
      <div>
        <div className="col-md-8">
          <div className="container" style={{width: this.state.mapWidth}}>
            <div className="pin-wrapper" style={{height: 256}}>
              <div className="row sticky-active" id="sidebar" data-plugin-sticky="" 
                data-plugin-options="{;minWidth&quot;: 200, &quot;containerSelector&quot;: &quot;.container&quot;, &quot;padding&quot;: {&quot;top&quot;: 150}}" 
                style={{width: this.state.mapWidth, left: 50, top: 150, position: "fixed"}}>
                {this.renderMap()}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
            {this.renderTimeline()}
        </div>
      </div>
    ) : (
      this.renderTimeline()
    )}
    {this.renderPlayerModal()}
    
  </div>


    )
  }
}

let props = window.globalStore.datasetToObject(document.getElementById("mapevent"));
ReactDOM.render( <MapEvent {...props}/>,  document.getElementById("mapevent"));