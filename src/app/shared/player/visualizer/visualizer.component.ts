import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { WebAudioService } from '../web-audio.service';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
})
export class VisualizerComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private width = 0;
  private height = 0;

  constructor(private webAudioService: WebAudioService) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth * dpr;
    this.width = this.canvas.nativeElement.width;
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight * dpr;
    this.height = this.canvas.nativeElement.height;

    this.drawVisualizer();
  }

  private drawVisualizer() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.drawFrequencyBars();
    };
    draw();
  }

  private drawFrequencyBars() {
    const data = this.webAudioService.getFrequencyData();
    const barWidth = this.canvas.nativeElement.width / data.length;

    data.forEach((value, i) => {
      const barHeight = (value / 255) * this.canvas.nativeElement.height;

      // Create gradient from bottom (green) to top (light green)
      const gradient = this.ctx.createLinearGradient(0, this.canvas.nativeElement.height - barHeight, 0, this.canvas.nativeElement.height);
      gradient.addColorStop(0, 'rgb(52, 211, 153)');  // Bottom color
      gradient.addColorStop(1, 'rgb(167, 243, 208)'); // Top color

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(i * barWidth, this.canvas.nativeElement.height - barHeight, barWidth, barHeight);
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }
}
