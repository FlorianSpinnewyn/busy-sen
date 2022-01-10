import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-notfound',
  template: `
    <p>
      La page demandée n'existe pas
    </p>
  `,
  styles: [
  ]
})
export class PageNotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
