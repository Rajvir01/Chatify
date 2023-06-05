import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, doc, getDocs, orderBy, query, where } from '@angular/fire/firestore';
import { Timestamp, addDoc, collection, onSnapshot } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { conversation, message, user } from 'src/app/model/chat.model';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {

  currentUserId: string = '1';
  userList: any[] = [];
  submitted = false;


  activeConversation: { messages: any[] } = { messages: [] }

  selectedConversation: any;
  taskSub: any;

  messagesSub: Subscription | undefined;
  convSub: Subscription | undefined;
  messagesList: message[] = [];

  conversationList: conversation[] = []

  userList2: any[] = [];

  currentUser: any;
  list: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private auth: Auth, private db: Firestore, private authService: AuthService, private chatService: ChatService) { }
  ngOnInit(): void {
    this.authService.user.subscribe((value) => {
      if (value !== null) {
        this.currentUser = { ...value };
        this.chatService.getConversations(value["userId"])
        console.log(this.currentUser);
        
      }
    })

    this.convSub = this.chatService.list.subscribe((list) => {
      if (list.length !== 0) {
        this.conversationList = [...list];
        
      }
    })

  }

  async getUsers(conv: conversation){

    const filteredList = conv.members!.filter(item => item !== this.currentUser["userId"]);
    
    let queryRef = query(collection(this.db, "users"), where("userId", "==", filteredList[0]))
    let docs = (await getDocs(queryRef)).docs;
    docs.forEach((ele) => {
      this.userList2.push(Object.assign({}, ele.data() as any))
    })
    console.log(this.userList2);
    
  }


  getList(currentUserId: string) {
    this.currentUserId = currentUserId;
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

  onClick() {
  }

  logout() {
    this.auth.signOut();
    console.log("byee")

  }
  // messages: string[] = [
  //   "Hello ", 
  //   "kidaaa",
  //   "nopee"
  // ];

  newMessage(messageEvent: any) {
    let message = String(messageEvent?.target?.value ?? messageEvent.value);
    if (message.length === 0) return;
    addDoc(collection(this.db, "conversations", this.selectedConversation.chatId, "messages"), {
      ...this.selectedConversation,
      messageId: doc(collection(this.db, "conversations", this.selectedConversation.chatId, "messages")).id,
      messageOn: Timestamp.now(),
      message,
      senderId: this.currentUserId
    })
      .then(docRef => {
        this.submitted = true;
        console.log("Document has been added successfully");
      })
      .catch((error) => {
        console.log(error);
      })
    this.getMessage();
  }

  getMessage() {
    this.chatService.getMessage(this.selectedConversation['chatId']);
    this.messagesSub = this.chatService.cmessage.subscribe((list) => {
      if (list.length !== 0) {
        this.messagesList = [...list];
      }
    })

    console.log("LIST", this.messagesList)
  }


};