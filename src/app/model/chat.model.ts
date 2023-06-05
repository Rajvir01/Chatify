import { Timestamp } from "firebase/firestore";

export class message {
    id?: any;
    message?: string;
    messageId?: string;
    time?: Timestamp;
    senderId?: string;
    receiverId?: string;
//   static title: any;
}

export class conversation {
    chatUserId?: string;
    chatUserName?: string;
    messages?: message[];
    members?: string[];

}
export class user {
    name?: string;
}