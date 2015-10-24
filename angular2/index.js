import {ComponentAnnotation as Component, ViewAnnotation as View, bootstrap} from 'angular2/angular2';


@Component({
	selector: 'Hello'
})
@View({
	template: '<h1 (click)="">Welcome</h1>'
})
class Hello{}

bootstrap(Hello);