module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        'react-native-reanimated/plugin',
        [
            'module-resolver',
            {
                root: ['./'],
                alias: {
                    '@': './src',
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@services': './src/services',
                    '@theme': './src/theme',
                    '@i18n': './src/i18n',
                    '@store': './src/store',
                    '@utils': './src/utils',
                    '@assets': './assets',
                },
            },
        ],
    ],
};
