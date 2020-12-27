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
    console.log(localStorage.getItem('currentUser'))
    console.log(environment.currentUser)
    this.getAllNotes();
    this.getAllTopics();
  }

  getAllNotes() {
    this.httpManager.getNotesByUserId(environment.currentUser.userId).subscribe(
      (res) => {
        console.log(res);
        this.notes = res.body;
        this.cloneNotes();
      }, (err) => {
        console.log(err);
      }
    );
    // todo call service and get all notes
    /* this.notes = [
      {
        noteId: 1,
        topic: "topic 1",
        topicId: 1,
        content: "Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum"
      },
      {
        noteId: 2,
        topic: "topic 2 topic 2 topic 2 topic 2 topic 2 topic 2 topic 2",
        topicId: 2,
        content: "Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum"
      },
      {
        noteId: 3,
        topic: "topic 3",
        topicId: 3,
        content: "Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum, Lorem ipsum"
      }, 
      {
        noteId: 4,
        topic: "spring framework",
        topicId: 4,
        content: "Loose coupling / high cohesion"
      }
    ]; */
    
  }

  cloneNotes() {
    this.showedNotes = JSON.parse(JSON.stringify(this.notes)); // clone array
  }

  getAllTopics() {
    this.httpManager.getTopicsByUserId("d1db8910-b3ec-4922-8776-1f18f94cd398").subscribe(
      (res) => {
        console.log(res);
        this.topics = res.body;
      }, (err) => {
        console.log(err);
      }
    );
    // todo call service and get all topics
    /* this.topics = [
      {
        id: "1",
        topic: "topic 1"
      },
      {
        id: "2",
        topic: "topic 2 topic 2 topic 2 topic 2 topic 2 topic 2 topic 2"
      },
      {
        id: "3",
        topic: "topic 3"
      },
      {
        id: "4",
        topic: "spring framework"
      }
    ]; */
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
          var id = this.topics.length+1; // todo id convert to the uuid
          var obj = {
            id: id.toString(),
            topic: this.newTopicName.trim()
          };
          this.selectedTopic = obj;
          resolve();
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
        if (element.topic === this.newTopicName.trim()) {
          console.log("!!!!!!!!!!!!!!!!!!!!!!")
          reject("This topic is already exists");
        }
      });
      resolve();
    });
  }

  newNote() {
    if (this.newNoteContent == undefined || this.newNoteContent.trim().length == 0) {
      alert("Please enter a valid note");
    } else {
      console.log("new note");
      console.log(this.newNoteContent);
      console.log(this.selectedTopic);
      if (this.addTopicFlag) {
        this.topics.push(this.selectedTopic); // todo topics servise post attiktan sonra return den gelsin
        // todo call servis update topics
      }
      
      var newNote = {
        noteId: this.showedNotes.length+1,
        topic: this.selectedTopic.topic,
        topicId: this.selectedTopic.id,
        content: this.newNoteContent
      };
      // todo call service add new note
      this.notes.push(newNote);
      this.showedNotes.push(newNote);

      this.showNotification('bottom', 'right', this.selectedTopic.topic, this.newNoteContent);
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
      console.log(topic);
      var j = 0
      this.showedNotes = [];
      for(var i=0; i<this.notes.length; i++) {
        if (this.notes[i].topicId == topic.id) {
          this.showedNotes[j] = JSON.parse(JSON.stringify(this.notes[i]));
          j++;
        }
      }
    }
    console.log(this.showedNotes)
  }
  
}
