import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CitasPage } from '../citas/citas';
import { MisServiciosPage } from '../mis-servicios/mis-servicios';
import { PerfilPage } from '../perfil/perfil';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tabCitas = CitasPage;
  tabMisServicios = MisServiciosPage;
  tabPerfil = PerfilPage;
  

  constructor() {

  }
}
