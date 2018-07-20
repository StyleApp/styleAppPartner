import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';


/**
 * Generated class for the CitasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-citas',
  templateUrl: 'citas.html',
})
export class CitasPage {

  constructor(public navCtrl: NavController, public navParams: NavParams ,public storage: Storage  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitasPage');
  }

  ionViewWillEnter() {
      
	  this.storage.get('userData').then(
	  	data => {
	  		console.log("data = " + data );
	  		 if (data != null) {
	  		 	console.log("existe usuario");
           let elem = <HTMLElement>document.querySelector(".tabbar");
           if (elem != null) {
             elem.style.display = 'flex';
           }
	  		 }else{
	  		 	console.log("no existe usuario");
	  		 	this.navCtrl.push(LoginPage);
	  		 	
	  		 } //fin if validacion si esta logueado


	  	});

   }


    //elimina los datos guardados del usuario
  cerrarSesion() {
    this.storage.remove('userData')
      .then(
      data => {
        console.log("eliminado = " + data);
        //    this.platform.exitApp();
        //luego de eliminado envia a pantalla de  login
        this.navCtrl.push(LoginPage);
      },
      error => console.error(error)
      );

  }

 
}
