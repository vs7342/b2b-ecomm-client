import { AfterViewChecked, Component, ElementRef, isDevMode, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConstantsService } from '../../services/constants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { User } from '../../models/User.model';
import { ToasterComponent } from '../toaster.component';
import { Message } from '../../models/Message.model';
import { Conversation } from '../../models/Conversation.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [MessageService]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  // Logged in user details
  user_type_id = 0;
  user_id = 0;
  user_name = '';
  opposite_user_name = '';

  // Socket room details
  conversation_id = 0;
  is_other_client_connected = false;
  waiting_for_cs = false;
  url_part = '';

  // Misc
  @ViewChild(ToasterComponent) toastr: ToasterComponent;
  @ViewChild('allMessages') allMessages: ElementRef;
  message_text = '';
  messages: Message[] = [];
  sub: any;
  socket: any;
  timer: any;

  constructor(private route: ActivatedRoute, private router: Router, private messageService: MessageService) { }

  ngOnInit() {
    // Fetch logged in user details and save details in respective variables
    const user = ConstantsService.getLoggedInUser() as User;
    if (user) {
      this.user_type_id = user.UserType_id;
      this.user_id = user.id;
      this.user_name =  user.First_Name + ' ' + user.Last_Name;
    }

    // Fetch url_part from parent snapshot
    this.sub = this.route.parent.params.subscribe(params => {
      this.url_part = params['url_part'];

      // If something is wrong with the url_part, navigate to AppComponent
      if (!this.url_part) {
        this.router.navigate(['']);
      }
    });

    // Check to see if the user is already inside a conversation
    const con_id = this.messageService.getConversationId();

    // If conversation ID was found, check to see if it is valid
    if (con_id !== 0) {
      this.messageService.getConversationDetails(con_id).subscribe(data => {
        const conversation = data['data'] as Conversation;
        if (conversation.Is_Finished) {
          // Conversation is definitely invalid
          this.conversation_id = 0;
          this.messageService.removeConversationId();
        } else {
          // This means conversation is not yet finished. Join the room and fetch existing messages if any
          this.conversation_id = con_id;
          this.socketJoinRoom();
          this.getMessages();
        }
      }, error => {
        this.conversation_id = 0;
        this.messageService.removeConversationId();
      });
    } else {
      this.conversation_id = 0;
      this.messageService.removeConversationId();
    }
  }

  // This function is for the customer service role
  goOnline() {
    // API post conversation
    this.messageService.startConversation(this.user_id).subscribe(data => {

      // Conversation has been created.. save the id in local storage
      this.conversation_id = data['data']['id'];
      this.messageService.saveConversationId(this.conversation_id);

      // Join the socket room
      this.socketJoinRoom();

    }, error => {
      this.toastr.showError(error);
    });
  }

  // This function is for customer role
  onlineChat() {
    this.waiting_for_cs = true;
    this.timer = setInterval(() => {
      console.log('checkAndJoinConversation');
      this.messageService.checkAndJoinConversation(this.user_id).subscribe(data => {
        // Save the conversation ID, join the socket room, map socket event handlers and clear the interval
        if (data['data']) {
          clearInterval(this.timer);
          this.conversation_id = data['data']['Conversation_id'] as number;
          this.messageService.saveConversationId(this.conversation_id);
          this.socketJoinRoom();
        }
      }, error => {
        if (isDevMode()) {
          this.toastr.showError(error);
        }
      });
    }, 5000);
  }

  sendMessage() {
    // Validate message text
    if (this.message_text.trim().length > 0) {
      // Validation passed.. Send Message
      const created_at = (new Date()).toISOString();
      this.messageService.postMessage(new Message(
        0,
        this.conversation_id,
        this.message_text,
        (this.user_type_id === 1),
        created_at
      )).subscribe(data => {
        // Add this message to messages array
        this.messages.push(data['data']);

        // Also send message to socket room
        this.socketMessageSend(data['data'].id, this.message_text, created_at);

        // Clear the message text
        this.message_text = '';
      }, error => {
        this.toastr.showError(error);
      });
    } else {
      this.toastr.showWarning('Kindly enter text to send message.');
    }
  }

  endConversation() {
    this.messageService.endConversation(this.conversation_id).subscribe(data => {
      // Means conversation ended successfully.

      // Emit end conversation socket event
      this.socket.emit('end-conversation', {
        url_part: this.url_part,
        conversation_id: this.conversation_id
      });

      // Wrap up conversation
      this.wrapUpConversation();
    }, error => {
      this.toastr.showError(error);
    });
  }

  wrapUpConversation() {
    // Display a message
    this.toastr.showInfo('Conversation has ended.');

    // Since the conversation has ended, leave the room
    this.socketLeaveRoom();
    this.socket.destroy();

    // Reset the variables
    this.conversation_id = 0;
    this.is_other_client_connected = false;
    this.waiting_for_cs = false;
    this.messages = [];

    // Remove conversation ID from local storage
    this.messageService.removeConversationId();
  }

  getMessages() {
    // This will be called only when a conversation is not over and either of the users navigated away from this page and came back
    this.messageService.getAllMessages(this.conversation_id).subscribe(data => {
      this.messages = data['data']['conversation']['Messages'];
      const users = data['data']['users'];
      if (users[0]['id'] === this.user_id) {
        this.opposite_user_name = users[1]['First_Name'] + ' ' + users[1]['Last_Name'];
      } else {
        this.opposite_user_name = users[0]['First_Name'] + ' ' + users[0]['Last_Name'];
      }
    }, error => {
      this.toastr.showError(error);
    });
  }

  socketJoinRoom() {
    // Fetch Socket from constants
    this.socket = ConstantsService.getChatSocket();

    // Join the room
    this.socket.emit('join-room', {
      url_part: this.url_part,
      conversation_id: this.conversation_id,
      user_id: this.user_id,
      user_name: this.user_name
    });

    // Check if the other client is already inside the room
    this.messageService.getClientsInSocketRoom(this.url_part, this.conversation_id).subscribe(data => {
      if (data['data'].length === 2) {

        // This means the other client is connected.. Determine username of other client
        this.is_other_client_connected = true;
        if (data['data'][0]['user_id'] !== this.user_id) {
          this.toastr.showSuccess('You are now chatting with ' + data['data'][0]['user_name']);
        } else {
          this.toastr.showSuccess('You are now chatting with ' + data['data'][1]['user_name']);
        }
      } else {

        // This means that there is one client connected.. Check if it is not the same client who is making the request
        if (data['data'][0]['user_id'] !== this.user_id) {
          this.toastr.showSuccess('You are now chatting with ' + data['data'][0]['user_name']);
          this.is_other_client_connected = true;
        }
      }
    }, error => {
      this.toastr.showError(error);
    });

    // Since we are joining a room, map the socket event handlers as well

    this.socket.on('client-rcv-room-msg', socket_data => {
      this.socketOnMessageReceive(socket_data);
    });

    this.socket.on('client-join-room', socket_data => {
      this.socketOnClientJoinedRoom(socket_data);
    });

    this.socket.on('client-left-room', socket_data => {
      this.socketOnClientLeftRoom(socket_data);
    });

    this.socket.on('client-end-conversation', socket_data => {
      this.wrapUpConversation();
    });
  }

  socketOnClientJoinedRoom(data: any) {
    if (this.user_name !== data.user_name) {
      this.toastr.showSuccess(data.user_name + ' joined the conversation.');
      this.opposite_user_name = data.user_name;
      this.is_other_client_connected = true;
    }
  }

  socketOnClientLeftRoom(data: any) {
    if (this.user_name !== data.user_name) {
      this.toastr.showWarning(data.user_name + ' left the conversation.');
    }
  }

  socketMessageSend(message_id: number, message_text: string, created_at: string) {
    this.socket.emit('send-room-message', {
      url_part: this.url_part,
      message_id: message_id,
      conversation_id: this.conversation_id,
      message_text: message_text,
      is_from_customer: (this.user_type_id === 1),
      created_at: created_at,
      from_user_name: this.user_name
    });
  }

  socketOnMessageReceive(data: any) {
    // Add the message in the messages array
    this.messages.push(
      new Message(
        data.message_id,
        this.conversation_id,
        data.message_text,
        data.is_from_customer,
        data.created_at)
    );

    // Check if opposite user name is set.. If not, set it using the payload
    if (this.opposite_user_name.length === 0) {
      this.opposite_user_name = data.from_user_name;
    }
  }

  socketLeaveRoom() {
    this.socket.emit('leave-room', {
      url_part: this.url_part,
      conversation_id: this.conversation_id
    });
  }

  ngAfterViewChecked() {
    if (this.allMessages) {
      // Scroll to the bottom of message list
      this.allMessages.nativeElement.scrollTop = this.allMessages.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.socket.destroy();
    clearInterval(this.timer);
  }

}
