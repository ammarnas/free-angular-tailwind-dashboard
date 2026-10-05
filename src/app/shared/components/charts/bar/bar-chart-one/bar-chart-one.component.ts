import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexFill,
  ApexTooltip, ChartComponent } from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';



import { CHART_FONT, chartSeries } from '../../chart-theme';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-bar-chart-one',
  imports: [
    NgApexchartsModule
],
  templateUrl: './bar-chart-one.component.html',
  styles: ``
})
export class BarChartOneComponent implements OnInit, OnDestroy {

  public series: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  public chart: ApexChart = {
    fontFamily: CHART_FONT,
    type: 'bar',
    height: 180,
    toolbar: {
      show: false,
    },
  };

  public colors: string[] = [chartSeries()[0]];

  public plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  };

  public dataLabels: ApexDataLabels = {
    enabled: false,
  };

  public stroke: ApexStroke = {
    show: true,
    width: 4,
    colors: ['transparent'],
  };

  public xaxis: ApexXAxis = {
    categories: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  };

  public yaxis: ApexYAxis = {
    title: {
      text: undefined,
    },
  };

  public legend: ApexLegend = {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: CHART_FONT,
  };

  public grid: ApexGrid = {
    yaxis: {
      lines: {
        show: true,
      },
    },
  };

  public fill: ApexFill = {
    opacity: 1,
  };

  public tooltip: ApexTooltip = {
    x: {
      show: false,
    },
    y: {
      formatter: (val: number) => `${val}`,
    },
  };

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
    this.pushOptions({ colors: this.colors });
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
