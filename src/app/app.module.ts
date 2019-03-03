import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppDeckComponent } from './components/app-deck/app-deck.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { AppVolumeComponent } from './components/app-volume/app-volume.component';
import { SliderControllerComponent } from './form-components/slider-controller/slider-controller.component';
import { FormsModule } from '@angular/forms';
import { RouletteControllerComponent } from './form-components/roulette-controller/roulette-controller.component';
import { AppTabsComponent } from './components/app-tabs/app-tabs.component';
import { AppMusicListComponent } from './components/app-music-list/app-music-list.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { AppEffectsSelectorComponent } from './components/app-effects-selector/app-effects-selector.component';
import { AppAboutComponent } from './components/app-about/app-about.component';
import { AppEffectsCreatorComponent } from './components/app-effects-creator/app-effects-creator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppHelpComponent } from './components/app-help/app-help.component';
import { AngularDraggableDirective } from './directives/ngdraggable/ngdraggable.directive';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { registerLocaleData } from '@angular/common';

// importar locales

import localeEs from '@angular/common/locales/es';

// registrar los locales con el nombre que quieras utilizar a la hora de proveer
registerLocaleData(localeEs, 'es');

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    AppDeckComponent,
    AppLayoutComponent,
    AppVolumeComponent,
    SliderControllerComponent,
    RouletteControllerComponent,
    AppTabsComponent,
    AppMusicListComponent,
    AppSettingsComponent,
    AppAboutComponent,
    AppEffectsCreatorComponent,
    AppHelpComponent,
    AppEffectsSelectorComponent,
    AngularDraggableDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
