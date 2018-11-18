import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppDeckComponent } from './components/app-deck/app-deck.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AppVolumeComponent } from './components/app-volume/app-volume.component';
import { SliderControllerComponent } from './components/slider-controller/slider-controller.component';
import { FormsModule } from '@angular/forms';
import { RouletteControllerComponent } from './components/roulette-controller/roulette-controller.component';
import { AppSearchComponent } from './components/app-search/app-search.component';
import { AppTabsComponent } from './components/app-tabs/app-tabs.component';
import { AppMusicListComponent } from './components/app-music-list/app-music-list.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { AppAboutComponent } from './components/app-about/app-about.component';
import { PruebasComponent } from './components/pruebas/pruebas.component';

@NgModule({
  declarations: [
    AppComponent,
    AppDeckComponent,
    AppLayoutComponent,
    AppVolumeComponent,
    SliderControllerComponent,
    RouletteControllerComponent,
    AppSearchComponent,
    AppTabsComponent,
    AppMusicListComponent,
    AppSettingsComponent,
    AppAboutComponent,
    PruebasComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
