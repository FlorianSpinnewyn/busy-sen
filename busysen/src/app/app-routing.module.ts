import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { UtilisateurComponent } from './components/utilisateur/utilisateur.component';
import { PageNotfoundComponent } from './page-notfound/page-notfound.component';

const routes: Routes = [
  {path: "", component: UtilisateurComponent},
  {path: "login", component: UtilisateurComponent},
  {path: "inscription", component: InscriptionComponent},
  {path: "**", component: PageNotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
