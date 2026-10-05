import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { CHART_FONT, CHART_HEX, isDarkTheme } from '../../charts/chart-theme';

@Component({
  selector: 'app-country-map',
  template: `<div #chartdiv style="width: 100%; height: 300px; border-radius: 1rem;"></div>`,
})
export class CountryMapComponent {
  @ViewChild('chartdiv', { static: true }) chartdiv!: ElementRef;
  root!: am5.Root;

  constructor(private zone: NgZone) { }

  ngOnInit() {
    const dark = isDarkTheme();
    this.zone.runOutsideAngular(() => {
      this.root = am5.Root.new(this.chartdiv.nativeElement);

      // amCharts defaults to its own font stack and its own palette, so both
      // are set explicitly here. The built-in DefaultTheme stays applied
      // underneath; this theme only layers the brand rules on top.
      const brandTheme = am5.Theme.new(this.root);
      brandTheme.rule('Label').setAll({
        fontFamily: CHART_FONT,
        fill: am5.color(dark ? CHART_HEX.cream : CHART_HEX.brand700),
      });
      this.root.setThemes([brandTheme]);

      let chart = this.root.container.children.push(
        am5map.MapChart.new(this.root, {
          panX: "none",
          panY: "none",
          wheelX: "none",
          wheelY: "none",
          projection: am5map.geoMercator(),
        })
      );

      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(this.root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"],
        })
      );

      // Sequential land fill: the lightest step of the green ramp, with a
      // warm stone stroke. Hover goes to the Authority green itself (§8).
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        interactive: true,
        fill: am5.color(dark ? CHART_HEX.brand100 : CHART_HEX.gray200),
        stroke: am5.color(dark ? CHART_HEX.brand700 : CHART_HEX.gray300),
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color(dark ? CHART_HEX.gold400 : CHART_HEX.brand700),
      });

      // Marker dots
      let pointSeries = chart.series.push(
        am5map.MapPointSeries.new(this.root, {})
      );

      const markers = [
        { lat: 37.2580397, lon: -104.657039, name: "United States" },
        { lat: 20.7504374, lon: 73.7276105, name: "India" },
        { lat: 53.613, lon: -11.6368, name: "United Kingdom" },
        { lat: -25.0304388, lon: 115.2092761, name: "Sweden" },
      ];

      markers.forEach(m => {
        let point = pointSeries.pushDataItem({
          latitude: m.lat,
          longitude: m.lon,
        });

        let circle = am5.Circle.new(this.root, {
          radius: 6,
          fill: am5.color(dark ? CHART_HEX.gold400 : CHART_HEX.brand700),
          stroke: am5.color(CHART_HEX.white),
          strokeWidth: 2,
        });
        circle.set("tooltipText", m.name);

        pointSeries.bullets.push(() =>
          am5.Bullet.new(this.root, {
            sprite: am5.Circle.new(this.root, {
              radius: 6,
              fill: am5.color(dark ? CHART_HEX.gold400 : CHART_HEX.brand700),
              stroke: am5.color(CHART_HEX.white),
              strokeWidth: 2,
              tooltipText: m.name
            })
          })
        );
      });
    });
  }

  ngOnDestroy() {
    this.root?.dispose();
  }
}