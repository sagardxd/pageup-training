import {
  Component,
  OnDestroy,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { LoaderService } from '../../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
