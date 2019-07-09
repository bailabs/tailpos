import config from ".././boot/configureStore";
const stores = config();

export function currentLanguage() {
    return {
        companyLanguage: stores.printerStore.companySettings.length > 0 ? stores.printerStore.companySettings[0].companyLanguage : "en"
    };
}
