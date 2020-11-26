import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "black-dashboard-angular";

  topics;
  
  ngOnInit() {
    // todo: servisten kullanicinin topicleri alinacak + bunu dashboard a gonder
    this.topics = [
      {
        id: "1",
        title: "topic 1"
      },
      {
        id: "2",
        title: "topic 2"
      },
      {
        id: "3",
        title: "topic 3"
      }
    ];
  }

}
