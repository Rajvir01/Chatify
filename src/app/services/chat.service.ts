import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { addDoc, collection, Firestore, onSnapshot, orderBy, query, where } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { message } from '../model/chat.model';
// import { Observable } from 'rxjs';
// import { message } from '../model/chat.model';

const baseUrl = 'http://localhost:4200';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  selectedConversation: any;
  cmessage: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  users: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  list: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  
  constructor(private http: HttpClient, private db: Firestore) { }

getConversations(currentUserId: string){
  onSnapshot(query(collection(this.db, "conversations"), where("members", "array-contains", currentUserId)), (value) => {
    let resp = value.docs.map(e => ({
      id: e.id,
      ...e.data()
    }));
    this.list.next(resp)
    console.log(">> US", this.list.value);

  }, (error: any) => {
    console.log(error);
    console.log("dcc");
  })
}


getMessage(conv: string) {
  onSnapshot(query(
    collection(this.db, "conversations", conv, "messages"),
    orderBy("messageOn", 'asc')
  ), (value) => {
    console.log(value.docs.map(e => e.data()));
    this.cmessage.next(value.docs.map(e => ({
      id: e.id,
      ...e.data() as message
    })));
  }, (error: any) => {
    console.log(error);
  })
}

getUsers() {
  onSnapshot(query(
    collection(this.db, "users")
  ), (value) => {
    console.log(value.docs.map(e => e.data()));
    this.cmessage.next(value.docs.map(e => ({
      id: e.id,
      ...e.data() as message
    })));
  }, (error: any) => {
    console.log(error);
  })
}


}