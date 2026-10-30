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
  memberSearch = '';
  memberError = '';
  membersLoading = false;
  membersLoadError = false;
  openingChat = false;
  actionLoading = false;
  editingMessageId: number | null = null;
  editContent = '';
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

  get filteredMembers(): BuildingMemberDTO[] {
    const term = this.memberSearch.trim().toLocaleLowerCase();
    return this.members.filter((member) => `${member.fullName} ${member.buildingName || ''}`.toLocaleLowerCase().includes(term));
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
          .then(() => this.loadConversationsOnly())
          .catch(() => this.loadConversationsOnly())
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
    this.membersLoading = true;
    this.membersLoadError = false;
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
      .catch(() => { this.members = []; this.membersLoadError = true; })
      .finally(() => (this.membersLoading = false));
  }

  selectConversation(conversation: ConversationDTO) {
    if (this.activeConversation?.id !== conversation.id) this.message = '';
    this.offcanvasService.dismiss();
    this.activeConversation = conversation;
    this.messages = [];
    this.editingMessageId = null;
    this.errorMessage = '';
    this.stickToBottom = true;
    this.loadMessages();
    this.startPolling();
  }

  loadMessages() {
    if (!this.activeConversation) {
      return;
    }
    const id = this.activeConversation.id;
    this.chatService.getMessages(id).subscribe({
      next: (msgs) => {
        if (this.activeConversation?.id !== id) return;
        this.messages = msgs;
        this.bindViewportScroll();
        setTimeout(() => this.scrollToBottomIfNeeded(), 0);
      },
      error: () => { if (this.activeConversation?.id === id) this.errorMessage = 'Δεν ήταν δυνατή η φόρτωση των μηνυμάτων.'; }
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
        const id = this.activeConversation.id;
        this.chatService.getMessages(id).subscribe({
          next: (msgs) => {
            if (this.activeConversation?.id !== id || this.actionLoading) return;
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
    const id = this.activeConversation.id;
    this.chatService.sendMessage(id, content).subscribe({
      next: (saved) => {
        if (this.activeConversation?.id === id) {
          this.messages = [...this.messages.filter((m) => m.id !== saved.id), saved];
          this.message = '';
          this.errorMessage = '';
        }
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
    const id = this.activeConversation.id;
    this.chatService.sendImageMessage(id, file, caption).subscribe({
      next: (saved) => {
        if (this.activeConversation?.id === id) {
          this.messages = [...this.messages.filter((m) => m.id !== saved.id), saved];
          this.message = '';
        }
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

  startPrivateChat(userId: number, modal: { close: () => void }) {
    if (this.openingChat) return;
    this.openingChat = true;
    this.memberError = '';
    this.chatService.getOrCreatePrivateConversation(userId).subscribe({
      next: (conversation) => {
        this.openingChat = false;
        modal.close();
        this.selectConversation(conversation);
        this.refreshConversations();
      },
      error: () => { this.openingChat = false; this.memberError = 'Δεν μπορείς να ξεκινήσεις συνομιλία με αυτόν τον χρήστη.'; }
    });
  }

  hideConversation(conversation: ConversationDTO) {
    const id = conversation.id;
    if (!id || this.actionLoading || !confirm('Απόκρυψη αυτής της συνομιλίας για εσένα; Τα μηνύματα θα διατηρηθούν.')) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.chatService.hideConversation(id).subscribe({
      next: () => {
        this.actionLoading = false;
        this.conversations = this.conversations.filter((c) => c.id !== id);
        if (this.activeConversation?.id === id) {
          this.activeConversation = null;
          this.messages = [];
          this.stopPolling();
        }
        this.refreshConversations();
      },
      error: () => { this.actionLoading = false; this.errorMessage = 'Δεν ήταν δυνατή η απόκρυψη της συνομιλίας.'; }
    });
  }

  beginEdit(message: ChatMessageDTO) {
    this.editingMessageId = message.id;
    this.editContent = message.content || '';
    this.errorMessage = '';
  }

  saveEdit(message: ChatMessageDTO) {
    const id = this.activeConversation?.id;
    const content = this.editContent.trim();
    if (!id || this.actionLoading) return;
    if ((!content && !message.imageUrl) || content.length > 4000) { this.errorMessage = 'Το μήνυμα πρέπει να περιέχει έως 4000 χαρακτήρες.'; return; }
    if (!confirm('Αποθήκευση αλλαγών στο μήνυμα;')) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.chatService.editMessage(id, message.id, content).subscribe({
      next: (saved) => { this.actionLoading = false; this.applyMessage(id, saved); },
      error: () => { this.actionLoading = false; this.errorMessage = 'Δεν ήταν δυνατή η επεξεργασία του μηνύματος.'; }
    });
  }

  deleteMessage(message: ChatMessageDTO) {
    const id = this.activeConversation?.id;
    if (!id || this.actionLoading || !confirm('Διαγραφή αυτού του μηνύματος για όλους;')) return;
    this.actionLoading = true;
    this.errorMessage = '';
    this.chatService.deleteMessage(id, message.id).subscribe({
      next: (saved) => { this.actionLoading = false; this.applyMessage(id, saved); },
      error: () => { this.actionLoading = false; this.errorMessage = 'Δεν ήταν δυνατή η διαγραφή του μηνύματος.'; }
    });
  }

  private applyMessage(id: number, saved: ChatMessageDTO) {
    if (this.activeConversation?.id === id) {
      this.messages = this.messages.map((m) => m.id === saved.id ? saved : m);
      this.editingMessageId = null;
    }
    this.refreshConversations();
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
    this.memberSearch = '';
    this.memberError = '';
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
