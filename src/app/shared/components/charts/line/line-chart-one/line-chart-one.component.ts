
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexFill,
  ApexMarkers,
  ApexGrid,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexLegend,
  NgApexchartsModule, ChartComponent } from 'ng-apexcharts';


import { CHART_FONT, CHART_LABEL_DARK, CHART_LABEL_LIGHT, chartSeries, isRtl } from '../../chart-theme';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-line-chart-one',
  imports: [
    NgApexchartsModule
],
  templateUrl: './line-chart-one.component.html',
  styles: ``
})
export class LineChartOneComponent implements OnInit, OnDestroy {

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
    toolbar: {
      show: false
    }
  };

  // Categorical order per Desing.md §8: Authority green, then gold.
  public colors: string[] = chartSeries().slice(0, 2);

  public stroke: ApexStroke = {
    curve: 'straight',
    width: [2, 2]
  };

  public fill: ApexFill = {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.55,
      opacityTo: 0
    }
  };

  public markers: ApexMarkers = {
    size: 0,
    strokeColors: '#ffffff',
    strokeWidth: 2,
    hover: {
      size: 6
    }
  };

  public grid: ApexGrid = {
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  };

  public dataLabels: ApexDataLabels = {
    enabled: false
  };

  public tooltip: ApexTooltip = {
    enabled: true,
    x: {
      format: 'dd MMM yyyy'
    }
  };

  public xaxis: ApexXAxis = {
    type: 'category',
    categories: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  };

  public yaxis: ApexYAxis = {
    labels: {
      style: {
        fontSize: '12px',
        colors: [CHART_LABEL_LIGHT]
      }
    },
    title: {
      text: '',
      style: {
        fontSize: '0px'
      }
    }
  };

  // Charts do not inherit `dir`; the legend side is set explicitly.
  public legend: ApexLegend = {
    show: false,
    position: 'top',
    horizontalAlign: isRtl() ? 'right' : 'left'
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
        style: {
          fontSize: '12px',
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
