import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // {
  //     path: '',
  //     canLoad: [AuthGuard],
  //     canActivate: [AuthGuard],
  //     children: [
  //         { path: 'match-scouting', component: MatchScoutingComponent },
  //         { path: 'edit-match-scouting', component: EditMatchScoutingComponent },
  //         { path: 'pit-scouting', component: PitScoutingComponent },
  //         { path: 'match-schedule', component: MatchScheduleComponent },
  //         { path: 'list', component: ListComponent }
  //     ]
  // },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
