export const gameSettings = {
  showValidMoves: true, 
  //highlightSelectedPiece: true,
  //soundEffects: true,
};

// Function to toggle a setting
export function toggleSetting(settingName) {
  if (settingName in gameSettings) {
    gameSettings[settingName] = !gameSettings[settingName];
    console.log(`${settingName} is now ${gameSettings[settingName] ? 'enabled' : 'disabled'}`);
    return gameSettings[settingName];
  } else {
    console.error(`Setting '${settingName}' does not exist`);
    return null;
  }
}