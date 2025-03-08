import { Component, output } from '@angular/core';
import { VolumeComponent } from '../volume/volume.component';
import { TrackControlsComponent } from '../track-controls/track-controls.component';
import { DurationComponent } from '../duration/duration.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { mdiClose } from '@mdi/js';
import { JumpControlsComponent } from '../jump-controls/jump-controls.component';

@Component({
  selector: 'app-popover-controls',
  imports: [VolumeComponent, TrackControlsComponent, DurationComponent, JumpControlsComponent, IconComponent],
  templateUrl: './popover-controls.component.html',
  styles: ``
})
export class PopoverControlsComponent {
  public onClose = output();
  close = mdiClose;
}
