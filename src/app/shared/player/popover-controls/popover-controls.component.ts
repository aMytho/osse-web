import { Component } from '@angular/core';
import { VolumeComponent } from '../volume/volume.component';
import { TrackControlsComponent } from '../track-controls/track-controls.component';
import { DurationComponent } from '../duration/duration.component';

@Component({
  selector: 'app-popover-controls',
  imports: [VolumeComponent, TrackControlsComponent, DurationComponent],
  templateUrl: './popover-controls.component.html',
  styles: ``
})
export class PopoverControlsComponent {

}
