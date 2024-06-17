export async function getAllThemes()
{
    let allAddons = await browser.management.getAll();
    return allAddons.filter(extension => extension.type === 'theme');
}

export async function getAllEnabledThemes()
{
    let allThemes = await getAllThemes();
    let enabledThemes = [];
    for (let theme of allThemes) {
        if (!await isThemeDisabled(theme.id)) {
            enabledThemes.push(theme);
        }
    }
    return enabledThemes;
}

export async function getAllDisabledThemeIDs()
{
    let { deactivatedThemesList } = await browser.storage.local.get('deactivatedThemesList');
    if (!deactivatedThemesList) {
        deactivatedThemesList = [];
    }
    return deactivatedThemesList;
}

export async function getCurrentTheme()
{
    let allThemes = await getAllThemes();
    let currentTheme = allThemes.find(ext => ext.enabled);

    if (currentTheme) {
        return currentTheme;
    } else {
        return null;
    }
}

export async function enableTheme(id)
{
    let { deactivatedThemesList } = await browser.storage.local.get('deactivatedThemesList');
    if (!deactivatedThemesList) {
        deactivatedThemesList = [];
    }

    const index = deactivatedThemesList.indexOf(id);
    if (index > -1) {
        // Remove id from list
        deactivatedThemesList.splice(index, 1);
        await browser.storage.local.set({ deactivatedThemesList });
    }
}

export async function disableTheme(id)
{
    let { deactivatedThemesList } = await browser.storage.local.get('deactivatedThemesList');
    if (!deactivatedThemesList) {
        deactivatedThemesList = [];
    }

    if (!deactivatedThemesList.includes(id)) {
        // Add id to list
        deactivatedThemesList.push(id);
        await browser.storage.local.set({ deactivatedThemesList });
    }
}

export async function isThemeDisabled(id)
{
    let { deactivatedThemesList } = await browser.storage.local.get('deactivatedThemesList');
    if (!deactivatedThemesList) {
        return false;
    }

    let index = deactivatedThemesList.indexOf(id);
    return index > -1;
}

export async function setRandomTheme()
{
    let activeThemes = await getAllEnabledThemes();
    if (activeThemes.length > 0) {
        let randomTheme = activeThemes[Math.floor(Math.random() * activeThemes.length)];
        await browser.management.setEnabled(randomTheme.id, true);
        console.log("Enabled theme: " + randomTheme.id);
    } else {
        console.log("No active themes available to enable.");
    }
}

export function setShowTimer(intervalInMinutes = 1)
{
    browser.alarms.create("switchTheme",{
        delayInMinutes: intervalInMinutes,
        periodInMinutes: intervalInMinutes
    });
    let timerActive = true;
    browser.storage.local.set({ timerActive });
}

export function removeShowTimer()
{
    browser.alarms.clear("switchTheme");
    let timerActive = false;
    browser.storage.local.set({ timerActive });
}

export function isTimerActive()
{
    let timerActive = browser.storage.local.get('timerActive');
    if (timerActive) {
        return true;
    }
    return false;
}

browser.runtime.onMessage.addListener(async (message) => {
    if (message.command === 'setRandomTheme') {
        await setRandomTheme();
        return Promise.resolve({ response: "Random theme has been set" })
    }
});
