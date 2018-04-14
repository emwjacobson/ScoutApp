import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserCredential, User } from '@firebase/auth-types';
import { FirebaseFunctions, HttpsCallableResult } from '@firebase/functions-types';
import firebase from '@firebase/app';
import '@firebase/functions';

@Injectable()
export class BackendService {
  private createUser = firebase.functions().httpsCallable('registerUser');
  private user: User = null;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
    this.auth.authState.subscribe((user: User) => {
      this.user = user;
    }, (error) => {
      console.log('Error in authState', error);
    });
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

  public getUser(): User {
    return this.user;
  }
}
