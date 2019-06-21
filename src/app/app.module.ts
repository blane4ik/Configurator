import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ConfigBarComponent } from './config-bar/config-bar.component';
import { ThreejsService } from './shared/services/threejs.service';
import { ChangeValuesDirective } from './shared/directives/change-values.directive';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ConfigBarComponent,
    ChangeValuesDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [ThreejsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
