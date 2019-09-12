var loadYT
class Anthem extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      msg: "",
      videoId: "oUIDL4SB60g",
      iframesrc: "https://www.youtube.com/embed/oUIDL4SB60g?rel=0&mute=0",
      t: 7
      // iframesrc: "https://www.youtube.com/iframe_api"
    }
  }


  componentDidMount () {
    loadYT = new Promise((resolve) => {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      window.onYouTubeIframeAPIReady = () => resolve(window.YT)
    })
  
    setTimeout(()=>{
      this.player = new YT.Player(this.vplayer, {
        height: 390,
        width:  640,
        videoId: "oUIDL4SB60g",
        playerVars: {start: this.state.t},
        events: {
          onReady: this.onPlayerReady,
          onStateChange: this.onPlayerStateChange
        }
      })
    }, 1000)

    
    setTimeout(()=>{
      var lastSyncSec = -1
      setInterval(()=> {
        
        
        let st = this.player.getPlayerState()
        if (st == YT.PlayerState.ENDED || st == YT.PlayerState.CUED || st == -1) {
          
          fetchServer("/ts", "GET", {}).then((res)=>{
            let s = parseInt(res.ts) % 150
            // console.log("seconds",s, res)
            if (s <= 120) {
              if (lastSyncSec != -1 && lastSyncSec != s){
                this.player.loadVideoById(this.state.videoId, s)
                lastSyncSec=-1
              } else {
                lastSyncSec=s
              }
              console.log("lastSyncSec", lastSyncSec)
            } else {
              console.log("second", s)
            }
            
          })
        } else {
          console.log("state", st, YT.PlayerState.CUED)
        }
      }, 300)
      // this.setState({t: this.state.t + 10})
      // // console.log(this.state.t)

      // this.player.loadVideoById("oUIDL4SB60g", 30)

      // console.log(res)
    }, 1500)
  }

   onPlayerReady(event) {
    // event.target.mute();
    // var fn = function(){ event.target.playVideo(); }
    // setTimeout(fn, 1000);
 
    // event.target.playVideo();
  }

  onPlayerStateChange(e) {
    // console.log(e)
    console.log(e.target.getPlayerState())
    // console.log("YT.PlayerState.PLAYING", YT.PlayerState.PLAYING)
    // console.log("YT.PlayerState.ENDED",YT.PlayerState.ENDED)
    // console.log("YT.PlayerState.PAUSED", YT.PlayerState.PAUSED)
    // console.log("YT.PlayerState.BUFFERING", YT.PlayerState.BUFFERING)
    // console.log("YT.PlayerState.CUED", YT.PlayerState.CUED)
    // if (typeof this.props.onStateChange === 'function') {
    //   this.props.onStateChange(e)
    // }
  }

  render() {
    return (
<div className="row">
  <h1>           {this.state.msg}</h1>
  <p className="center">
    <div id='player' ref={(obj)=>{this.vplayer = obj}} ></div>
  </p>
</div>
    )
  }
}

let props = window.globalStore.datasetToObject(document.getElementById("anthem"));
ReactDOM.render( <Anthem {...props}/>,  document.getElementById("anthem"))