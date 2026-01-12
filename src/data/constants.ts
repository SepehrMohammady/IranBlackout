// Iran Blackout - Constants Data
// Province and ISP reference data

import { Province, ISP } from '../types';

// Iran's 31 provinces with English and Farsi names
export const iranProvinces: Omit<Province, 'status' | 'lastUpdated'>[] = [
    { id: 'IR.TH', nameEn: 'Tehran', nameFa: 'تهران', population: 13000000 },
    { id: 'IR.ES', nameEn: 'Isfahan', nameFa: 'اصفهان', population: 5200000 },
    { id: 'IR.FA', nameEn: 'Fars', nameFa: 'فارس', population: 4900000 },
    { id: 'IR.KV', nameEn: 'Razavi Khorasan', nameFa: 'خراسان رضوی', population: 6400000 },
    { id: 'IR.EA', nameEn: 'East Azerbaijan', nameFa: 'آذربایجان شرقی', population: 3900000 },
    { id: 'IR.KZ', nameEn: 'Khuzestan', nameFa: 'خوزستان', population: 4700000 },
    { id: 'IR.AL', nameEn: 'Alborz', nameFa: 'البرز', population: 2700000 },
    { id: 'IR.GI', nameEn: 'Gilan', nameFa: 'گیلان', population: 2500000 },
    { id: 'IR.KE', nameEn: 'Kerman', nameFa: 'کرمان', population: 3200000 },
    { id: 'IR.WA', nameEn: 'West Azerbaijan', nameFa: 'آذربایجان غربی', population: 3300000 },
    { id: 'IR.MN', nameEn: 'Mazandaran', nameFa: 'مازندران', population: 3300000 },
    { id: 'IR.BK', nameEn: 'Kermanshah', nameFa: 'کرمانشاه', population: 2000000 },
    { id: 'IR.MK', nameEn: 'Markazi', nameFa: 'مرکزی', population: 1400000 },
    { id: 'IR.GO', nameEn: 'Golestan', nameFa: 'گلستان', population: 1900000 },
    { id: 'IR.LO', nameEn: 'Lorestan', nameFa: 'لرستان', population: 1800000 },
    { id: 'IR.HD', nameEn: 'Hamadan', nameFa: 'همدان', population: 1800000 },
    { id: 'IR.SM', nameEn: 'Semnan', nameFa: 'سمنان', population: 700000 },
    { id: 'IR.QM', nameEn: 'Qom', nameFa: 'قم', population: 1300000 },
    { id: 'IR.QZ', nameEn: 'Qazvin', nameFa: 'قزوین', population: 1300000 },
    { id: 'IR.KD', nameEn: 'Kurdistan', nameFa: 'کردستان', population: 1600000 },
    { id: 'IR.ZA', nameEn: 'Zanjan', nameFa: 'زنجان', population: 1100000 },
    { id: 'IR.AR', nameEn: 'Ardabil', nameFa: 'اردبیل', population: 1300000 },
    { id: 'IR.SB', nameEn: 'Sistan and Baluchestan', nameFa: 'سیستان و بلوچستان', population: 2800000 },
    { id: 'IR.YA', nameEn: 'Yazd', nameFa: 'یزد', population: 1100000 },
    { id: 'IR.HG', nameEn: 'Hormozgan', nameFa: 'هرمزگان', population: 1800000 },
    { id: 'IR.KS', nameEn: 'North Khorasan', nameFa: 'خراسان شمالی', population: 900000 },
    { id: 'IR.KJ', nameEn: 'South Khorasan', nameFa: 'خراسان جنوبی', population: 800000 },
    { id: 'IR.KB', nameEn: 'Kohgiluyeh', nameFa: 'کهگیلویه و بویراحمد', population: 700000 },
    { id: 'IR.CM', nameEn: 'Chaharmahal', nameFa: 'چهارمحال و بختیاری', population: 1000000 },
    { id: 'IR.BS', nameEn: 'Bushehr', nameFa: 'بوشهر', population: 1200000 },
    { id: 'IR.IL', nameEn: 'Ilam', nameFa: 'ایلام', population: 600000 },
];

// Major ISPs/MNOs in Iran
export const iranISPs: Omit<ISP, 'status' | 'lastUpdated'>[] = [
    {
        id: 'mci',
        nameEn: 'MCI (Hamrah-e Aval)',
        nameFa: 'همراه اول',
        type: 'mobile',
    },
    {
        id: 'irancell',
        nameEn: 'Irancell (MTN)',
        nameFa: 'ایرانسل',
        type: 'mobile',
    },
    {
        id: 'rightel',
        nameEn: 'Rightel',
        nameFa: 'رایتل',
        type: 'mobile',
    },
    {
        id: 'tci',
        nameEn: 'TCI (Mokhaberat)',
        nameFa: 'مخابرات',
        type: 'fixed',
    },
    {
        id: 'shatel',
        nameEn: 'Shatel',
        nameFa: 'شاتل',
        type: 'fixed',
    },
    {
        id: 'asiatech',
        nameEn: 'Asiatech',
        nameFa: 'آسیاتک',
        type: 'fixed',
    },
    {
        id: 'pars_online',
        nameEn: 'Pars Online',
        nameFa: 'پارس آنلاین',
        type: 'fixed',
    },
    {
        id: 'hiweb',
        nameEn: 'HiWEB',
        nameFa: 'های‌وب',
        type: 'fixed',
    },
];

// Status colors mapping
export const statusColors = {
    online: { light: '#22C55E', dark: '#4ADE80' },
    limited: { light: '#F59E0B', dark: '#FBBF24' },
    offline: { light: '#EF4444', dark: '#F87171' },
    unknown: { light: '#6B7280', dark: '#9CA3AF' },
};

// Map province IDs match the SVG data-id attributes
export const provinceIdToSvgId: Record<string, string> = {
    'IR.TH': 'tehran',
    'IR.ES': 'esfahan',
    'IR.FA': 'fars',
    // ... etc, matches Map 2.svg data-id attributes
};
