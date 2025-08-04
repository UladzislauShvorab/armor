import { LightningElement, api } from "lwc";
import bannerArrow from "./templates/bannerArrow.html";

export default class Icon extends LightningElement {
    @api type;

    render() {
        switch (this.type) {
            case "banner-arrow":
                return bannerArrow;
            default:
                return super.render();
        }
    }
}
