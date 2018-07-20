import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase ,FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import { Camera, CameraOptions } from '@ionic-native/camera';
import firebase from 'firebase';
/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  perfilPartner:any = [];
  tempNombre:any = "";
  tempApellido:any = "";
  tempCelular:any = "";
  activaGuardar:any = true; 
  loading:any;
  loadingSubiendoFoto:any;
  downloadURL:any="-";
  subirFotoTarea:any;

  constructor(public navCtrl: NavController, public navParams: NavParams  ,public storage: Storage , public af :AngularFireDatabase ,private camera: Camera ,public loadingCtrl: LoadingController) {
  		

  }

  verificarCambios(e){

  	if(this.tempNombre != this.perfilPartner.nombre || this.tempApellido != this.perfilPartner.apellido || this.tempCelular != this.perfilPartner.celular){
  		console.log("tiene cambios");
  		this.activaGuardar = false;

  	}else{
  		console.log(" NO  tiene cambios");
  		this.activaGuardar = true;

  	}



  }
  guardarCambios(){
  	 const fechaIngresoUpdate = this.af.object('userProfilePartner/'+this.perfilPartner.uid);
     fechaIngresoUpdate.update(
     							{
     								nombre: this.perfilPartner.nombre,
     								apellido: this.perfilPartner.apellido,
     								celular: this.perfilPartner.celular

     							}

     						  );

      this.storage.set('userData', this.perfilPartner)
                  .then(() => {
                    console.log('Almacenado localmente');
                    this.tempNombre = this.perfilPartner.nombre ;
	        		this.tempApellido = this.perfilPartner.apellido ;
	        		this.tempCelular = this.perfilPartner.celular ;
	        		this.activaGuardar = true;
                    
                  },error => console.error('Error storing item', error)
                );





     alert("perfil actualizado");

  }

  fotoCliente:any = "-";
  fotoClientePura:any;
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


  ionViewWillEnter() {	


  	


  	this.storage.get('userData').then(
      		data => {
	      	console.log("entra  perfil ");
	        //console.log("data= " + JSON.stringify(data));
	        this.perfilPartner = data ; 

	        console.log("uid " + this.perfilPartner.uid) ;
	        let dataInfo =  this.af.object('userProfilePartner/'+this.perfilPartner.uid , { preserveSnapshot: true });
            dataInfo.subscribe(snapshot => {
           
               console.log(snapshot.key)
               console.log(JSON.stringify(snapshot.val()));
               

               
             //  this.artistas = snapshot.val().artistas;
               
                      	  
               
      

                if( snapshot.val().nombre != null){	        	
	        		this.perfilPartner.nombre = snapshot.val().nombre;
		        }else{
		        	this.perfilPartner.nombre = "-";
		        }

		        if( snapshot.val().apellido != null){		        	
		        	this.perfilPartner.apellido = snapshot.val().apellido;
		        }else{
		        	this.perfilPartner.apellido = "-";
		        }

		        if( snapshot.val().celular != null){		        	
		        	this.perfilPartner.celular = snapshot.val().celular;       	  
		        }else{
		        	this.perfilPartner.celular = "-";
		        }

		        if( snapshot.val().photoUrl != null){
		        	this.perfilPartner.photoUrl = snapshot.val().photoUrl;  		        	
		        }else{
		        	this.perfilPartner.photoUrl = "-";
		        }


		        this.tempNombre = this.perfilPartner.nombre ;
		        this.tempApellido = this.perfilPartner.apellido ;
		        this.tempCelular = this.perfilPartner.celular ;     	  
	           


            });

	        

	       



        		
      });
  }

  entra:any =false;
  subirFotoDePerfil() {

   console.log("url =" +this.downloadURL);
    if(this.downloadURL != '-'){
      alert("La imagen ya se cargo.");
      return;
    }

    this.presentLoadingSubida();

    
    let thiss = this;
    let loading = this.loadingSubiendoFoto ;

    this.subirFotoTarea = firebase.storage().ref().child('userProfilePartner/'+this.perfilPartner.uid+'/perfil.png').putString(this.fotoCliente, 'data_url');
    this.subirFotoTarea.on('state_changed', function(snapshot ){
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
                                            thiss.downloadURL = thiss.subirFotoTarea.snapshot.downloadURL ;
                                            console.log("url descarga imagen " +  thiss.downloadURL);

                                            firebase.database().ref('userProfilePartner/'+thiss.perfilPartner.uid).update({
                                                                                     
                                                       photoUrl: thiss.downloadURL
                                            });
                                            thiss.perfilPartner.photoUrl = thiss.downloadURL;
                                            thiss.storage.set('userData', thiss.perfilPartner)
								                  .then(() => {
								                    console.log('Almacenado localmente');
								                 
								                    
								                  },error => console.error('Error storing item', error)
								                );
                                            thiss.fotoCliente = "-";
                                            thiss.fotoClientePura = "-"; 
                                           // thiss.descripcion="";
                                           // thiss.titulo="";
                                            loading.dismiss();
                                            //this.imagenSubida = false  ;
                                            


                                          });
    //this.progress = this.task.percentageChanges();
}


   presentLoadingDefault() {
		  this.loading = this.loadingCtrl.create({
		    content: 'Cargando...'
		  });

		  this.loading.present();
   }

    presentLoadingSubida() {
      this.loadingSubiendoFoto = this.loadingCtrl.create({
        content: 'Subiendo a servidores Style App...'
      });

      this.loadingSubiendoFoto.present();
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

}
