import {
    disableTheme, enableTheme, getAllThemes, getCurrentTheme, isThemeDisabled,
    isTimerActive, removeShowTimer, setShowTimer
} from "../utils/themes.js";

function onCheckbox_IsRunning_ValueChanged(event)
{
    if (event.target.checked) {
        setShowTimer();
    } else {
        removeShowTimer();
    }
}

function onCheckbox_ThemeSelection_ValueChanged(id, checked)
{
    console.log("Theme " + id + " state is " + checked);
    if (checked) {
        enableTheme(id);
    } else {
        disableTheme(id);
    }
}

document.addEventListener('DOMContentLoaded', async () =>
{
    // Event for the show
    const checkboxIsRunning = document.getElementById('checkboxIsRunning');
    checkboxIsRunning.checked = isTimerActive();
    checkboxIsRunning.addEventListener('change', onCheckbox_IsRunning_ValueChanged);
    // Init the list of themes
    const themesList = document.getElementById('themeListContainer');
    const allThemes = await getAllThemes();
    // Init all the single theme elements
    for (let theme of allThemes) {
        const themeElement = document.createElement('label');
        themeElement.className = 'theme-item';

        const themeCheckbox = document.createElement('input');
        themeCheckbox.type = 'checkbox';
        themeCheckbox.checked = !(await isThemeDisabled(theme.id));
        themeCheckbox.id = theme.id;
        themeCheckbox.addEventListener('change', event => {
            onCheckbox_ThemeSelection_ValueChanged(event.target.id, event.target.checked);
        });

        const themeName = document.createElement('span');
        themeName.textContent = theme.name;
        themeElement.appendChild(themeCheckbox);
        themeElement.appendChild(themeName);
        // Add theme selection element
        themesList.appendChild(themeElement);
    }
    // Set current theme name
    const currentTheme = document.getElementById('currentThemeName');
    const currentThemeInfo = await getCurrentTheme();
    if (currentTheme != null) {
        currentTheme.textContent = currentThemeInfo.name;
    }
    browser.management.onEnabled.addListener(info => {
        currentTheme.textContent = info.name;
    });
});
