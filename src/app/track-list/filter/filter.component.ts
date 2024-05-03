import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Filter } from './filter';
import { IconDefinition, faCompactDisc, faFolderOpen, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './filter.component.html',
  styles: ``
})
export class FilterComponent implements OnInit {
  @Input() filter!: Filter;
  @Output() active: boolean = true;
  @Output() onSelected = new EventEmitter<Filter>();
  @Output() onDeselected = new EventEmitter<Filter>();
  @Input() index!: number;
  @ViewChild('filter') filterElement!: ElementRef;

  icon!: IconDefinition;
  text: string = '';
  filterType = Filter;

  @Output()
  result!: string;

  onClick() {
    this.setActive(true);
    this.onSelected.emit(this.filter);
  }

  onContextMenu() {
    this.setActive(false);
    this.onDeselected.emit(this.filter);
    
    return false;
  }

  public setActive(val: boolean) {
    this.active = val;

    if (this.active) {
      this.filterElement.nativeElement.classList.add('border-2', 'border-solid', 'border-cyan-300');
    } else {
      this.filterElement.nativeElement.classList.remove('border-2', 'border-solid', 'border-cyan-300');
    }
  }

  ngOnInit(): void {
    switch (this.filter) {
      case Filter.Album:
        this.icon = faCompactDisc;
        this.text = 'Album';
        break;
      case Filter.Artist:
        this.icon = faUser;
        this.text = 'Artist';
        break;
      case Filter.Playlist:
        this.icon = faFolderOpen;
        this.text = 'Playlist';
        break;
    }
  }
}