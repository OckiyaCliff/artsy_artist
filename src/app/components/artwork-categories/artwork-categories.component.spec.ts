import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkCategoriesComponent } from './artwork-categories.component';

describe('ArtworkCategoriesComponent', () => {
  let component: ArtworkCategoriesComponent;
  let fixture: ComponentFixture<ArtworkCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtworkCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtworkCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
