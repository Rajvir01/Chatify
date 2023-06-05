import {conversation } from "./chat.model";

describe('Chat', ()=> {
    it('should create an instance', ()=>{
        expect(new conversation()).toBeTruthy();
    });
});