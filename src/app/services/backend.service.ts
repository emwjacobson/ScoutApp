import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCredential, User } from '@firebase/auth-types';
import { FirebaseFunctions, HttpsCallableResult } from '@firebase/functions-types';
import firebase from '@firebase/app';
import '@firebase/functions';
import { Observable } from 'rxjs/Observable';
import { tap, catchError, map } from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import { environment } from '../../environments/environment';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTaskSnapshot } from '@firebase/storage-types';
import { QuerySnapshot, DocumentReference, CollectionReference, DocumentSnapshot, DocumentData, Query } from '@firebase/firestore-types';
import * as md5 from 'md5';
import { base64Decode, validateContextObject } from '@firebase/util';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormControl, Validators, FormGroup } from '@angular/forms';

const game_template = require('./../../../game-template.json');

@Injectable()
export class BackendService {
  private regional: DocumentData = { name: 'No Regional Set', id: 'no-regional' };
  private pit_data = [];
  private match_data = [];
  private createUserFunc = firebase.functions().httpsCallable('registerUser');
  private acceptUserFunc = firebase.functions().httpsCallable('acceptUser');
  private denyUserFunc = firebase.functions().httpsCallable('denyUser');
  private users_ref = this.db.collection('users').ref;
  private year_ref = this.db.collection('' + environment.year).ref;
  private reg_ref = this.year_ref.doc(this.regional.id);
  private pit_ref = this.reg_ref.collection('pit');
  private match_ref = this.reg_ref.collection('match');

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage, private http: HttpClient) {
    if (localStorage.getItem('cur_regional')) {
      try {
        const reg_info = JSON.parse(localStorage.getItem('cur_regional')); // This will throw an error if cur_regional is not valid json.
        if (reg_info) {
          this.setCurRegional(reg_info);
        } else {
          this.setCurRegional({ name: 'No Regional Set', id: 'no-regional' });
        }
      } catch {
        this.setCurRegional({ name: 'No Regional Set', id: 'no-regional' });
      }
    }
  }

  public register(user): Promise<HttpsCallableResult> {
    return this.createUserFunc(user);
  }

  public login(data): Promise<UserCredential> {
    return this.auth.auth.signInAndRetrieveDataWithEmailAndPassword(data.email, data.password).then((user: UserCredential) => {
      this.setCurRegional({id: data.regional});
      return user;
    });
  }

  public changePassword(password: string): Promise<any> {
    return this.auth.auth.currentUser.updatePassword(password);
  }

  public logout(): void {
    localStorage.removeItem('cur_regional');
    this.auth.auth.signOut();
  }

  public getUser(): Observable<User> {
    return this.auth.authState;
  }

  public isUserAdmin(uid: string): Promise<boolean> {
    return this.users_ref.doc(uid).get().then((data) => {
      return data.data().admin;
    });
  }

  public getLimitedUsers() {
    return this.users_ref.where('limited', '==', true).limit(10);
  }

  public getCurrentUserData(): Observable<Query> {
    return this.auth.authState.switchMap((user: User) => {
      if (!user) {
        return Observable.of(null);
      }
      return Observable.of(this.users_ref.where('uid', '==', user.uid));
    });
  }

  public acceptUser(user_id: string): Promise<HttpsCallableResult> {
    const data = {
      uid: user_id
    };
    return this.acceptUserFunc(data);
  }

  public denyUser(user_id: string) {
    const data = {
      uid: user_id
    };
    return this.denyUserFunc(data);
  }




  public getRegionals(): CollectionReference {
    return this.year_ref;
  }

  public getTBARegionals(): Observable<any[]> {
    // Request to TBA api to get regionals.
    const headers = {
      'X-TBA-Auth-Key': environment.tba.api
    };
    return this.http.get<any[]>(environment.tba.endpoint + 'events/' + environment.year + '/simple', { headers: headers });
  }

  public setCurRegional(regional: DocumentData): void {
    this.year_ref.where('id', '==', regional.id).get().then((res: QuerySnapshot) => {
      if (!res.empty) { // If the regional exists in the database...
        this.reg_ref = res.docs[0].ref;
        this.pit_ref = this.reg_ref.collection('pit');
        this.match_ref = this.reg_ref.collection('match');

        this.getTBARegionalData(res.docs[0].data().id);

        this.reg_ref.onSnapshot((reg) => {
          const reg_data = reg.data();
          this.regional.id = reg_data.id;
          this.regional.name = reg_data.name;
          this.saveRegional();
        });

        this.pit_ref.onSnapshot((team) => {
          const temp_data = [];
          team.docs.forEach(data => {
            temp_data.push(data.data());
          });
          this.pit_data = temp_data;
        });

        this.match_ref.onSnapshot((match) => {
          const temp_data = [];
          match.docs.forEach(data => {
            temp_data.push(data.data());
          });
          this.match_data = temp_data;
        });
      } else { // If it doesnt exist...
        this.regional = { name: 'No Regional Set', id: 'no-regional' };
        this.saveRegional();
      }
    });
  }

  private getTBARegionalData(reg_id: string) {
    const headers = {
      'X-TBA-Auth-Key': environment.tba.api
    };
    Observable.forkJoin(
      this.http.get<any[]>(environment.tba.endpoint + 'event/' + reg_id + '/teams/simple', {headers: headers, observe: 'response'}),
      this.http.get<any[]>(environment.tba.endpoint + 'event/' + reg_id + '/matches/simple', {headers: headers, observe: 'response'}),
    ).subscribe((res: HttpResponse<any[]>[]) => {
      console.log('Got TBA Match & Team data');
      if (res[0].status === 200 && res[1].status === 200) {
        this.regional.teams = res[0].body.sort((a, b) => a.team_number > b.team_number ? 1 : -1);
        this.regional.matches = res[1].body.sort((a, b) => a.time > b.time ? 1 : b.time > a.time ? -1 : 0);
        this.saveRegional();
      }
    });
  }

  public getCurRegional(): DocumentData {
    return this.regional;
  }

  public addRegional(reg: any) {
    const data = {
      id: reg.key,
      name: reg.name
    };
    return this.year_ref.add(data);
  }

  public uploadPit(data: any): Promise<boolean> {
    // public pit_form = {
    //   team_number: null,
    //   image: null,
    //   drivetrain: '',
    //   comments: '',
    // };
    if (!this.regional) {
      return Promise.reject({code: 'regional-not-set', message: 'The current regional has not been set.'});
    }

    // const image_name = data.team_number;
    const image_name = md5(data.image).substr(0, 10);
    const image_type = /image\/(.*?);base64/g.exec(data.image)[1]; // This gets the image type from the base64 encoded image
    const image_name_full = image_name + '.' + image_type;
    const file_path = `${environment.year}/${this.regional.id}/${image_name_full}`;

    const ref = this.storage.ref(file_path);

    // Upload image
    return ref.putString(data.image, 'data_url').then((snapshot: UploadTaskSnapshot) => {
      const pit_data = {
        team_number: data.team_number,
        drivetrain: data.drivetrain,
        comments: data.comments,
        image: image_name_full,
        uploaded_by: this.auth.auth.currentUser.uid,
        uploaded_by_name: this.auth.auth.currentUser.displayName,
        download_url: snapshot.metadata.downloadURLs[0]
      };

      // Add database entry.
      // TODO: Check for existing pit scout, and if present append image to array of images?
      return this.pit_ref.add(pit_data);
    }).then(() => {
      return Promise.resolve(true);
    });
  }

  public getPitData() {
    return this.pit_data;
  }

  public getMatchData(match_number?: number) {
    if (match_number) {
      return this.match_data.filter((match) => {
        return match.match_number === match_number;
      });
    }
    return this.match_data;
  }

  public getMatchTemplate(): any {
    return game_template;
  }

  public getTeamMatches(team_number: number): string[] {
    return this.regional.matches.filter((e) => e.alliances.blue.team_keys.some(tn => tn === 'frc' + team_number) || e.alliances.red.team_keys.some(tn => tn === 'frc' + team_number));
  }

  public getFormGroup(): any {
    const group: any = {};
    const questions = this.getMatchTemplate();

    group['team_number'] = new FormControl(null, [Validators.required]);
    group['match_number'] = new FormControl(null, [Validators.required]);

    questions.forEach(type => {
      type.fields.forEach(question => {
        const validators = [];
        if (question.required) {
          validators.push(Validators.required);
        }
        if (question.validation_regex) {
          validators.push(Validators.pattern(question.validation_regex));
        }

        group[question.name] = new FormControl(question.default_value, validators);
      });
    });
    return new FormGroup(group);
  }

  public uploadMatch(data: any): Promise<boolean> {
    data['uploaded_by'] = this.auth.auth.currentUser.uid;
    data['uploaded_by_name'] = this.auth.auth.currentUser.displayName;
    return this.match_ref.add(data).then(a => {
      if (a) {
        return true;
      }
      return false;
    });
  }

  private saveRegional() {
    localStorage.setItem('cur_regional', JSON.stringify(this.regional));
  }
}
