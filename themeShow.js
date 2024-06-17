import { setRandomTheme, setShowTimer } from "./utils/themes.js";

setShowTimer();

browser.alarms.onAlarm.addListener(async alarm => {
    if (alarm.name === "switchTheme") {
        await setRandomTheme();
    }
});
