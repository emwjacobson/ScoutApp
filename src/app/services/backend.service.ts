import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCredential, User } from '@firebase/auth-types';
import { FirebaseFunctions, HttpsCallableResult } from '@firebase/functions-types';
import firebase from '@firebase/app';
import '@firebase/functions';
import { Observable } from 'rxjs/observable';
import { environment } from '../../environments/environment';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTaskSnapshot } from '@firebase/storage-types';

@Injectable()
export class BackendService {
  private createUser = firebase.functions().httpsCallable('registerUser');
  private db_ref = this.db.collection('' + environment.year).doc('static-regional');
  private pit_scout = this.db_ref.collection('pit');
  private match_scout = this.db_ref.collection('match');

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) {
    // this.auth.authState.subscribe((user: User) => {
    //   this.user = user;
    // }, (error) => {
    //   console.log('Error in authState', error);
    // });
  }

  public register(user): Promise<HttpsCallableResult> {
    return this.createUser(user);
  }

  public login(user): Promise<UserCredential> {
    return this.auth.auth.signInAndRetrieveDataWithEmailAndPassword(user.email, user.password);
  }

  public logout(): void {
    this.auth.auth.signOut();
  }

  public getUser(): Observable<User> {
    return this.auth.authState;
  }

  public uploadPit(data) {
    // public pit_form = {
    //   team_number: null,
    //   image: null,
    //   drivetrain: '',
    //   comments: '',
    // };

    const image_name = data.team_number;
    const image_type = /image\/(.*?);base64/g.exec(data.image)[1]; // This gets the image type from the base64 encoded image
    const file_path = environment.year + '/' + image_name + '.' + image_type; // Something along the lines of /2018/294.jpeg

    const ref = this.storage.ref(file_path);

    // Upload image
    return ref.putString(data.image, 'data_url').then((snapshot: UploadTaskSnapshot) => {
      const pit_data = {};
      pit_data[data.team_number] = {
        team_number: data.team_number,
        drivetrain: data.drivetrain,
        comments: data.comments
      };

      // Update db
      return this.pit_scout.add(pit_data).then(() => {
        return Promise.resolve(true);
      });
    });
  }
}
