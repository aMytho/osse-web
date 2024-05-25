import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-visualizer',
  standalone: true,
  imports: [],
  templateUrl: './visualizer.component.html',
  styles: ``
})
export class VisualizerComponent implements AfterViewInit {
  @ViewChild('visualizer') canvas!: ElementRef<HTMLCanvasElement>;
  private trackWaveform = [80, 70, 40, 90, 50, -20, -30, -40];


  ngAfterViewInit(): void {
    let ctx = this.canvas.nativeElement.getContext("2d")!;
    
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 10;
    
    
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 100);
    ctx.stroke();
  }
}
