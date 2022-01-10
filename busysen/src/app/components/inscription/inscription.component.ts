import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from './user';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {

  public user: User = new User();

  constructor() {


  }

  ngOnInit(): void {

  }

  public saveData(InscriptionComponent: NgForm) {
    console.log(InscriptionComponent.form);
    console.log('valeurs: ', JSON.stringify(InscriptionComponent.value));
    console.log('hello');
  }

} 
