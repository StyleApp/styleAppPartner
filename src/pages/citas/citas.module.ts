import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CitasPage } from './citas';

@NgModule({
  declarations: [
    CitasPage,
  ],
  imports: [
    IonicPageModule.forChild(CitasPage),
  ],
})
export class CitasPageModule {}
