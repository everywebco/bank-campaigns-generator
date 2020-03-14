require('dotenv').config();

const scraper = require('./lib/scraper');
const firebase = require('./lib/firebase');

const log = console.log;

const run = async () => {
  try {
    log(process.env)
    const campaigns = await scraper.getCampaigns();
    const reducedCampaigns = reduceCampaignsData(campaigns);

    await firebase.storeData({
      campaigns: reducedCampaigns
    });

    log('All done!');
  } catch(err) {
    log(err);
  }
};

const reduceCampaignsData = campaigns => {
  return campaigns.map(el => {
    let { name, productCategory, productInformation, thumbnail, referralUrl } = el;
    referralUrl = referralUrl.replace('{distributorHost}', process.env.DISTRIBUTOR_HOST);
    referralUrl = referralUrl.replace('{distributorId}', process.env.DISTRIBUTOR_ID);

    return { name, productCategory, productInformation, thumbnail, referralUrl };
  });
};

run();
