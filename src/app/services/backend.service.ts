import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCredential, User } from '@firebase/auth-types';
import { FirebaseFunctions, HttpsCallableResult } from '@firebase/functions-types';
import firebase from '@firebase/app';
import '@firebase/functions';
import { Observable } from 'rxjs/Observable';
import { switchMap  } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTaskSnapshot } from '@firebase/storage-types';
import { QuerySnapshot, DocumentReference, CollectionReference, DocumentSnapshot, DocumentData, Query } from '@firebase/firestore-types';
import * as md5 from 'md5';
import { base64Decode } from '@firebase/util';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BackendService {
  private regional: DocumentData = { name: 'No Regional Set', id: 'no-regional' };
  private createUserFunc = firebase.functions().httpsCallable('registerUser');
  private acceptUserFunc = firebase.functions().httpsCallable('acceptUser');
  private denyUserFunc = firebase.functions().httpsCallable('denyUser');
  private users_ref = this.db.collection('users').ref;
  private year_ref = this.db.collection('' + environment.year).ref;
  private reg_ref = this.year_ref.doc(this.regional.id);
  private pit_scout = this.reg_ref.collection('pit');
  private match_scout = this.reg_ref.collection('match');

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
    this.auth.auth.signOut();
    localStorage.removeItem('cur_regional');
  }

  public getUser(): User {
    return this.auth.auth.currentUser;
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
      accept: 'application/json',
      'X-TBA-Auth-Key': environment.tba.api
    };
    return this.http.get<any[]>(environment.tba.endpoint + 'events/' + environment.year + '/simple', { headers: headers });
  }

  public setCurRegional(regional: DocumentData): void {
    this.year_ref.where('id', '==', regional.id).get().then((res: QuerySnapshot) => {
      if (!res.empty) { // If the regional exists in the database...
        this.reg_ref = res.docs[0].ref;
        this.pit_scout = this.reg_ref.collection('pit');
        this.match_scout = this.reg_ref.collection('match');

        this.reg_ref.onSnapshot((reg) => {
          this.regional = reg.data();
          localStorage.setItem('cur_regional', JSON.stringify(this.regional));
        });
      } else { // If it doesnt exist...
        this.regional = { name: 'No Regional Set', id: 'no-regional' };
        localStorage.setItem('cur_regional', JSON.stringify(this.regional));
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

  public uploadPit(data): Promise<boolean> {
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
        uploaded_by: this.auth.auth.currentUser.uid
      };

      // Add database entry.
      // TODO: Check for existing pit scout, and if present append image to array of images?
      return this.pit_scout.add(pit_data);
    }).then(() => {
      return Promise.resolve(true);
    });
  }
}
