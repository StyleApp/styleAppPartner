import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { OlvidoClavePage } from '../pages/olvido-clave/olvido-clave';
import { CitasPage } from '../pages/citas/citas';
import { MisServiciosPage } from '../pages/mis-servicios/mis-servicios';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import firebase from 'firebase';  
import { environment } from '../enviroments/enviroments';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireModule } from 'angularfire2/';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { AngularFireAuthModule } from 'angularfire2/auth';


firebase.initializeApp(environment.firebase)
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    PerfilPage,
    CitasPage,
    MisServiciosPage,
    OlvidoClavePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
   AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    PerfilPage,
    CitasPage,
    MisServiciosPage,
    OlvidoClavePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
