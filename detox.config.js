module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/mobile/jest.config.js',
  specs: 'e2e/mobile',
  apps: {
    'demo.android': {
      type: 'android.apk',
      binaryPath: 'path/to/app.apk',
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_3' },
    },
  },
  configurations: {
    android: {
      device: 'emulator',
      app: 'demo.android',
    },
  },
};
