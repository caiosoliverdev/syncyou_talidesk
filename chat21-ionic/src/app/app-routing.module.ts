import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { ConversationListPage } from './pages/conversations-list/conversations-list.page';
// import { ConversationDetailPage } from './pages/conversation-detail/conversation-detail.page';
// import { DetailsPage } from './pages/details/details.page';


const routes: Routes = [

  { path: '', redirectTo: 'conversation-detail', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/authentication/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'conversations-list',
    // loadChildren: './pages/conversations-list/conversations-list.module#ConversationListPageModule'
    loadChildren: () => import('./pages/conversations-list/conversations-list.module').then( m => m.ConversationListPageModule)
  },
  {
    path: 'conversation-detail',
    // loadChildren: './pages/conversation-detail/conversation-detail.module#ConversationDetailPageModule'
    loadChildren: () => import('./pages/conversation-detail/conversation-detail.module').then( m => m.ConversationDetailPageModule)
  },
  {
    path: 'conversation-detail/:IDConv',
    // loadChildren: './pages/conversation-detail/conversation-detail.module#ConversationDetailPageModule'
    loadChildren: () => import('./pages/conversation-detail/conversation-detail.module').then( m => m.ConversationDetailPageModule)
  },
  { 
    path: 'conversation-detail/:IDConv/:Convtype',
    // loadChildren: './pages/conversation-detail/conversation-detail.module#ConversationDetailPageModule'
    loadChildren: () => import('./pages/conversation-detail/conversation-detail.module').then( m => m.ConversationDetailPageModule)
  },
  { 
    path: 'conversation-detail/:IDConv/:FullNameConv/:Convtype',
    // loadChildren: './pages/conversation-detail/conversation-detail.module#ConversationDetailPageModule'
    loadChildren: () => import('./pages/conversation-detail/conversation-detail.module').then( m => m.ConversationDetailPageModule)
  },
  {
    path: 'contacts-directory',
    loadChildren: () => import('./pages/contacts-directory/contacts-directory.module').then( m => m.ContactsDirectoryPageModule)
  },
  
  {
    path: 'profile-info',
    loadChildren: () => import('./pages/profile-info/profile-info.module').then( m => m.ProfileInfoPageModule)
  },
  {
    path: 'loader-preview',
    loadChildren: () => import('./modals/loader-preview/loader-preview.module').then( m => m.LoaderPreviewPageModule)
  },
  {
    path: 'unassigned-conversations',
    loadChildren: () => import('./pages/unassigned-conversations/unassigned-conversations.module').then( m => m.UnassignedConversationsPageModule)
  },
  {
    path: 'create-requester',
    loadChildren: () => import('./pages/create-requester/create-requester.module').then( m => m.CreateRequesterPageModule)
  },
  {
    path: 'create-ticket',
    loadChildren: () => import('./modals/create-ticket/create-ticket.module').then( m => m.CreateTicketPageModule)
  },
  {
    path: 'create-canned-response',
    loadChildren: () => import('./modals/create-canned-response/create-canned-response.module').then( m => m.CreateCannedResponsePageModule)
  },
  {
    path: 'send-email',
    loadChildren: () => import('./modals/send-email/send-email.module').then( m => m.SendEmailModalModule)
  },
  {
    path: 'json-message',
    loadChildren: () => import('./modals/json-message/json-message.module').then( m => m.JsonMessagePageModule)
  },
  {
    path: 'send-whatsapp-template',
    loadChildren: () => import('./modals/send-whatsapp-template/send-whatsapp-template.module').then( m => m.SendWhatsappTemplateModalModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('./modals/maps/maps.module').then( m => m.MapsPageModule)
  }

  // {
  //   path: 'conversation-detail/:IDConv',
  //   loadChildren: () => import('./pages/conversation-detail/conversation-detail.module').then( m => m.ConversationDetailPageModule)
  // },
  // {
  //   path: 'detail/:IDConv',
  //   loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule),
  //   // loadChildren: './pages/details/details.module',
  // },
  // {
  //   path: 'detail/:IDConv/:FullNameConv',
  //   loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule),
  //   // loadChildren: './pages/details/details.module',
  // },
  // {
  //   path: 'detail',
  //   loadChildren: './pages/details/details.module#DetailsPageModule'
  //   // loadChildren: () => import('./pages/details/details.module').then( m => m.DetailsPageModule),
  //   // loadChildren: './pages/details/details.module',
  // },


  // {
  //   path: 'home-info',
  //   loadChildren: () => import('./pages/home-info/home-info.module').then( m => m.HomeInfoPageModule)
  // }
];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
