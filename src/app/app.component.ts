import { Component, ViewChild } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-observable-exhaustmap';

  //inner observable
  srcObservable = of(1, 2, 3, 4)
  innerObservable = of('A', 'B', 'C', 'D')

  ngOnInit() {
    this.srcObservable.pipe(
      exhaustMap(val => {
        console.log('Source value ' + val)
        console.log('starting new observable')
        return this.innerObservable
      })
    )
      .subscribe(ret => {
        console.log('Recd ' + ret);
      })
  }

  //button example
  count = 0;
  @ViewChild('btn', { static: true }) button;
  clicks$: Observable<any>;

  ngAfterViewInit() {
    this.clicks$ = fromEvent(this.button.nativeElement, 'click');
    this.exhaustMapExample();
  }

  delayedObs(count: number) {
    return new Observable((observer) => {
      setTimeout(() => { observer.next(count + " A") }, 1000);
      setTimeout(() => { observer.next(count + " B") }, 2000);
      setTimeout(() => { observer.next(count + " C") }, 3000);
      setTimeout(() => { observer.next(count + " D") }, 4000);
      setTimeout(() => { observer.next(count + " E"); observer.complete() }, 5000);
    })
  }

  exhaustMapExample() {

    let obs =

      this.clicks$
        .pipe(
          exhaustMap(() => {
            this.count = this.count + 1;
            return this.delayedObs(this.count)
          })
        )
        .subscribe(val => console.log(val));
  }

}
