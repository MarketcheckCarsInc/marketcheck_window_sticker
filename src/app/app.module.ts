import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, Component } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { webelementer } from './elementer';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { WindowStickerV2Component } from './window-sticker-v2/window-sticker-v2.component';
import { Routes, RouterModule } from '@angular/router';
import { NgxBarcode6Module } from 'ngx-barcode6';


@NgModule({
  declarations: [
    AppComponent,
    WindowStickerV2Component
  ],
  imports: [
    RouterModule.forRoot([]),
    BrowserModule,
    HttpClientModule,
    NgxBarcode6Module
  ],
  providers: [],
  entryComponents: [
    WindowStickerV2Component
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  public dynamoSet=[
    {eltitle:webelementer.windowsticker,elcomponent:WindowStickerV2Component}

  ];
  constructor(private injector: Injector) {  }
  ngDoBootstrap() {
    this.dynamoSet.map((res)=>{
      customElements.define(res.eltitle,createCustomElement(res.elcomponent, { injector: this.injector }))
    });
  }
}
