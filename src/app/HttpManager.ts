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

    // USER **************************************************************************************
    
    exportNotesByUserId(userId): Observable<Blob> {
        console.log("Export notes by user id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/vnd.ms-excel', responseType: 'blob' });      
        return this.http.get<any>(this.address+"/v1/user/exportNotesByUserId/"+userId, { headers: this.headers, responseType: 'blob' as 'json' })
    }

    // TOPIC *************************************************************************************
    
    getAllTopics(): Observable<HttpResponse<any>> {
        console.log("Get all topics")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.address+"/v1/topic/getAllTopics", { headers: this.headers, observe: 'response' }) 
    }

    getTopicsByUserId(userId): Observable<HttpResponse<any>> {
        console.log("Get topics by user id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.address+"/v1/topic/getAllTopicsByUserId/"+userId, { headers: this.headers, observe: 'response' }) 
    }

    getTopicById(topicId): Observable<HttpResponse<any>> {
        console.log("Get topic by id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.address+"/v1/topic/getTopicById/"+topicId, { headers: this.headers, observe: 'response' }) 
    }

    saveTopic(body): Observable<HttpResponse<any>> {
        console.log("Save new topic")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.address+"/v1/topic/saveTopic", body, { headers: this.headers, observe: 'response' }) 
    }

    deleteTopicById(topicId): Observable<HttpResponse<any>> {
        console.log("Delete topic id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.delete<any>(this.address+"/v1/topic/deleteTopicById/"+topicId, { headers: this.headers, observe: 'response' }) 
    }

    // NOTE *************************************************************************************

    getNotesByUserId(userId): Observable<HttpResponse<any>> {
        console.log("Get notes by user id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.address+"/v1/note/getNotesByUserId/"+userId, { headers: this.headers, observe: 'response' }) 
    }

    saveNote(body): Observable<HttpResponse<any>> {
        console.log("Save new note")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(this.address+"/v1/note/saveNote", body, { headers: this.headers, observe: 'response' }) 
    }

    updateNote(noteId, body): Observable<HttpResponse<any>> {
        console.log("Update note by id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<any>(this.address+"/v1/note/updateNoteById/"+noteId, body, { headers: this.headers, observe: 'response' }) 
    }

    bulkUpdateNote(body): Observable<HttpResponse<any>> {
        console.log("Bulk update notes")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.put<any>(this.address+"/v1/note/bulkUpdateNote", body, { headers: this.headers, observe: 'response' }) 
    }

    deleteNoteById(noteId): Observable<HttpResponse<any>> {
        console.log("Delete note by note id")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.delete<any>(this.address+"/v1/note/deleteNoteById/"+noteId, { headers: this.headers, observe: 'response' }) 
    }

    searchNotes(userId, searchedText): Observable<HttpResponse<any>> {
        console.log("Search notes")
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.get<any>(this.address+"/v1/note/searchNotes/"+userId+"/"+searchedText, { headers: this.headers, observe: 'response' }) 
    }

}