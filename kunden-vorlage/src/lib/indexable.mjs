import site from "../content/site.json" with { type: "json" };

// Nur die Produktion mit live:true darf in Suchmaschinen; DEPLOY_ENV setzt GitHub Actions.
export const indexable = site.live === true && process.env.DEPLOY_ENV === "production";
