import { Component } from '@angular/core';
import { FormDesignerComponent } from './components/form-designer/form-designer.component';

@Component({
  selector: 'app-root',
  imports: [
    FormDesignerComponent,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'self-assembly';
}
