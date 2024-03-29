import { environment } from '../environments/environment';
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SidebarModule } from 'ng-sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './partials/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { PitScoutingComponent } from './pages/pit-scouting/pit-scouting.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AlertComponent } from './partials/alert/alert.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { AccordionModule, ModalModule } from 'ngx-bootstrap';
import { TeamsComponent } from './pages/teams/teams.component';
import { MatchComponent } from './pages/match/match.component';
import { MatchQuestionComponent } from './partials/match-question/match-question.component';
import { MatchModalComponent } from './partials/match-modal/match-modal.component';
// Services
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BackendService } from './services/backend.service';
// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AnalysisComponent } from './pages/analysis/analysis.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PitScoutingComponent,
    SettingsComponent,
    AdminComponent,
    AlertComponent,
    ScheduleComponent,
    TeamsComponent,
    MatchComponent,
    MatchQuestionComponent,
    MatchModalComponent,
    AnalysisComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule.forRoot(),
    ModalModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AccordionModule.forRoot(),
    ChartsModule,
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    BackendService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    MatchModalComponent
  ]
})
export class AppModule { }
