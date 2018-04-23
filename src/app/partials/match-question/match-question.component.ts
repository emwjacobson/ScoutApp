import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-match-question',
  templateUrl: './match-question.component.html',
  styleUrls: ['./match-question.component.less']
})
export class MatchQuestionComponent implements OnInit {
  @Input() data: any;
  @Input() form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  inc() {
    // This is kinda hacky... (maybe use 'controls' property of FormGroup??)
    const ele: HTMLFormElement = <HTMLFormElement>document.getElementById(this.data.name);
    ele.value = ++this.form.value[this.data.name];
  }

  dec() {
    // Also kinda hacky...
    const ele: HTMLFormElement = <HTMLFormElement>document.getElementById(this.data.name);
    if (ele.value > 0) {
      ele.value = --this.form.value[this.data.name];
    }
  }

}
