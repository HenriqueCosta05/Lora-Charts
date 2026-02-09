import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3';
import * as topojson from 'topojson-client';
import { Topology, GeometryCollection } from 'topojson-specification';
import { ThemeService } from '../../../services/theme';
import { WorldMapDataPoint } from '../../../types/chart';
import { Tooltip, TooltipData } from '../../base/tooltip/tooltip';

export type WorldMapProjection =
  | 'equirectangular'
  | 'mercator'
  | 'orthographic'
  | 'naturalEarth1'
  | 'stereographic'
  | 'gnomonic'
  | 'azimuthalEqualArea'
  | 'azimuthalEquidistant'
  | 'conicEqualArea'
  | 'conicEquidistant'
  | 'equalEarth'
  | 'albers';

export interface WorldMapConfig {
  projection?: WorldMapProjection;
  rotate?: [number, number] | [number, number, number];
  showGraticule?: boolean;
  showOutline?: boolean;
  showCountryBorders?: boolean;
  animated?: boolean;
  landColor?: string;
  borderColor?: string;
  graticuleColor?: string;
  outlineColor?: string;
  oceanColor?: string;
  highlightColor?: string;
  colors?: string[];
  colorRange?: [string, string];
  topoJsonUrl?: string;
  customTooltip?: (data: { countryName: string; countryId: string; value?: number }) => {
    title?: string;
    items: Array<{ label: string; value: string | number; color?: string }>;
  };
}

const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

@Component({
  selector: 'app-worldmap',
  standalone: true,
  imports: [Tooltip],
  templateUrl: './worldmap.html',
  styleUrl: './worldmap.css',
})
export class WorldMap implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    themeService: ThemeService,
  ) {
    themeService.loadAndSetTheme('/themes/main.json');
  }

  @Input() data: WorldMapDataPoint[] = [];
  @Input() width: number = 960;
  @Input() height: number = 500;
  @Input() config: WorldMapConfig = {};

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private mapGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private projection!: GeoProjection;
  private path!: GeoPath<any, GeoPermissibleObjects>;
  private worldData: Topology | null = null;
  private destroyed = false;

  tooltipData: TooltipData[] = [];
  tooltipX: number = 0;
  tooltipY: number = 0;
  tooltipVisible: boolean = false;
  tooltipTitle: string = '';

  ngOnInit(): void {
    this.loadAndRender();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['width'] || changes['height'] || changes['config']) {
      if (this.svg) {
        // If projection type changed or no world data yet, reload
        if (changes['config'] && !changes['config'].firstChange) {
          const prev = changes['config'].previousValue as WorldMapConfig;
          const curr = changes['config'].currentValue as WorldMapConfig;
          if (prev?.projection !== curr?.projection || prev?.topoJsonUrl !== curr?.topoJsonUrl) {
            this.loadAndRender();
            return;
          }
        }
        if (this.worldData) {
          this.initializeChart();
          this.renderMap();
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  private loadAndRender(): void {
    const url = this.config.topoJsonUrl || WORLD_TOPO_URL;

    fetch(url)
      .then((res) => res.json())
      .then((world: Topology) => {
        if (this.destroyed) return;
        this.worldData = world;
        this.ngZone.run(() => {
          this.initializeChart();
          this.renderMap();
        });
      })
      .catch((err) => {
        console.error('Failed to load world TopoJSON data:', err);
      });
  }

  private createProjection(): GeoProjection {
    const projectionType = this.config.projection || 'equirectangular';
    const rotate = this.config.rotate;

    let proj: GeoProjection;

    switch (projectionType) {
      case 'mercator':
        proj = d3.geoMercator();
        break;
      case 'orthographic':
        proj = d3.geoOrthographic();
        break;
      case 'naturalEarth1':
        proj = d3.geoNaturalEarth1();
        break;
      case 'stereographic':
        proj = d3.geoStereographic();
        break;
      case 'gnomonic':
        proj = d3.geoGnomonic();
        break;
      case 'azimuthalEqualArea':
        proj = d3.geoAzimuthalEqualArea();
        break;
      case 'azimuthalEquidistant':
        proj = d3.geoAzimuthalEquidistant();
        break;
      case 'conicEqualArea':
        proj = d3.geoConicEqualArea();
        break;
      case 'conicEquidistant':
        proj = d3.geoConicEquidistant();
        break;
      case 'equalEarth':
        proj = d3.geoEqualEarth();
        break;
      case 'albers':
        proj = d3.geoAlbers();
        break;
      case 'equirectangular':
      default:
        proj = d3.geoEquirectangular();
        break;
    }

    if (rotate) {
      proj.rotate(rotate.length === 3 ? rotate : [...rotate, 0]);
    }

    return proj;
  }

  private initializeChart(): void {
    const container = d3.select(this.chartContainer.nativeElement);
    container.selectAll('*').remove();

    // Following the Observable reference:
    // 1. Create projection
    // 2. Fit it to width
    // 3. Calculate height from bounds
    const outline: GeoPermissibleObjects = { type: 'Sphere' };

    this.projection = this.createProjection();

    // Fit projection to width, then compute dynamic height from bounds
    this.projection.fitWidth(this.width, outline);
    const [[x0, y0], [x1, y1]] = d3.geoPath(this.projection).bounds(outline);
    const dy = Math.ceil(y1 - y0);
    const l = Math.min(Math.ceil(x1 - x0), dy);
    this.projection.scale((this.projection.scale() * (l - 1)) / l).precision(0.2);

    // Recalculate actual height based on projection
    const computedHeight = dy;
    const finalHeight = Math.min(computedHeight, this.height) || this.height;

    this.path = d3.geoPath(this.projection);

    this.svg = container
      .append('svg')
      .attr('viewBox', [0, 0, this.width, finalHeight])
      .attr('width', this.width)
      .attr('class', 'worldmap-svg')
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    this.mapGroup = this.svg.append('g').attr('class', 'map-group');
  }

  private renderMap(): void {
    if (!this.worldData || !this.mapGroup) return;

    this.mapGroup.selectAll('*').remove();

    const world = this.worldData;
    const outline: GeoPermissibleObjects = { type: 'Sphere' };
    const graticule = d3.geoGraticule10();

    // Build a data lookup map by country ID
    const dataMap = new Map<string, WorldMapDataPoint>();
    this.data.forEach((d) => dataMap.set(d.countryId, d));

    // Color scale for choropleth if data is provided
    let colorScale: d3.ScaleLinear<string, string> | null = null;
    if (this.data.length > 0) {
      const values = this.data.map((d) => d.value);
      const extent = d3.extent(values) as [number, number];
      const colorRange = this.config.colorRange || ['#dbeafe', '#1e40af'];
      colorScale = d3
        .scaleLinear<string>()
        .domain(extent)
        .range(colorRange)
        .interpolate(d3.interpolateHsl as any);
    }

    // 1. Draw ocean / outline (sphere)
    if (this.config.showOutline !== false) {
      this.mapGroup
        .append('path')
        .datum(outline)
        .attr('d', this.path)
        .attr('fill', this.config.oceanColor || '#e0f2fe')
        .attr('stroke', this.config.outlineColor || '#64748b')
        .attr('stroke-width', 1);
    }

    // 2. Draw graticule
    if (this.config.showGraticule !== false) {
      this.mapGroup
        .append('path')
        .datum(graticule)
        .attr('d', this.path)
        .attr('fill', 'none')
        .attr('stroke', this.config.graticuleColor || '#cbd5e1')
        .attr('stroke-width', 0.5)
        .attr('stroke-opacity', 0.5);
    }

    // 3. Draw land / countries
    // Try to render individual countries first (for interactivity), fall back to land
    const countriesObj = world.objects['countries'];
    const landObj = world.objects['land'];

    if (countriesObj) {
      const countries = topojson.feature(world, countriesObj as GeometryCollection);

      const countryPaths = this.mapGroup
        .selectAll('.country')
        .data((countries as any).features)
        .join('path')
        .attr('class', 'country')
        .attr('d', (d: any) => this.path(d))
        .attr('fill', (d: any) => {
          const id = String(d.id || d.properties?.name || '');
          const dataPoint = dataMap.get(id);
          if (dataPoint) {
            if (dataPoint.color) return dataPoint.color;
            if (colorScale) return colorScale(dataPoint.value);
          }
          return this.config.landColor || '#f1f5f9';
        })
        .attr('stroke', this.config.borderColor || '#94a3b8')
        .attr('stroke-width', 0.5)
        .attr('vector-effect', 'non-scaling-stroke');

      // Animate countries fading in
      if (this.config.animated !== false) {
        countryPaths
          .attr('opacity', 0)
          .transition()
          .duration(800)
          .delay((_: any, i: number) => i * 3)
          .attr('opacity', 1);
      }

      // Hover interactions
      countryPaths
        .style('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent, d: any) => {
          const el = d3.select(event.currentTarget as Element);
          el.raise()
            .transition()
            .duration(150)
            .attr('stroke-width', 1.5)
            .attr('stroke', this.config.highlightColor || '#1e293b');

          const id = String(d.id || d.properties?.name || '');
          const name = d.properties?.name || id;
          const dataPoint = dataMap.get(id);

          this.ngZone.run(() => {
            this.showTooltip(event, name, id, dataPoint);
          });
        })
        .on('mousemove', (event: MouseEvent) => {
          this.ngZone.run(() => {
            this.tooltipX = event.clientX;
            this.tooltipY = event.clientY;
            this.cdr.detectChanges();
          });
        })
        .on('mouseleave', (event: MouseEvent) => {
          const el = d3.select(event.currentTarget as Element);
          el.transition()
            .duration(150)
            .attr('stroke-width', 0.5)
            .attr('stroke', this.config.borderColor || '#94a3b8');

          this.ngZone.run(() => {
            this.hideTooltip();
          });
        });
    } else if (landObj) {
      // Fall back to land mass if individual countries not available
      const land = topojson.feature(world, landObj as GeometryCollection);

      const landPath = this.mapGroup
        .append('path')
        .datum(land)
        .attr('d', this.path)
        .attr('fill', this.config.landColor || '#f1f5f9')
        .attr('stroke', this.config.borderColor || '#94a3b8')
        .attr('stroke-width', 0.5);

      if (this.config.animated !== false) {
        landPath.attr('opacity', 0).transition().duration(1000).attr('opacity', 1);
      }
    }

    // 4. Re-draw outline stroke on top so it's clean
    if (this.config.showOutline !== false) {
      this.mapGroup
        .append('path')
        .datum(outline)
        .attr('d', this.path)
        .attr('fill', 'none')
        .attr('stroke', this.config.outlineColor || '#64748b')
        .attr('stroke-width', 1.5);
    }
  }

  private showTooltip(
    event: MouseEvent,
    countryName: string,
    countryId: string,
    dataPoint?: WorldMapDataPoint,
  ): void {
    if (this.config.customTooltip) {
      const customData = this.config.customTooltip({
        countryName,
        countryId,
        value: dataPoint?.value,
      });
      this.tooltipTitle = customData.title || '';
      this.tooltipData = customData.items.map((item) => ({
        label: item.label,
        value: item.value,
        color: item.color,
      }));
    } else {
      this.tooltipTitle = countryName;
      if (dataPoint) {
        this.tooltipData = [
          { label: 'Value', value: dataPoint.value },
          ...(dataPoint.metadata
            ? Object.entries(dataPoint.metadata).map(([key, val]) => ({
                label: key,
                value: String(val),
              }))
            : []),
        ];
      } else {
        this.tooltipData = [{ label: 'ID', value: countryId }];
      }
    }

    this.tooltipX = event.clientX;
    this.tooltipY = event.clientY;
    this.tooltipVisible = true;
    this.cdr.detectChanges();
  }

  private hideTooltip(): void {
    this.tooltipVisible = false;
    this.cdr.detectChanges();
  }
}
