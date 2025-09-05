// periodically checks flight status and triggers replanning
export function startFlightWatcher() {
  setInterval(() => {
    // TODO: connect to flight status API
    console.log('flight watcher tick');
  }, 60_000);
}
