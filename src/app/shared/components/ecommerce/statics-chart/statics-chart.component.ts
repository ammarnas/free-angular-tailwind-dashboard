
import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { ChartTabComponent } from '../../common/chart-tab/chart-tab.component';

import { CHART_FONT, CHART_LABEL_DARK, CHART_LABEL_LIGHT, chartSeries } from '../../charts/chart-theme';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-statics-chart',
  imports: [NgApexchartsModule, ChartTabComponent],
  templateUrl: './statics-chart.component.html',
})
export class StatisticsChartComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('datepicker') datepicker!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    flatpickr(this.datepicker.nativeElement, {
      mode: 'range',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'M j',
      defaultDate: [new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), new Date()],
      onReady: (selectedDates: Date[], dateStr: string, instance: Instance) => {
        (instance.element as HTMLInputElement).value = dateStr.replace('to', '-');
        const customClass = instance.element.getAttribute('data-class');
        instance.calendarContainer?.classList.add(customClass!);
      },
      onChange: (selectedDates: Date[], dateStr: string, instance: Instance) => {
        (instance.element as HTMLInputElement).value = dateStr.replace('to', '-');
      },
    });
  }
  public series: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: 'Revenue',
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];

  public chart: ApexChart = {
    fontFamily: CHART_FONT,
    height: 310,
    type: 'area',
    toolbar: { show: false },
  };

  public colors: string[] = chartSeries().slice(0, 2);

  public stroke: ApexStroke = {
    curve: 'straight',
    width: [2, 2],
  };

  public fill: ApexFill = {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.55,
      opacityTo: 0,
    },
  };

  public markers: ApexMarkers = {
    size: 0,
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 6 },
  };

  public grid: ApexGrid = {
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  };

  public dataLabels: ApexDataLabels = { enabled: false };

  public tooltip: ApexTooltip = {
    enabled: true,
    x: { format: 'dd MMM yyyy' },
  };

  public xaxis: ApexXAxis = {
    type: 'category',
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  };

  public yaxis: ApexYAxis = {
    labels: {
      style: {
        fontSize: '12px',
        colors: [CHART_LABEL_LIGHT],
      },
    },
    title: {
      text: '',
      style: { fontSize: '0px' },
    },
  };

  public legend: ApexLegend = {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
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
    this.colors = chartSeries(dark).slice(0, 2);
    this.yaxis = {
      ...this.yaxis,
      labels: {
        ...(this.yaxis.labels ?? {}),
        style: {
          ...(this.yaxis.labels?.style ?? {}),
          colors: [dark ? CHART_LABEL_DARK : CHART_LABEL_LIGHT],
        },
      },
    };
    this.pushOptions({ colors: this.colors, yaxis: this.yaxis });
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
