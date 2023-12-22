import {listCampaign} from "./CampaignService.js";
import {useAuth} from "react-oidc-context";

export function CampaignList() {
  const auth = useAuth();

  listCampaign(auth.user.access_token).then(response => {
    console.log(response);
  })

  return (
      <div>Campaign list</div>
  )
}