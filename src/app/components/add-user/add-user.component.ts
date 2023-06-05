import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, doc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { user } from 'src/app/model/chat.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  user: user = {
    name: ''
  };
  submitted: boolean = false
  currentUser: any;    

  constructor(
    private chatService: ChatService,
    private db: Firestore,
    private location: Location,
    private auth: AuthService
  ) { }

  async saveUser() {
    const resp = await getDocs(query(collection(this.db, 'users'), where("username", "==", this.user.name)))
    if (resp.size == 0) {
      console.log("no user found");                                                                                                       
    } else {
      let data = resp.docs.map(e => e.data())[0];
      let currentUser = this.auth.user.value;
      const chatObj =  {
        chatId: doc(collection(this.db, "conversations")).id,
        chatUserName: data['username'],
        chatUserId: data['userId'],
        userId: currentUser['userId'],
        addedOn: Timestamp.now(),
        members: [data['userId'], currentUser['userId']]
      }
     
      let chatDocRef = doc(this.db, "conversations", chatObj.chatId)
      await setDoc(chatDocRef, { ...chatObj })
      this.location.back()
    }
  };
}
