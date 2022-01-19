import { Component } from '@angular/core';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  peer : any = null ;
  conn: any = null ;
  call: any = null ;
  myCamFeed: any = null ;
  guestCamFeed: any = null ;
  title = "peerjs" ;

ngOnInit(): void{
  console.log("component just rendered");
}

  createPeer(peerId: string) : void{
    console.log("Creating PeerObject...");
    this.peer = new Peer(peerId, { config: {'iceServers': [ { urls: 'stun:stun.l.google.com:19302' }  ] } } );
    if(this.peer['_id'])
      console.log("Peer Object Created: " + this.peer['_id']);
      this.peer.on('call', (call : any) => {
        navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((stream : any) => {
          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', (remoteStream : any) => {
            this.guestCamFeed = remoteStream
          });
          this.myCamFeed = stream ;
        }).catch((err : any) => {
          console.error('Failed to get local stream', err);
        });
      });
  }

  callTargetPeer(targetPeerId : string) : void{
    console.log("connecting to: " + targetPeerId);
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
      this.myCamFeed  = stream ;
      this.call = this.peer.call(targetPeerId, stream);
      this.call.on('stream', (remoteStream : any) => {
        this.guestCamFeed = remoteStream
        console.log(this.call);
      }
      )
    }).catch(err => console.log(err));
    
    console.log("Connection Success !");
  }

  mypeer() : void{
    console.log(this.peer);
  }

  shareMyCam() : void{
    console.log("Sharing Cam...");
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
      console.log("Got The Cam Feed !");
      //this.myCamFeed  = stream ;
    }).catch(err => console.log(err));
  }
  stopWatchingMyCam() : void {
    this.myCamFeed = null ;
  }
}
