import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  ,LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { AngularFireDatabase ,FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/take';

/**
 * Generated class for the MisServiciosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mis-servicios',
  templateUrl: 'mis-servicios.html',
})
export class MisServiciosPage {


  perfilPartner:any = [];
  descripcion:any ;
  titulo:any ;
  uidPartner:any;
  urlImagen:any;
  uidServicio:any;
  loadingSubiendoFoto :any;
  loading:any;
  downloadURL:any ="-";
  entra:any = false ;
  fotoCliente:any = "-";
  fotoClientePura:any;
  operacion:any = "misServicios";

  constructor(public navCtrl: NavController, public navParams: NavParams, public af :AngularFireDatabase ,public storage: Storage ,public loadingCtrl: LoadingController ,private camera: Camera) {
      this.storage.get('userData').then(
      data => {
        console.log("data = " + data );
        this.perfilPartner = data ; 

        this.cargarMisServicios();
      });


  }

  //inserta datos en el feed 
  agregarFeed() {
	    
      console.log(this.perfilPartner.uid);
	    //this.downloadURL =  this.obtenerUbicacion();
      console.log("Ubicacion de la imagen " + this.downloadURL);
	    
	    //let uidPartner = this.perfilPartner.uid;
      this.urlImagen = "-";
      this.uidServicio = "0"; 
	    let uidServicio = "23UND23N2";
	    let urlImagen = "QWDQIWDJIQJOWDJIQ";
      let  thiss = this;

      var storage = firebase.storage().ref();
       storage.child('feedPartner/'+this.perfilPartner.uid+'/perfil.png').getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();

        // Or inserted into an <img> element:
        //var img = document.getElementById('myimg');

        //img.src = url;
        console.log("url desacrga " + url ) ; 
        //thiss.downloadUrl = url;
       // console.log("url nuev = " + this.downloadUrl);
        thiss.obtenerUbicacion(url);
        console.log("despues");
        
      }).catch(function(error) {
        // Handle any errors
      });
      //inserta en firebase 
 
	    
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MisServiciosPage');
  }


  presentLoadingSubida() {
      this.loadingSubiendoFoto = this.loadingCtrl.create({
        content: 'Subiendo a servidores LinkInk...'
      });

      this.loadingSubiendoFoto.present();
  }

  //carga una imagen en la libreria
  cargarImagen(){
    //opcones de camara
    const options: CameraOptions = {
      quality: 10,
       targetWidth:500,
      targetHeight:500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation :true,
      saveToPhotoAlbum:true
    }
    this.presentLoadingDefault();
    //obtiene foto de  y la convierte  
    this.camera.getPicture(options).then((imageData) => {
                
         let fotoCliente = this.b64toBlob( imageData ,null,null);
         let fotoCompress  = this.base64ToFile( imageData  , "comprimida" , "image/png");
         console.log("Tamano" +  fotoCliente.size); 
         //console.log("Tamñano imageData image " +  fotoCompress.length);         
         if(fotoCliente.size < 1000000){
            
            this.fotoCliente = 'data:image/jpeg;base64,' + imageData;
            this.fotoClientePura =  imageData;

         }else{
           alert("Imagen debe ser de tamaño no superior a 1MB ");
         }

         this.loading.dismiss();

    }, (err) => {
      console.log("error 2");
      console.log(err);
     
    });
  }

task;
subirImagenServidor() {

    console.log("url =" +this.downloadURL);
    if(this.downloadURL != '-'){
      alert("La imagen ya se cargo.");
      return;
    }
    
    this.presentLoadingSubida();

    //this para que se enteidna en la funcion
    let thiss = this;
    let loading = this.loadingSubiendoFoto ;


    this.task = firebase.storage().ref().child('feedPartner/'+this.perfilPartner.uid+'/perfil.png').putString(this.fotoCliente, 'data_url');
    this.task.on('state_changed', function(snapshot ){
                                            // Observe state change events such as progress, pause, and resume
                                            // See below for more detail
                                          }, function(error) {                                            
                                            // Handle unsuccessful uploads
                                          }, function() {
                                        
                                            thiss.entra = true ;
                                            thiss.downloadURL = thiss.task.snapshot.downloadURL ;
                                            console.log("url descarga imagen " +  thiss.downloadURL);
                                             firebase.database().ref('Feed').push({
      
                                                       fecha :   Date.now() ,
                                                       titulo:thiss.titulo,
                                                       descripcion  : thiss.descripcion,                                      
                                                       uidPartner : thiss.perfilPartner.uid,
                                                       uidServicio : 0,                                      
                                                       urlImagen: thiss.downloadURL
                                               });
                                            thiss.fotoCliente = "-";
                                            thiss.fotoClientePura = "-"; 
                                            thiss.descripcion="";
                                            thiss.titulo="";
                                            loading.dismiss();
                                            //this.imagenSubida = false  ;                                            

                                          });
    //this.progress = this.task.percentageChanges();
}



createUploadTask() {

   console.log("url =" +this.downloadURL);
    if(this.downloadURL != '-'){
      alert("La imagen ya se cargo.");
      return;
    }

    this.presentLoadingSubida();

    

   
    let thiss = this;
    let loading = this.loadingSubiendoFoto ;
    this.task = firebase.storage().ref().child('feedPartner/'+this.perfilPartner.uid+'/'+this.titulo+'.png').putString(this.fotoCliente, 'data_url');
    this.task.on('state_changed', function(snapshot ){
                                            // Observe state change events such as progress, pause, and resume
                                            // See below for more detail
                                          }, function(error) {
                                             

                                            // Handle unsuccessful uploads
                                          }, function() {
                                            // Handle successful uploads on complete
                                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                           // this.downloadURL = storageRef.snapshot.downloadURL;

                                           // this.dataChangeObserver.next(this.downloadURL);
                                            
                                          //  thiss.generarRegistroFoto();
                                            thiss.entra = true ;
                                            thiss.downloadURL = thiss.task.snapshot.downloadURL ;
                                            console.log("url descarga imagen " +  thiss.downloadURL);

                                            firebase.database().ref('Feed').push({
      
                                                       fecha :   Date.now() ,
                                                       titulo:thiss.titulo,
                                                       descripcion  : thiss.descripcion,                                      
                                                       uidPartner : thiss.perfilPartner.uid,
                                                       uidServicio : 0,                                      
                                                       urlImagen: thiss.downloadURL
                                            });
                                            thiss.fotoCliente = "-";
                                            thiss.fotoClientePura = "-"; 
                                            thiss.descripcion="";
                                            thiss.titulo="";
                                            loading.dismiss();
                                            //this.imagenSubida = false  ;
                                            


                                          });
    //this.progress = this.task.percentageChanges();
}


 obtenerUbicacion(url){
     console.log("entra obetener  ubicacion");
     /*var storage = firebase.storage().ref();
     storage.child('feedPartner/'+this.perfilPartner.uid+'/perfil.png').getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'

      // This can be downloaded directly:
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        var blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();

      // Or inserted into an <img> element:
      //var img = document.getElementById('myimg');
      //img.src = url;
      console.log("url desacrga " + url ) ; 
      return url ;
    }).catch(function(error) {
      // Handle any errors
    });*/
    this.uidServicio = "0"; 
   
 }


 presentLoadingDefault() {
  this.loading = this.loadingCtrl.create({
    content: 'Cargando...'
  });

  this.loading.present();

  /*setTimeout(() => {
    loading.dismiss();
  }, 5000);
  */

 }

 dataItemsServicios:any= [];
 subject : any = new Subject();
 dataServicios:any= [];
 cargarMisServicios(){
  console.log("Entra cargar mis servicios ");


    //const subject = new Subject(); // import {Subject} from 'rxjs/Subject';
    const queryObservable = this.af.list('/Feed', {
            query: {
                orderByChild: 'uidPartner',
                equalTo: this.subject
            }
        }).take(1);
   

    // subscribe to changes
    queryObservable.subscribe(snapshots => {
      //console.log("consulta ff= " + snapshots.length);

     this.dataServicios = [];
    
      for(let i = 0 ; i < snapshots.length ; i++ ){
        this.dataItemsServicios  = snapshots[i] ;
        this.dataServicios.push(this.dataItemsServicios);
        console.log("Info  = " +  JSON.stringify(this.dataItemsServicios));
 

      } //fin for  

    });

    this.subject.next(this.perfilPartner.uid);


}

  base64ToFile(base64Data, tempfilename, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    var file = new File(byteArrays, tempfilename, { type: contentType });
    return file;
 }


      b64toBlob(b64Data, contentType, sliceSize) {
             contentType = contentType || '';
             sliceSize = sliceSize || 512;

             var byteCharacters = atob(b64Data);
             var byteArrays = [];

             for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                 var slice = byteCharacters.slice(offset, offset + sliceSize);

                 var byteNumbers = new Array(slice.length);
                 for (var i = 0; i < slice.length; i++) {
                     byteNumbers[i] = slice.charCodeAt(i);
                 }

                 var byteArray = new Uint8Array(byteNumbers);

                 byteArrays.push(byteArray);
             }

           var blob = new Blob(byteArrays, {type: contentType});
           return blob;
     }

}
