import { Component, ViewChild, ElementRef } from '@angular/core';
import { messages } from './chat-data';
import { UserAuthService } from '../../../services/user-auth.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class AppChatComponent {
  sidePanelOpened = true;
  msg = '';
  currentUser: any;
  // MESSAGE
  selectedMessage: any;

  public messages: Array<any> = messages;
  // tslint:disable-next-line - Disables all
  // messages: Object[] = messages;

  constructor(public userService: UserAuthService) {
    this.selectedMessage = this.messages[0];
  }

  @ViewChild('myInput', { static: true }) myInput: ElementRef =
    Object.create(null);

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }
  ngOnInit(): void { 
    this.currentUser =this.userService.getUser();}
  // tslint:disable-next-line - Disables all
  onSelect(message: Object[]): void {
    this.selectedMessage = message;
  }

  OnAddMsg(): void {
    this.msg = this.myInput.nativeElement.value;

    if (this.msg !== '') {
      this.selectedMessage.chat.push({
        type: 'even',
        msg: this.msg,
        date: new Date(),
      });
    }

    this.myInput.nativeElement.value = '';
  }
}
