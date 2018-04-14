import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { PitScoutingComponent } from './pages/pit-scouting/pit-scouting.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    children: [
      { path: 'pit', component: PitScoutingComponent },
      { path: 'settings', component: SettingsComponent },
      // { path: 'match', component: MatchScoutingComponent },
      // { path: 'edit-match-scouting', component: EditMatchScoutingComponent },
      // { path: 'match-schedule', component: MatchScheduleComponent },
      // { path: 'list', component: ListComponent }
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
