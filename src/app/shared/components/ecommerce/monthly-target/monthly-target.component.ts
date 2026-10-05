import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  ApexOptions,
  NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component';

import { CHART_FONT, CHART_TEXT_DARK, CHART_TEXT_LIGHT, CHART_TRACK_DARK, CHART_TRACK_LIGHT, chartSeries } from '../../charts/chart-theme';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-monthly-target',
  imports: [
    NgApexchartsModule,
    DropdownComponent,
    DropdownItemComponent
  ],
  templateUrl: './monthly-target.component.html',
})
export class MonthlyTargetComponent implements OnInit, OnDestroy {
  public series: ApexNonAxisChartSeries = [75.55];
  public chart: ApexChart = {
    fontFamily: CHART_FONT,
    type: 'radialBar',
    height: 330,
    sparkline: { enabled: true },
  };
  public plotOptions: ApexPlotOptions = {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: { size: '80%' },
      track: {
        background: CHART_TRACK_LIGHT,
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '36px',
          fontWeight: '600',
          offsetY: 60,
          color: CHART_TEXT_LIGHT,
          formatter: (val: number) => `${val}%`,
        },
      },
    },
  };
  public fill: ApexFill = {
    type: 'solid',
    colors: [chartSeries()[0]],
  };
  public stroke: ApexStroke = {
    lineCap: 'round',
  };
  public labels: string[] = ['Progress'];
  public colors: string[] = [chartSeries()[0]];

  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  @ViewChild(ChartComponent) private chartRef?: ChartComponent;

  private themeSub?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Charts hold plain colour arrays, so they have to be told when the theme
    // flips — they do not re-read CSS variables on their own.
    this.themeSub = this.themeService.theme$.subscribe((theme) =>
      this.applyTheme(theme === 'dark'),
    );
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }

  private applyTheme(dark: boolean): void {
    this.colors = [chartSeries(dark)[0]];
    this.plotOptions = {
      ...this.plotOptions,
      radialBar: {
        ...(this.plotOptions.radialBar ?? {}),
        track: {
          ...(this.plotOptions.radialBar?.track ?? {}),
          background: dark ? CHART_TRACK_DARK : CHART_TRACK_LIGHT,
        },
        dataLabels: {
          ...(this.plotOptions.radialBar?.dataLabels ?? {}),
          value: {
            ...(this.plotOptions.radialBar?.dataLabels?.value ?? {}),
            color: dark ? CHART_TEXT_DARK : CHART_TEXT_LIGHT,
          },
        },
      },
    };
    this.pushOptions({ colors: this.colors, plotOptions: this.plotOptions });
  }

  /**
   * The chart is already built by the time the theme flips, and re-binding the
   * option inputs does not reliably trigger a re-create, so the new options go
   * through ApexCharts' own `updateOptions` instead. Before the view exists,
   * the field assignments above are what the first render picks up.
   */
  private pushOptions(options: Record<string, unknown>): void {
    this.chartRef?.updateOptions(options, false, false);
  }
}
