import { Component } from '@angular/core';
import { VolumeComponent } from '../volume/volume.component';
import { TrackControlsComponent } from '../track-controls/track-controls.component';

@Component({
  selector: 'app-popover-controls',
  imports: [VolumeComponent, TrackControlsComponent],
  templateUrl: './popover-controls.component.html',
  styles: ``
})
export class PopoverControlsComponent {

}
