import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { OlvidoClavePage } from '../../pages/olvido-clave/olvido-clave';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: any;
  clave: any;
  userProfile:any ; 
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage :Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
    

  ionViewWillEnter() {


       let elem = <HTMLElement>document.querySelector(".tabbar");
         if (elem != null) {
           elem.style.display = 'none';
         }

  }

    //evento de inicio de sesion con email
  loginUser(): Promise<any> {
    let thisInterno = this;
    return firebase.auth().signInWithEmailAndPassword(this.email, this.clave).then(loginResultado => {
        console.log("Firebase success: " + JSON.stringify(loginResultado));
          //this.userProfile = loginResultado.user;  //NUEVA VERSION 
          this.userProfile = loginResultado;
          let uidCliente = this.userProfile.uid;
          let email = this.userProfile.email;
          let fotoPerfil = this.userProfile.photoURL;
          let nombreCliente = this.userProfile.displayName;
          console.log("uidCliente =" + uidCliente);
          console.log("foto perfil =" + fotoPerfil);
          console.log("nombre cliente =" + nombreCliente);
         firebase.database().ref('/userProfilePartner/' + uidCliente).once('value').then(function(snapshot) {
              console.log(JSON.stringify(snapshot.val()));
              let data = snapshot.val();
              if(data != null ){
                console.log("existe usuario");
                
                thisInterno.storage.set('userData', thisInterno.userProfile)
                  .then(() => {
                    console.log('Stored item!');
                    thisInterno.navCtrl.popToRoot();
                  },error => console.error('Error storing item', error)
                );
              }else{

                console.log("no existe usuario");

                firebase.database().ref('/userProfilePartner').child(uidCliente)
                .set(
                      { 
                        uid:uidCliente, 
                        email: email, 
                        nombreUsuario:
                        nombreCliente,
                        photoUrl: fotoPerfil 
                      }
                 );

                  thisInterno.storage.set('userData', thisInterno.userProfile)
                  .then(() => {
                    console.log('Stored item!');
                    thisInterno.navCtrl.popToRoot();
                  },error => console.error('Error storing item', error)
                );


              } //FIL ELSE 
            
          });
      // this.navCtrl.pop();
    }).catch((_error) => { //validacion de errores
      console.log("Error!");
      let erroInfo = JSON.stringify(_error);
      console.log(JSON.stringify(_error));
      console.log(_error.message);

      if (_error.message === 'The email address is badly formatted.') {
        alert("Formato email incorrecto");
      }
      if (_error.message === 'The password is invalid or the user does not have a password.') {
        alert("Clave incorrecta");
      }
    });
  }

  irOlvidoClave(){
    this.navCtrl.push(OlvidoClavePage);
  }

}
