import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FilterComponent } from "./filter/filter.component";
import { Filter } from './filter/filter';
import { TrackService } from '../shared/services/track/track.service';
import { ApiService } from '../shared/services/api.service';
import { HomeComponent } from '../home/home.component';
import { HeaderComponent } from '../shared/ui/header/header.component';

@Component({
    selector: 'app-track-list',
    standalone: true,
    templateUrl: './track-list.component.html',
    styles: ``,
    imports: [HomeComponent, FilterComponent, HeaderComponent]
})
export class TrackListComponent implements AfterViewInit {
  @ViewChild('search') searchBar!: ElementRef;
  @ViewChildren(FilterComponent) filterComponents!: QueryList<FilterComponent>;
  
  filterTypes = Filter;
  filterList: Filter[] = [Filter.Album, Filter.Playlist, Filter.Artist];
  activeFilters: Set<Filter> = new Set([Filter.Album, Filter.Playlist, Filter.Artist]);

  constructor(
    private trackService: TrackService,
    private apiService: ApiService
  ) {}

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

  public async onSubmit() {
    let tracks = await this.apiService.getAllTracks();
    for (let track of tracks) {
      this.trackService.addTrack(track);
    }
  }
}
