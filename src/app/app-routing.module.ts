import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { PitScoutingComponent } from './pages/pit-scouting/pit-scouting.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { MatchComponent } from './pages/match/match.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'pit', component: PitScoutingComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'schedule', component: ScheduleComponent },
      { path: 'teams', component: TeamsComponent },
      { path: 'match', component: MatchComponent },
      { path: 'analysis', component: AnalysisComponent }
    ]
  },
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      { path: 'admin', component: AdminComponent },
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
