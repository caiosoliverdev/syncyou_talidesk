import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Globals } from 'src/app//utils/globals';
import { AppConfigService } from 'src/app/providers/app-config.service';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
import { LoggerInstance } from 'src/chat21-core/providers/logger/loggerInstance';
import { convertColorToRGBA } from 'src/chat21-core/utils/utils';

@Component({
  selector: 'chat-conversation-header',
  templateUrl: './conversation-header.component.html',
  styleUrls: ['./conversation-header.component.scss']
})
export class ConversationHeaderComponent implements OnInit, OnChanges {

  // ========= begin:: Input/Output values
  @Input() idConversation: string;
  @Input() senderId: string;
  @Input() soundEnabled: boolean;
  @Input() isMenuShow: boolean;
  @Input() isTypings: boolean;
  @Input() nameUserTypingNow: string;
  @Input() typingLocation: string;
  @Input() isTrascriptDownloadEnabled: boolean;
  @Input() hideCloseConversationOptionMenu: boolean;
  @Input() hideRestartConversationOptionsMenu: boolean;
  @Input() hideHeaderCloseButton: boolean;
  @Input() hideHeaderBackButton: boolean;
  @Input() hideHeaderConversationOptionsMenu: boolean;
  @Input() hideSignOutOptionMenu: boolean;
  @Input() windowContext;
  @Input() stylesMap: Map<string, string>
  @Input() translationMap: Map< string, string>;
  @Input() widgetTitle: string;
  @Input() build_version: string;
  @Output() onBack = new EventEmitter();
  @Output() onCloseWidget = new EventEmitter();
  @Output() onSoundChange = new EventEmitter();
  @Output() onCloseChat =  new EventEmitter();
  @Output() onRestartChat =  new EventEmitter();
  @Output() onWidgetHeightChange = new EventEmitter<string>();
  @Output() onSignOut = new EventEmitter();
  @Output() onMenuOptionShow = new EventEmitter();
  // ========= end:: Input/Output values

  // ============ BEGIN: SET FUNCTION BY UTILS ==============//
  convertColorToRGBA = convertColorToRGBA;
  // ============ BEGIN: SET INTERNAL PARAMETERS ==============//
  
  isButtonsDisabled = true;
  
  public isDirect = false;
  public writingMessage: string;

  subscriptions = [];
  
  membersConversation = ['SYSTEM'];
  heightStatus: string = 'min'


  private API_URL: string;
  private logger: LoggerService = LoggerInstance.getInstance()
  constructor(
    public g: Globals,
    public appConfigService: AppConfigService,) {
      this.API_URL = this.appConfigService.getConfig().apiUrl;
     }

  ngOnInit() {
    this.logger.debug('[CONV-HEADER] ngOnInit: conversation-header COMPONENT ', this.translationMap);
    this.membersConversation.push(this.senderId)
    //this.initializeTyping();
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['idConversation'] && changes['idConversation'].currentValue !== undefined){
      this.logger.debug('[CONV-HEADER] onChanges -- Conversation-header.component-> start initializeTyping()', this.idConversation)
      // this.initializeTyping();
    }
  }

  ngAfterViewInit() {
    this.logger.debug('[CONV-HEADER] --------ngAfterViewInit: conversation-header-------- ');
    this.isButtonsDisabled = false;
  }

  // =========== BEGIN: event emitter function ====== //
  returnHome() {
    this.onBack.emit();
  }

  closeChat(){
    this.onCloseChat.emit();
  }

  restartChat(){
    this.onRestartChat.emit();
    this.onMenuOptionShow.emit(false)
  }

  closeWidget() {
    this.onCloseWidget.emit();
  }
  // =========== END: event emitter function ====== //

  dowloadTranscript() {
    const url = this.API_URL + 'public/requests/' + this.idConversation + '/messages-user.html';
    const windowContext = this.windowContext;
    windowContext.open(url, '_blank');
    this.onMenuOptionShow.emit(false)
  }
  
  toggleSound() {
    this.onMenuOptionShow.emit(false)
    this.onSoundChange.emit(!this.soundEnabled)
  }

  signOut(){
    this.onSignOut.emit(true)
  }

  toggleMenu() {
    this.onMenuOptionShow.emit(!this.isMenuShow)
  }

  /**
   * 
   * @param status : string 'max' || 'min'
   */
  maximizeMinimize(status){
    this.heightStatus = status
    this.onWidgetHeightChange.emit(status)
  }




  // ========= begin:: DESTROY ALL SUBSCRIPTIONS ============//
  /**
   * elimino tutte le sottoscrizioni
   */
  ngOnDestroy() {
    this.logger.debug('[CONV-HEADER] ngOnDestroy ------------------> this.subscriptions', this.subscriptions);
    this.unsubescribeAll()
  }

  /** */
  private unsubescribeAll() {
    this.logger.debug('[CONV-HEADER] unsubescribeAll: ', this.subscriptions);
    this.subscriptions.forEach((subscription: any) => {
      this.logger.debug('[CONV-HEADER] unsubescribe: ', subscription);
      subscription.value.unsubscribe();
    });
    this.subscriptions.length = 0;
    this.subscriptions = [];
  }
  // ========= end:: DESTROY ALL SUBSCRIPTIONS ============//


}
