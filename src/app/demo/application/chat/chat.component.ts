// angular import
import { Component, OnDestroy, OnInit, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';
import { ChatService } from 'src/app/theme/shared/service/chat.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { BuildingMemberService } from 'src/app/theme/shared/service/buildingMember.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { environment } from 'src/environments/environment';
import { ConversationDTO } from 'src/app/theme/shared/models/conversationDTO';
import { ChatMessageDTO } from 'src/app/theme/shared/models/chatMessageDTO';
import { BuildingMemberDTO } from 'src/app/theme/shared/models/BuildingMemberDTO';

// bootstrap import
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CheckCircleFill,
  ClockCircleFill,
  InfoCircleOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  MinusCircleFill,
  MoreOutline,
  PhoneOutline,
  SearchOutline,
  VideoCameraOutline,
  CheckOutline,
  LogoutOutline,
  SettingOutline,
  RightOutline,
  CloseOutline,
  MessageOutline,
  FolderOpenOutline,
  LinkOutline,
  FileDoneOutline,
  PictureOutline,
  FileSyncOutline,
  EditOutline,
  SmileOutline,
  PaperClipOutline,
  SoundOutline,
  SendOutline,
  BackwardOutline,
  ForwardOutline,
  CopyOutline,
  DeleteOutline,
  DownOutline,
  PlusOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, SharedModule, ScrollbarComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  private offcanvasService = inject(NgbOffcanvas);
  private iconService = inject(IconService);
  private modalService = inject(NgbModal);
  private chatService = inject(ChatService);
  private buildingService = inject(BuildingService);
  private buildingMemberService = inject(BuildingMemberService);
  private authService = inject(AuthenticationService);

  // Private props
  isCollapsed = false;
  listIsCollapsed = false;
  infoCollapsed = false;
  membersCollapsed = false;
  status: string = 'active';
  message: string = '';
  errorMessage: string = '';
  searchTerm: string = '';
  emojiPanelVisible = false;
  emojis = ['😀', '😁', '😂', '😊', '😍', '😘', '😎', '🤔', '😢', '😡', '👍', '👎', '👏', '🙏', '💪', '🔥', '❤️', '💔', '🎉', '✅', '❌', '⚠️', '☕', '🏠', '🔑', '📅', '💰', '🙂']; 
  conversations: ConversationDTO[] = [];
  activeConversation: ConversationDTO | null = null;
  messages: ChatMessageDTO[] = [];
  members: BuildingMemberDTO[] = [];
  loading = false;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private stickToBottom = true;
  private viewportScrollBound = false;

  defaultAvatar = 'assets/images/user/avatar-1.jpg';

  // constructor
  constructor() {
    this.iconService.addIcon(
      ...[
        MenuFoldOutline,
        CheckOutline,
        MenuUnfoldOutline,
        PhoneOutline,
        VideoCameraOutline,
        InfoCircleOutline,
        MoreOutline,
        CheckCircleFill,
        SearchOutline,
        ClockCircleFill,
        MinusCircleFill,
        LogoutOutline,
        SettingOutline,
        RightOutline,
        CloseOutline,
        PhoneOutline,
        MessageOutline,
        FolderOpenOutline,
        LinkOutline,
        FileDoneOutline,
        PictureOutline,
        FileSyncOutline,
        MoreOutline,
        EditOutline,
        SmileOutline,
        PaperClipOutline,
        SoundOutline,
        SendOutline,
        BackwardOutline,
        ForwardOutline,
        CopyOutline,
        DeleteOutline,
        DownOutline,
        PlusOutline
      ]
    );
  }

  get myName(): string {
    const user = this.authService.currentUserValue;
    return user ? `${user.firstName} ${user.lastName}` : 'Εγώ';
  }

  get myAvatar(): string {
    const user = this.authService.currentUserValue;
    return this.imgSrc(user?.profileImageUrl);
  }

  get filteredConversations(): ConversationDTO[] {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      return this.conversations;
    }
    const term = this.searchTerm.trim().toLowerCase();
    return this.conversations.filter((c) => c.name.toLowerCase().includes(term));
  }

  // life cycle hook
  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  init() {
    this.loading = true;
    this.buildingService.getMyBuildings().subscribe({
      next: (buildings) => {
        const groupChats = buildings.map((b) => firstValueFrom(this.chatService.getOrCreateBuildingConversation(b.id)));
        Promise.all(groupChats)
          .then(() => this.chatService.getConversations().subscribe({ next: (convs) => this.setConversations(convs) }))
          .finally(() => {
            this.loading = false;
            this.loadMembers(buildings.map((b) => b.id));
          });
      },
      error: () => {
        this.loading = false;
        this.loadConversationsOnly();
      }
    });
  }

  loadConversationsOnly() {
    this.chatService.getConversations().subscribe({
      next: (convs) => this.setConversations(convs),
      error: () => (this.loading = false)
    });
  }

  setConversations(convs: ConversationDTO[]) {
    this.conversations = convs;
    this.loading = false;
    if (this.activeConversation) {
      const match = this.conversations.find((c) => c.id === this.activeConversation!.id);
      if (match) {
        this.activeConversation = match;
      }
    }
    if (!this.activeConversation && this.conversations.length > 0) {
      this.selectConversation(this.conversations[0]);
    }
  }

  loadMembers(buildingIds: number[]) {
    const memberCalls = buildingIds.map((id) => firstValueFrom(this.buildingMemberService.getMembersByBuilding(id)));
    Promise.all(memberCalls)
      .then((lists) => {
        const currentUser = this.authService.currentUserValue;
        const map = new Map<number, BuildingMemberDTO>();
        lists.forEach((list) =>
          list.forEach((m) => {
            if (m.userId && m.userId !== currentUser?.id) {
              map.set(m.userId, m);
            }
          })
        );
        this.members = Array.from(map.values());
      })
      .catch(() => (this.members = []));
  }

  selectConversation(conversation: ConversationDTO) {
    this.activeConversation = conversation;
    this.errorMessage = '';
    this.stickToBottom = true;
    this.loadMessages();
    this.startPolling();
  }

  loadMessages() {
    if (!this.activeConversation) {
      return;
    }
    this.chatService.getMessages(this.activeConversation.id).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.bindViewportScroll();
        setTimeout(() => this.scrollToBottomIfNeeded(), 0);
      },
      error: () => (this.messages = [])
    });
  }

  refreshConversations() {
    this.chatService.getConversations().subscribe({
      next: (convs) => {
        const activeId = this.activeConversation?.id;
        this.conversations = convs;
        if (activeId) {
          const match = this.conversations.find((c) => c.id === activeId);
          if (match) {
            this.activeConversation = match;
          }
        }
      }
    });
  }

  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      if (this.activeConversation) {
        this.chatService.getMessages(this.activeConversation.id).subscribe({
          next: (msgs) => {
            this.messages = msgs;
            setTimeout(() => this.scrollToBottomIfNeeded(), 0);
          }
        });
        this.refreshConversations();
      }
    }, 5000);
  }

  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  sendMessage() {
    if (!this.activeConversation) {
      return;
    }
    const content = this.message.trim();
    if (!content) {
      this.errorMessage = 'Γράψε ένα μήνυμα για να το στείλεις.';
      return;
    }
    this.chatService.sendMessage(this.activeConversation.id, content).subscribe({
      next: (saved) => {
        this.messages = [...this.messages, saved];
        this.message = '';
        this.errorMessage = '';
        setTimeout(() => this.scrollToBottomIfNeeded(), 0);
        this.refreshConversations();
      },
      error: () => (this.errorMessage = 'Δεν στάλθηκε το μήνυμα. Προσπάθησε ξανά.')
    });
  }

  toggleEmojiPanel() {
    this.emojiPanelVisible = !this.emojiPanelVisible;
  }

  addEmoji(emoji: string) {
    this.message = (this.message || '') + emoji;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    input.value = '';
    if (!file || !this.activeConversation) {
      return;
    }
    const caption = this.message?.trim() || '';
    this.loading = true;
    this.chatService.sendImageMessage(this.activeConversation.id, file, caption).subscribe({
      next: (saved) => {
        this.messages = [...this.messages, saved];
        this.message = '';
        this.loading = false;
        this.errorMessage = '';
        setTimeout(() => this.scrollToBottomIfNeeded(), 0);
        this.refreshConversations();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Δεν στάλθηκε η φωτογραφία. Προσπάθησε ξανά.';
      }
    });
  }

  startPrivateChat(userId: number) {
    this.chatService.getOrCreatePrivateConversation(userId).subscribe({
      next: (conversation) => {
        const existing = this.conversations.find((c) => c.id === conversation.id);
        if (!existing) {
          this.conversations = [conversation, ...this.conversations];
        }
        this.selectConversation(conversation);
      },
      error: () => (this.errorMessage = 'Δεν μπορείς να ξεκινήσεις συνομιλία με αυτόν τον χρήστη.')
    });
  }

  conversationAvatar(conversation: ConversationDTO): string {
    return this.imgSrc(conversation.avatar);
  }

  imgSrc(url?: string | null): string {
    if (!url) {
      return this.defaultAvatar;
    }
    const cleanUrl = url.trim().replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    if (cleanUrl.startsWith('/uploads/')) {
      return `${environment.apiUrl}${cleanUrl}`;
    }
    if (cleanUrl.startsWith('uploads/')) {
      return `${environment.apiUrl}/${cleanUrl}`;
    }
    return cleanUrl;
  }

  conversationTypeLabel(conversation: ConversationDTO): string {
    return conversation.type === 'BUILDING' ? 'Ομαδική' : 'Προσωπική';
  }

  truncatePreview(text: string, max = 12): string {
    if (!text) {
      return '';
    }
    return text.length > max ? text.slice(0, max) + '…' : text;
  }

  formatTime(iso: string): string {
    if (!iso) {
      return '';
    }
    const date = new Date(iso);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private getMessageViewport(): HTMLElement | null {
    return document.querySelector<HTMLElement>('.chat-message .ng-scroll-viewport');
  }

  private bindViewportScroll() {
    if (this.viewportScrollBound) {
      return;
    }
    const viewport = this.getMessageViewport();
    if (!viewport) {
      return;
    }
    this.viewportScrollBound = true;
    viewport.addEventListener('scroll', () => {
      const remaining = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      this.stickToBottom = remaining < 60;
    });
  }

  scrollToBottomIfNeeded() {
    const viewport = this.getMessageViewport();
    if (!viewport || !this.stickToBottom) {
      return;
    }
    viewport.scrollTop = viewport.scrollHeight;
  }

  userStatus(status: string) {
    this.status = status;
  }

  open(userList: TemplateRef<string>) {
    this.offcanvasService.open(userList, { position: 'start' });
  }
  openInfo(info: TemplateRef<string>) {
    this.offcanvasService.open(info, { position: 'end' });
  }
  openNewChat(content: TemplateRef<string>) {
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  icon_list = [
    {
      icon: 'phone'
    },
    {
      icon: 'message'
    },
    {
      icon: 'video-camera'
    }
  ];
}
