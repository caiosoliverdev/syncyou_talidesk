import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
// services
import { NotificationsService } from '../abstract/notifications.service';
import { LoggerInstance } from '../logger/loggerInstance';
import { LoggerService } from 'src/chat21-core/providers/abstract/logger.service';
// firebase
// import * as firebase from 'firebase/app';
import firebase from "firebase/app";
import 'firebase/messaging';
import 'firebase/auth';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';

@Injectable({ providedIn: 'root' })

export class FirebaseNotifications extends NotificationsService {

    private FCMcurrentToken: string;
    private userId: string;
    private tenant: string;
    private vapidkey: string;
    private platform: string;
    private logger: LoggerService = LoggerInstance.getInstance();
    constructor(private fcm: FCM) {
        super();
    }

    initialize(tenant: string, vapId: string, platform: string): void {
        this.tenant = tenant
        this.vapidkey = vapId
        platform === 'desktop'? this.platform = 'ionic' : this.platform = platform
        this.logger.log('[FIREBASE-NOTIFICATIONS] initialize - tenant ', this.tenant, this.platform)

        if (!('serviceWorker' in navigator)) {
            // , disable or hide UI.
            this.logger.error("[FIREBASE-NOTIFICATIONS] initialize - Service Worker isn't supported on this browser", navigator)
            return;
        }
        // if (('serviceWorker' in navigator)) {
        //     navigator.serviceWorker.register('firebase-messaging-sw.js')
        //         .then(function (registration) {
        //             console.log('[FIREBASE-NOTIFICATIONS] initialize serviceWorker Registration successful, scope is:', registration.scope);


        //             // this.logger.log("[FIREBASE-NOTIFICATIONS] initialize - Service Worker is supported on this browser ", navigator)
        //             // navigator.serviceWorker.getRegistrations().then((serviceWorkerRegistrations) => {
        //             //     this.logger.log("[FIREBASE-NOTIFICATIONS] initialize - Service Worker is supported on this browser serviceWorkerRegistrations", serviceWorkerRegistrations)
        //             //     if (serviceWorkerRegistrations.length > 0) {
        //             //         serviceWorkerRegistrations.forEach(registration => {
        //             //             this.logger.log("[FIREBASE-NOTIFICATIONS] initialize - Service Worker is supported on this browser registration ", registration)
        //             //             // this.logger.log("[FIREBASE-NOTIFICATIONS] initialize - Service Worker is supported on this browser registrations scriptURL", registrations.active.scriptURL)
        //             //             // this.logger.log("[FIREBASE-NOTIFICATIONS] initialize - Service Worker is supported on this browser registrations state", registrations.active.state)

        //             //         });
        //             //     } else {
        //             //         this.logger.log("[FIREBASE-NOTIFICATIONS] initialize - Service Worker is supported on this browser - !not registered",)
        //             //         // navigator.serviceWorker.register('http://localhost:8101/firebase-messaging-sw.js')
        //             //         //     .then(function (registration) {
        //             //         //         console.log('Service worker successfully registered.');
        //             //         //         return registration;
        //             //         //     }).catch(function (err) {
        //             //         //         console.error('Unable to register service worker.', err);
        //             //         //     });
        //             //     }
        //             // });
        //         }).catch(function (err) {
        //             console.log('Service worker registration failed, error:', err);
        //         });
        // }
    }



    getNotificationPermissionAndSaveToken(currentUserUid) {
        // this.tenant = this.getTenant();
        this.logger.log('initialize FROM [APP-COMP] - [FIREBASE-NOTIFICATIONS] calling requestPermission - tenant ', this.tenant, ' currentUserUid ', currentUserUid)
        // this.logger.log('[FIREBASE-NOTIFICATIONS] calling requestPermission - currentUserUid ', currentUserUid)
        this.userId = currentUserUid;

        if (firebase.messaging.isSupported()) {
            const messaging = firebase.messaging();
            // messaging.requestPermission()
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    this.logger.log('[FIREBASE-NOTIFICATIONS] >>>> requestPermission Notification permission granted.');

                    return messaging.getToken({ vapidKey: this.vapidkey })
                }
            }).then(FCMtoken => {
                this.logger.log('[FIREBASE-NOTIFICATIONS] >>>> requestPermission FCMtoken', FCMtoken)
                // Save FCM Token in Firebase
                this.FCMcurrentToken = FCMtoken;
                this.updateToken(FCMtoken, currentUserUid)
            }).catch((err) => {
                this.logger.error('[FIREBASE-NOTIFICATIONS] >>>> requestPermission ERR: Unable to get permission to notify.', err);
            });
        } else {
            this.logger.log('[FIREBASE-NOTIFICATIONS] >>>> FIREBASE MESSAGING IS NOT SUPPORTED')

            if(this.platform == 'android' || this.platform === 'ios'){
                this.logger.log('[MQTTNotificationService] >>>> FIREBASE MESSAGING: use FCM plugin')
                this.fcm.onTokenRefresh().subscribe(FCMtoken => {
                  // Register your new token in your back-end if you want
                  // backend.registerToken(token);
                  this.FCMcurrentToken = FCMtoken;
                  console.log("[MQTTNotificationService] FCM: onTokenRefresh --->", FCMtoken);
                  this.updateToken(FCMtoken, currentUserUid)
                });
                this.fcm.requestPushPermission().then((permission) => {
                  console.log("[MQTTNotificationService] FCM: requestPushPermission --->", permission);
                  if(permission === true){
                    this.fcm.getToken().then(FCMtoken => {
                      console.log("[MQTTNotificationService] FCM: getToken --->", FCMtoken);
                      this.FCMcurrentToken = FCMtoken;
                      this.updateToken(FCMtoken, currentUserUid)
                    });
                  }
                });
                
              }
        }
    }


    // getNotificationPermissionAndSaveToken(currentUserUid) {
    //     // this.tenant = this.getTenant();
    //     this.logger.log('[FIREBASE-NOTIFICATIONS] calling requestPermission - tenant ', this.tenant)
    //     this.logger.log('[FIREBASE-NOTIFICATIONS] calling requestPermission - currentUserUid ', currentUserUid)
    //     this.userId = currentUserUid;
    //     const messaging = firebase.messaging();
    //     if (firebase.messaging.isSupported()) {
    //         // messaging.requestPermission()
    //         Notification.requestPermission().then((permission) => {
    //             if (permission === 'granted') {
    //                 this.logger.log('[FIREBASE-NOTIFICATIONS] >>>> requestPermission Notification permission granted.');
    //                 messaging.getToken({ vapidKey: 'BOsgS2ADwspKdWAmiFDZXEYqY1HSYADVfJT3j67wsySh3NxaViJqoabPJH8WM02wb5r8cQIm5TgM0UK047Z1D1c'}).then((currentToken) => {
    //                     if (currentToken) {
    //                         this.sendTokenToServer(currentToken);
    //     // updateUIForPushEnabled(currentToken);

    //                     } else {
    //                       // Show permission request UI
    //                       console.log('No registration token available. Request permission to generate one.');
    //                       // ...
    //                     }
    //                   }).catch((err) => {
    //                     console.log('An error occurred while retrieving token. ', err);
    //                     // ...
    //                   });

    //                 resetUI()

    //             } else {
    //                 this.logger.error('Unable to get permission to notify.');
    //             }
    //         })

    //     }
    // }

    //  sendTokenToServer(currentToken) {
    //     if (!this.isTokenSentToServer()) {
    //       console.log('Sending token to server...');
    //       // TODO(developer): Send the current token to your server.
    //       this.setTokenSentToServer(true);
    //     } else {
    //       console.log('Token already sent to server so won\'t send it again ' +
    //           'unless it changes');
    //     }
    //   }

    //   isTokenSentToServer() {
    //     return window.localStorage.getItem('sentToServer') === '1';
    //   }

    //   setTokenSentToServer(sent) {
    //     window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    //   }

    removeNotificationsInstance(callback: (string) => void) {
        var self = this;
        // firebase.auth().onAuthStateChanged(function (user) {
        //     if (user) {
        //         self.logger.debug('[FIREBASE-NOTIFICATIONS] - FB User is signed in. ', user)
        //         self.logger.log('[FIREBASE-NOTIFICATIONS] >>>> removeNotificationsInstance > this.userId', self.userId);
        //         self.logger.log('[FIREBASE-NOTIFICATIONS] >>>> removeNotificationsInstance > FCMcurrentToken', self.FCMcurrentToken);
        //         // this.logger.log('[FIREBASE-NOTIFICATIONS] >>>> removeNotificationsInstance > this.tenant', this.tenant);
        //     } else {
        //         self.logger.debug('[FIREBASE-NOTIFICATIONS] - No FB user is signed in. ', user)
        //     }
        // });
        const urlNodeFirebase = '/apps/' + self.tenant
        const connectionsRefinstancesId = urlNodeFirebase + '/users/' + self.userId + '/instances/'
        self.logger.log('[FIREBASE-NOTIFICATIONS] >>>> connectionsRefinstancesId ', connectionsRefinstancesId);
        let connectionsRefURL = '';
        if (connectionsRefinstancesId) {
            connectionsRefURL = connectionsRefinstancesId + self.FCMcurrentToken;
            const connectionsRef = firebase.database().ref().child(connectionsRefURL);
            self.logger.log('[FIREBASE-NOTIFICATIONS] >>>> connectionsRef ', connectionsRef);
            self.logger.log('[FIREBASE-NOTIFICATIONS] >>>> connectionsRef url ', connectionsRefURL);
            connectionsRef.off()
            connectionsRef.remove()
                .then(() => {
                    self.logger.log("[FIREBASE-NOTIFICATIONS] >>>> removeNotificationsInstance > Remove succeeded.")
                    callback('success')
                }).catch((error) => {
                    self.logger.error("[FIREBASE-NOTIFICATIONS] >>>> removeNotificationsInstance Remove failed: " + error.message)
                    callback('error')
                }).finally(() => {
                    self.logger.log('[FIREBASE-NOTIFICATIONS] COMPLETED');
                })
        }

    }

    // removeNotificationsInstance() {
    //     let promise = new Promise((resolve, reject) => {
    //         this.appStoreService.getInstallation(this.projectId).then((res) => {
    //             console.log("Get Installation Response: ", res);
    //             resolve(res);
    //         }).catch((err) => {
    //             console.error("Error getting installation: ", err);
    //             reject(err);
    //         })
    //     })
    //     return promise;
    // }


    // ********** PRIVATE METHOD - START ****************//
    private updateToken(FCMcurrentToken, currentUserUid) {
        this.logger.log('[FIREBASE-NOTIFICATIONS] >>>> getPermission > updateToken ', FCMcurrentToken);
        // this.afAuth.authState.take(1).subscribe(user => {
        if (!currentUserUid || !FCMcurrentToken) {
            return
        };

        const connection = FCMcurrentToken;
        const updates = {};
        const urlNodeFirebase = '/apps/' + this.tenant
        const connectionsRefinstancesId = urlNodeFirebase + '/users/' + currentUserUid + '/instances/';

        // this.connectionsRefinstancesId = this.urlNodeFirebase + "/users/" + userUid + "/instances/";
        const device_model = {
            device_model: navigator.userAgent,
            language: navigator.language,
            platform: this.platform,
            platform_version: this.BUILD_VERSION
        }

        updates[connectionsRefinstancesId + connection] = device_model;

        this.logger.log('[FIREBASE-NOTIFICATIONS] >>>> getPermission > updateToken in DB', updates);
        firebase.database().ref().update(updates)
    }
    // ********** PRIVATE METHOD - END ****************//



}
