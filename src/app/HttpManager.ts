import { Observable } from "rxjs";
import { HttpHeaders, HttpResponse, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
providedIn: 'root'
})
export class HttpManager {
    address: string = environment.API_BASE_PATH;
    headers:any;

    constructor(private http: HttpClient) { }

    // TOPIC

    getTopicsByUserId(userId): Observable<HttpResponse<any>> {
        console.log("Get Topics by user id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.address+"/v1/topic/getAllTopicsByUserId/"+userId, { headers: this.headers, observe: 'response' }) 
    }

    // NOTE

    getNotesByUserId(userId): Observable<HttpResponse<any>> {
        console.log("Get Notes by user id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.address+"/v1/note/getNotesByUserId/"+userId, { headers: this.headers, observe: 'response' }) 
    }

}