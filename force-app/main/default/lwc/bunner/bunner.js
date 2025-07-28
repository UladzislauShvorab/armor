import { LightningElement, api } from 'lwc';

export default class CustomCard extends LightningElement {
  @api backgroundImageUrl;
  @api title;
  @api description;
  @api maxTitleWidth;
  @api maxDescriptionWidth;
  @api breadcrumb1;
  @api breadcrumb2;
  @api breadcrumb3;

  get backgroundImageStyle() {
    return this.backgroundImageUrl
      ? `background-image: url(${this.backgroundImageUrl});`
      : '';
  }

  get titleStyle() {
    return this.maxTitleWidth
      ? `max-width: ${this.maxTitleWidth}px;`
      : '';
  }

  get descriptionStyle() {
    return this.maxDescriptionWidth
      ? `max-width: ${this.maxDescriptionWidth}px;`
      : '';
  }

  get hasBreadcrumbs() {
    return this.breadcrumb1 || this.breadcrumb2 || this.breadcrumb3;
  }
}
