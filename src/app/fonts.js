import localFont from 'next/font/local';

export const crimson = localFont({
    src : [
        {
            path: '../../public/fonts/Crimson_Text/CrimsonText-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Crimson_Text/CrimsonText-BoldItalic.ttf',
            weight: '700',
            style: 'italic',
        },
        {
            path: '../../public/fonts/Crimson_Text/CrimsonText-Italic.ttf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../public/fonts/Crimson_Text/CrimsonText-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Crimson_Text/CrimsonText-SemiBold.ttf',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../public/fonts/Crimson_Text/CrimsonText-SemiBoldItalic.ttf',
            weight: '600',
            style: 'italic',
        },
    ],
    variable : '--crimson-text'
})