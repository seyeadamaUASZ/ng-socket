
import { Component, OnInit,Renderer2, ElementRef  } from '@angular/core';
import { FileServiceService } from './services/file-service.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  files:any;
  fileIndex:any;
  ws: any;
  name!: string;
  disabled!: boolean;

  constructor(private fileService:FileServiceService){

  }
 
  title = 'poc-ngrx';

  ngOnInit(): void {
    this.loadFiles();
    this.connect();
   
  }

  loadFiles(){
    this.fileService.loadFiles(37)
    .subscribe({
      next:resp=>{
        if(resp.status==="SUCCESS"){
          this.files= resp.results;
          this.fileIndex = this.files[0]
          console.log("files  .."+JSON.stringify(this.files))
        }
      }
    })
  }

  connect(){
    let socket = new WebSocket("ws://localhost:9090/senico");
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect({}, function(frame:any) {
      that.ws.subscribe("/errors", function(message:any) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/topic/reply", function(result:any) {
        that.checkFileNext(result);
       
       
      });
      that.disabled = true;
    }, function(error:any) {
      alert("STOMP error " + error);
    });
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    this.setConnected(false);
    console.log("Disconnected");
  }

  nextFile(num:any){
   
    let object={
      numero:37,
      nextValue:num
    }
    this.ws.send("/app/display",{},JSON.stringify(object))
  }

  setConnected(connected:any) {
    this.disabled = connected;
    //this.showConversation = connected;
    //this.greetings = [];
  }

  checkFileNext(result:any){
    console.log("parsing  ..."+result)
    let object = JSON.parse(result?.body);
    this.fileIndex = object;
  }
}
