import {listCampaign} from "./CampaignService.js";

export function CampaignList() {

  listCampaign().then(response => {
    console.log(response);
  })

  return (
      <div>Campaign list</div>
  )
}