import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpManager } from "src/app/HttpManager";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  
  closeResult: string;

  notes:any = [];
  topics:any =[];
  showedNotes:any = [];
  addTopicFlag = false;
  selectedTopic:any = {};
  newTopicName: any;
  newNoteContent: any;
  searchedValue: any;
  viewedNote: any = {};

  constructor(private modalService: NgbModal,
              private toastr: ToastrService,
              private httpManager: HttpManager) {}

  ngOnInit() {
    this.init();
  }

  init() {
    console.log("init");
    console.log(environment.currentUser.token)
    this.getAllNotes();
    this.getAllTopics();
  }

  getAllNotes() {
    this.httpManager.getNotesByUserId(environment.currentUser.userId).subscribe(
      (res) => {
        this.notes = res.body;
        console.log(this.notes);
        this.cloneNotes();
      }, (err) => {
        console.log(err);
      }
    );
  }

  cloneNotes() {
    this.showedNotes = JSON.parse(JSON.stringify(this.notes)); // clone array
  }

  getAllTopics() {
    this.httpManager.getTopicsByUserId(environment.currentUser.userId).subscribe(
      (res) => {
        this.topics = res.body;
        console.log(this.topics);
      }, (err) => {
        console.log(err);
      }
    );
  }

  open(content, note) {
    if (content._declarationTContainer.localNames[0] === "displayNote") {
      this.viewedNote = note;
    }
    this.modalService.open(content, {windowClass: 'modal-search'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      if (reason == "save-note") {
        this.addNote();
      } else if (reason == "search") {
        this.search();
      }
      return  `with: ${reason}`;
    }
  }

  convertTopicFlag() {
    this.addTopicFlag = true;
  }

  selectTopic(topic) {
    this.addTopicFlag = false;
    this.selectedTopic = topic;
  }

  addNote() {
    console.log("add note");
    if (this.addTopicFlag) {
      this.newTopic().then((res) => {
        this.newNote();
      }, (err) => {
        console.log("Oops! Topic error");
      });
    } else {
      this.newNote();
    }
  }

  newTopic() {
    return new Promise((resolve, reject) => {
      if (this.newTopicName == undefined || this.newTopicName.trim().length == 0) {
        alert("Please enter a valid topic name");
        reject();
      } else {
        this.checkTopicIsOccur().then((res) => {
          var obj = {
            topic_name: this.newTopicName.trim()
          };
          this.httpManager.saveTopic(obj).subscribe(
            (res) => {
              console.log(res);
              this.selectedTopic = res.body;
              resolve(this.selectedTopic);
            },
            (err) => {
              console.log("[ERROR] save topic service")
            }
          );
        }, (err) => {
          alert(err);
          reject();
        });
      }
    });
  }

  checkTopicIsOccur() {
    return new Promise((resolve, reject) => {
      this.topics.forEach(element => {
        console.log(element)
        if (element.topic_name === this.newTopicName.trim()) {
          console.log("[ERROR] This topic is already exist");
          reject("This topic is already exists");
        }
      });
      resolve("ok");
    });
  }

  newNote() {
    if (this.newNoteContent == undefined || this.newNoteContent.trim().length == 0) {
      if (this.addTopicFlag) {
        this.httpManager.deleteTopicById(this.selectedTopic.topic_id).subscribe(
          (err) => {
            // todo: event listener ekleyip buradan bu topic delete edilemedi seklinde event firlatilabilir
          }
        );
      }
      alert("Please enter a valid note");
    } else {
      console.log("new note");
      var newNote = {
        user_id: environment.currentUser.userId,
        topic_id: this.selectedTopic.topic_id,
        note: this.newNoteContent
      };
      this.httpManager.saveNote(newNote).subscribe(
        (res) => {
          console.log(res);
          this.getAllTopics();
          this.getAllNotes();
        }, 
        (err) => {
          console.log("[ERROR] save note service");
        }
      );
      this.showNotification('bottom', 'right', this.selectedTopic.topic_name, this.newNoteContent);
    }
  }

  showNotification(from, align, topic, msg){
    this.toastr.success('<span class="tim-icons icon-check-2" [data-notify]="icon"></span><b>' + topic +'</b> - ' + msg + '', '', {
      disableTimeOut: true,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-success alert-with-icon",
      positionClass: 'toast-' + from + '-' +  align
    });
  }

  search() {
    console.log(this.searchedValue);
    // todo call search service
  }

  filterTopic(topic) {
    // todo bunu servisten alacak sekilde de duzenleyebilirim ??? servisten alacak sekilde duzenle
    if (topic == undefined) {
      console.log("all selected");
      this.cloneNotes();
    } else {
      var j = 0
      this.showedNotes = [];
      for(var i=0; i<this.notes.length; i++) {
        if (this.notes[i].topic.topicId == topic.topic_id) {
          this.showedNotes[j] = JSON.parse(JSON.stringify(this.notes[i]));
          j++;
        }
      }
    }
    console.log(this.showedNotes)
  }
  
}
