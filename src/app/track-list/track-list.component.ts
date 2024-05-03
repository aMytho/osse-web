import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TrackComponent } from "../player/track/track.component";
import { FilterComponent } from "./filter/filter.component";
import { Filter } from './filter/filter';

@Component({
    selector: 'app-track-list',
    standalone: true,
    templateUrl: './track-list.component.html',
    styles: ``,
    imports: [TrackComponent, FilterComponent]
})
export class TrackListComponent implements AfterViewInit {
  @ViewChild('search') searchBar!: ElementRef;
  @ViewChildren(FilterComponent) filterComponents!: QueryList<FilterComponent>;
  
  filterTypes = Filter;
  filterList: Filter[] = [Filter.Album, Filter.Playlist, Filter.Artist];
  activeFilters: Set<Filter> = new Set([Filter.Album, Filter.Playlist, Filter.Artist]);

  /**
   * When a filter is selected, add it to the list
   */
  onFilterSelected(selectedFilter: Filter) {
    this.activeFilters.add(selectedFilter);
  }

  onFilterDeselected(selectedFilter: Filter) {
    this.activeFilters.delete(selectedFilter);
  }

  ngAfterViewInit(): void {
    this.searchBar.nativeElement.focus();
  }
}