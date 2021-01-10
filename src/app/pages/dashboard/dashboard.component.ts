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
  editTopicFlag = true;
  selectedTopic:any = {};
  newTopicName: any;
  newNoteContent: any;
  searchedValue: any;
  viewedNote: any = {};
  editNoteNewValue: string = null;
  editTopicNewValue: string = null;
  editTopicNameNewValue: string = null;
  isSearchedResult:boolean = false;
  cardHeader:string = "My Notes";
  filteredTopic:any;
  editTopicNameFlag:boolean = false;

  constructor(private modalService: NgbModal,
              private toastr: ToastrService,
              private httpManager: HttpManager) {}

  ngOnInit() {
    this.init();
  }

  init() {
    console.log("init");
    console.log(environment.currentUser.token)
    this.getAllNotesByUser();
    this.getAllTopicsByUser();
  }

  getAllNotesByUser() {
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

  getAllTopicsByUser() {
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
    } else if(content._declarationTContainer.localNames[0] === "editNote") {
      this.viewedNote = note;
      this.editTopicNewValue = note.topic.topicName;
      this.editNoteNewValue = note.note;
    } /* else if(content._declarationTContainer.localNames[0] === "editTopicName") {
      this.editTopicName();
    } */
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
      } else if (reason == "delete-note") {
        this.deleteNote();
      } else if (reason == "edit-note") {
        this.editNote();
      } else if (reason == "edit-topic") {
        this.editTopicName();
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

  selectTopicForEdit(topic) {
    this.editTopicFlag = false;
    this.selectedTopic = topic;
    this.editTopicNewValue = topic.topic_name;
  }

  deselectTopicForEdit() {
    this.editTopicFlag = true;
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

  editNote() {
    console.log("edit note");
    if(this.editTopicFlag) {
      if (this.editTopicNewValue == undefined || this.editTopicNewValue.trim().length == 0) {
        alert("Please enter a valid topic name");
      } else {
        this.checkTopicIsOccur(this.editTopicNewValue).then(
          (res) => {
            if (this.editTopicNewValue == this.viewedNote.topic.topicName) {
              this.updateNote(false);
            } else {
              this.updateNote(true, true, res);
            }
          }, (err) => {
            this.updateNote(true);
          }
        );
      }
    } else {
      if (this.editTopicNewValue == this.viewedNote.topic.topicName) {
        this.updateNote(false);
      } else {
        this.topics.forEach(element => {
          if (element.topic_name === this.editTopicNewValue.trim()) {
            this.updateNote(true, true, element.topic_id);
          }
        });
      }
    }
  }

  updateNote(isTopicChanged:boolean, isTopicOccuredBefore:boolean=false, topicId?) {
    if (isTopicChanged) {
      if (!isTopicOccuredBefore) {
        var obj = {
          topic_name: this.editTopicNewValue.trim()
        };
        this.httpManager.saveTopic(obj).subscribe(
          (res) => {
            console.log(res);
            this.selectedTopic = res.body;
            var updNoteObj = {
              note: this.editNoteNewValue,
              topic_id: res.body.topic_id
            };
            this.httpManager.updateNote(this.viewedNote.id, updNoteObj).subscribe(
              (res) => {
                console.log(res);
                this.getAllNotesByUser();
                this.getAllTopicsByUser();
              }, (err) => {
                console.log("[ERROR] Note couldn't be updated");
              }
            );
          },
          (err) => {
            this.selectedTopic = null;
            console.log("[ERROR] save topic service");
            alert("Topic couldn't saved, please try again later");
          }
        );
      } else {
        var updNoteObj = {
          note: this.editNoteNewValue,
          topic_id: topicId
        };
        this.httpManager.updateNote(this.viewedNote.id, updNoteObj).subscribe(
          (res) => {
            console.log(res);
            this.getAllNotesByUser();
            this.getAllTopicsByUser();
          }, (err) => {
            console.log("[ERROR] Note couldn't be updated");
          }
        );
      }
    } else {
      var updNoteObj = {
        note: this.editNoteNewValue,
        topic_id: this.viewedNote.topic.topicId
      };
      this.httpManager.updateNote(this.viewedNote.id, updNoteObj).subscribe(
        (res) => {
          console.log(res);
          this.getAllNotesByUser();
          this.getAllTopicsByUser();
        }, (err) => {
          console.log("[ERROR] Note couldn't be updated");
        }
      );
    }
  }

  newTopic() {
    return new Promise((resolve, reject) => {
      if (this.newTopicName == undefined || this.newTopicName.trim().length == 0) {
        alert("Please enter a valid topic name");
        reject();
      } else {
        this.checkTopicIsUsed(this.newTopicName).then((res) => {
          this.checkTopicIsOccur(this.newTopicName).then(
            (id) => { // means this topic is not used by the user but it exists in db
              this.httpManager.getTopicById(id).subscribe(
                (res) => {
                  this.selectedTopic = res.body;
                  resolve(this.selectedTopic);
                }, (err) => {
                  console.log("[ERROR] Get topic by Id")
                }
              );
            }, (err) => { // means this topic does not exist in db
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
            }
          );
        }, (err) => {
          alert(err);
          reject();
        });
      }
    });
  }

  // check the topic is used by current user
  checkTopicIsUsed(topic) {
    return new Promise((resolve, reject) => {
      this.topics.forEach(element => {
        if (element.topic_name === topic.trim()) {
          console.log("This topic is already exist");
          reject(element.topic_id);
        }
      });
      resolve("ok");
    });
  }

  // Check topic is generated in db
  checkTopicIsOccur(topic) {
    return new Promise((resolve, reject) => {
      this.getAllTopics().then(
        (res) => {
          console.log(res);
          res.forEach(element => {
            if (element.topic_name == topic) {
              resolve(element.topic_id)
            }
          });
          reject();
        }
      );
    });
  }

  getAllTopics():any {
    return new Promise((resolve, reject) => {
      this.httpManager.getAllTopics().subscribe(
        (res) => {
          resolve(res.body);
        }, (err) => {
          console.log("[ERROR] All topics couldn't get");
          reject();
        }
      );
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
          this.getAllTopicsByUser();
          this.getAllNotesByUser();
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
    if (this.searchedValue == undefined || this.searchedValue.trim().length == 0) {
      alert("Please enter a valid text");
    } else {
      this.httpManager.searchNotes(environment.currentUser.userId, this.searchedValue).subscribe(
        (res) => {
          this.showedNotes = res.body;
          this.isSearchedResult = true;
        }, (err) => {
          console.log(err);
        }
      );
    }
  }

  filterTopic(topic) {
    this.isSearchedResult = false;
    this.filteredTopic = topic;
    this.editTopicNameNewValue = topic.topic_name;
    // todo bunu servisten alacak sekilde de duzenleyebilirim ??? servisten alacak sekilde duzenle
    if (topic == undefined) {
      this.cardHeader = "My Notes";
      this.editTopicNameFlag = false;
      this.cloneNotes();
    } else {
      this.editTopicNameFlag = true;
      this.cardHeader = topic.topic_name;
      var j = 0
      this.showedNotes = [];
      for(var i=0; i<this.notes.length; i++) {
        if (this.notes[i].topic.topicId == topic.topic_id) {
          this.showedNotes[j] = JSON.parse(JSON.stringify(this.notes[i]));
          j++;
        }
      }
    }
  }

  editTopicName() {
    console.log(this.filteredTopic);
    console.log(this.editTopicNameNewValue);
    if (this.editTopicNameNewValue == undefined || this.editTopicNameNewValue.trim().length == 0) {
      alert("Please enter a valid topic name");
    } 
    // todo: error check - bu userin notlarindaki topiclerden birisinin adini giremez
    // tum topicler arasinda boyle bi topic varsa o topic id ye dokunulmamasi lazim
    // yeni topic olusturulmali ve baglantili tum notlar bu yeni olusturulan topicle bagdastirilmali
  }

  deleteNote() {
    this.httpManager.deleteNoteById(this.viewedNote.id).subscribe(
      (res) => {
        this.getAllNotesByUser();
        this.getAllTopicsByUser();
      }, (err) => {
        console.log("[ERROR] delete note service");
      }
    );
  }
  
}
