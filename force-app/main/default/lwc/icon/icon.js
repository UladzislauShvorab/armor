import { LightningElement, api } from "lwc";
import file from "./templates/file.html";
import bannerArrow from "./templates/bannerArrow.html";
import facebook from "./templates/facebook.html";
import linkedin from "./templates/linkedin.html";
import instagram from "./templates/instagram.html";
import youtube from "./templates/youtube.html";

export default class Icon extends LightningElement {
    @api type;

    render() {
        switch (this.type) {
            case "banner-arrow":
                return bannerArrow;
            case "file":
                return file;

            case "facebook":
                return facebook;
            case "instagram":
                return instagram;
            case "linkedin":
                return linkedin;
            case "youtube":
                return youtube;
            default:
                return super.render();
        }
    }
}
