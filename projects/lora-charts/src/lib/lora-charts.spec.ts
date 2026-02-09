import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoraCharts } from './lora-charts';

describe('LoraCharts', () => {
  let component: LoraCharts;
  let fixture: ComponentFixture<LoraCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoraCharts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoraCharts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
