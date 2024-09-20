import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() pageIndex: number = 0;

  @Output() pageChange = new EventEmitter<PageEvent>();

  onPageEvent(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
