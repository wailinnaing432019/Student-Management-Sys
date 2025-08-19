// const nrcData: Record<string, string[]> = {
//     '1': ['MaKaNa', 'WaMaNa', 'AhGaYa', 'MaKaTa', 'MaNyaNa', 'KaMaNa', 'TaMaNa', 'TaNaNa', 'KaPhaNa', 'SaLaNa', 'BaMaNa', 'YaKaNa', 'MaMaNa', 'MaSaNa', 'PaTaAh', 'SaPaBa', 'MaKhaBha', 'KhaBhaDa', 'NaMaNa'],
//     '2': ['LaKaNa', 'DaMaSa', 'PhaYaSa', 'YaTaNa', 'PhaSaNa', 'BhaLaKha'],
//     '3': ['BhaAhNa', 'LaBhaNa', 'PhaPaNa', 'ThaTaNa', 'KaKaYa', 'MaWaTa', 'KaSaKa'],
//     '4': ['HaKhaNa', 'PhaLaNa', 'HtaTaLa', 'TaTaNa', 'HtaZaNa', 'MaTaNa', 'MaTaPa', 'KaPaLa', 'PaLaWa'],
//     '5': ['SaKaNa', 'MaMaTa', 'MaMaNa', 'NgaZaNa', 'YaBaNa', 'KhaOuNa', 'WaLaNa', 'KaBaLa', 'YaOuNa', 'DaPaYa', 'TaSaNa', 'MaYaNa', 'BaTaLa', 'AhYaTa', 'KhaOuTa', 'YaMaPa', 'KaNaNa', 'SaLaKa', 'PaLaNa', 'KaThaNa', 'AhTaNa', 'HtaKhaNa', 'BhaMaNa', 'KaLaTa', 'WaThaNa', 'PaLaBa', 'MaLaNa', 'BhaPaNa', 'TaMaNa', 'KaLaWa', 'KaLaHta', 'MaKaNa', 'KhaTaNa', 'HaMaLa', 'LaYaNa', 'LaHaNa', 'NaYaNa'],
//     '6': ['HtaWaNa', 'LaLaNa', 'ThaYaKha', 'YaPhaNa', 'MaAhYa', 'MaAhNa', 'BaPaNa', 'PaLaNa', 'TaThaYa', 'KaThaNa'],
//     '7': ['PaKhaNa', 'ThaNaPa', 'KaWaNa', 'WaMaNa', 'NyaLaPa', 'KaTaKha', 'DhaOuNa', 'YaKaNa', 'PaMaNa', 'PaKhaTa', 'PaTaNa', 'PaTaTa', 'ThaKaNa', 'YaTaNa', 'ThaWaTa', 'LaPaTa', 'MaLaNa', 'AhPhaNa', 'ZaKaNa', 'NaTaLa', 'MaNyaNa', 'KaPaKa', 'TaNgaNa', 'YaTaYa', 'KaTaNa', 'PhaPaNa', 'AhTaNa', 'HtaTaPa'],
//     '8': ['MaKaNa', 'YaNaKha', 'KhaMaNa', 'TaTaKa', 'MaThaNa', 'NaMaNa', 'MaBaNa', 'PaPhaNa', 'NgaPhaNa', 'SaLaNa', 'SaTaYa', 'ThaYaNa', 'MaLaNa', 'MaTaNa', 'KaMaNa', 'AhLaNa', 'SaPaWa', 'PaKhaKa', 'YaSaKa', 'MaMaNa', 'PaMaNa', 'SaPhaNa', 'SaMaNa', 'GaGaNa', 'HtaLaNa'],
//     '9': ['MaYaTa', 'MaYaMa', 'MaNaTa', 'MaNaMa', 'AhPaYa', 'PaThaKa', 'PaTaYa', 'SaKaNa', 'MaThaNa', 'TaTaOu', 'MaKhaNa', 'TaThaNa', 'NaHtaKa', 'KaPaTa', 'NyaOuNa', 'YaMaTha', 'PaBaNa', 'TaKaNa', 'PaMaNa', 'LaWaNa', 'MaHtaLa', 'MaLaNa', 'ThaSaNa', 'WaTaNa'],
//     '10': ['MaLaMa', 'KaMaYa', 'KhaSaNa', 'ThaPhaYa', 'MaDhaNa', 'YaMaNa', 'ThaHtaNa', 'PaMaNa', 'KaHtaNa', 'BaLaNa'],
//     '11': ['SaTaNa', 'PaNaTa', 'YaThaTa', 'MaOuNa', 'KaTaNa', 'MaPaNa', 'PaTaNa', 'MaTaNa', 'BaThaTa', 'KaPhaNa', 'MaAhNa', 'YaPaNa', 'MaPaTa', 'AhMaNa', 'ThaTaNa', 'TaKaNa', 'GaMaNa'],
//     '12': ['MaGaDha', 'AhSaNa', 'OuKaMa', 'MaYaKa', 'KaMaYa', 'LaMaNa', 'OuKaTa', 'ThaGaKa', 'YaKaNa', 'KaMaTa', 'SaKhaNa', 'AhLaNa', 'LaMaTa', 'LaThaNa', 'PaBaTa', 'KaTaTa', 'BhaTaHta', 'PaZaTa', 'BhaHaNa', 'DhaGaNa', 'MaGaTa', 'TaMaNa', 'ThaKaTa', 'DhaPaNa', 'SaKaNa', 'DhaLaNa', 'SaKaMa', 'KaKaKa', 'ThaLaNa', 'KaTaNa', 'ThaKhaNa', 'KhaYaNa', 'TaTaNa', 'KaKhaKa', 'KaMaNa', 'MaBaNa', 'LaKaNa', 'TaKaNa', 'HtaTaPa'],
//     '13': ['TaKaNa', 'HaPaNa', 'NyaYaNa', 'SaSaNa', 'KaLaNa', 'PaTaYa', 'YaNgaNa', 'YaSaNa', 'PaLaNa', 'PhaKhaNa', 'LaLaNa', 'LaKhaNa', 'NaSaNa', 'KaHaNa', 'MaNaNa', 'LaKhaTa', 'MaMaNa', 'MaPaNa', 'KaThaNa', 'MaKaNa', 'MaYaNa', 'LaYaNa', 'ThaNaNa', 'TaYaNa', 'MaYaTa', 'KaKhaNa', 'MaSaTa', 'NaKhaNa', 'KaMaNa', 'NaKhaTa', 'NaSaNa', 'MaMaTa', 'MaBaNa', 'ThaPaNa', 'NaMaTa', 'KaLaTa', 'HaPaTa', 'KaKaNa', 'MaMaHta', 'PaWaNa', 'NaSaNa', 'WaZaTa', 'PaYaNa', 'KaTaNa', 'PaPaTa', 'MaYaNa', 'MaKhaNa', 'MaTaNa', 'MaSaNa', 'TaKhaLa', 'MaYaTa', 'MaPhaNa'],
//     '14': ['PaThaNa', 'PaThaYa', 'ThaPaNa', 'NgaPaTa', 'KaPaNa', 'YaKaNa', 'KaTaNa', 'HaThaTa', 'ZaLaNa', 'LaMaNa', 'MaAhNa', 'KaKhaNa', 'AhGaPa', 'MaMaNa', 'AhMaNa', 'LaPaTa', 'WaKhaMa', 'MaMaKa', 'MaAhPa', 'PaTaNa', 'NyaTaNa', 'DaNaPha']
// };
// export default nrcData;

const nrcData: Record<string, string[]> = {
    '၁': ['မကန', 'ဝမန', 'အဂရ', 'မကတ', 'မညန', 'ကမန', 'တနန', 'ခဖန', 'ဆလန', 'ဗမန', 'ရကန', 'မမန', 'မစန', 'ပတအ', 'ဆပဘ', 'မခဘ', ' ခဘဒ', 'နမန'],
    '၂': ['လကန', 'ဒမဆ', ' ဖရဆ', ' ရတန', 'ဖဆန', 'ဘလခ'],
    '၃': ['ဘအန', 'လဘန', ' ဖပန', ' သတန', 'ကကရ', ' မဝတ', 'ကဆက'],
    '၄': ['ဟခန', 'ဖလန', 'ထတလ', 'တတန', 'ထဇန', ' မတန', 'မတပ', 'ကပလ', ' ပလဝ'],
    '၅': ['စကန', 'မမတ', 'မမန', 'ငဇန', 'ရဘန', 'ခဥန', 'ဝလန', 'ကဘလ ', 'ကလန ', 'ရဥန', 'ဒပယ', 'တဆန', 'မရန', 'ဘတလ', 'အရတ', 'ခဥတ', 'ယမပ', 'ကနန  ', 'ဆလက  ', 'ပလန', 'ကသန', 'အတန', 'ထခန', 'ဗမန', 'ကလတ', 'ဝသန  ', 'ပလဘ', 'မလန', 'ဗပန', 'တမန', 'ကလဝ', 'ကလထ', 'မကန', 'ခတန', 'ဟမလ', 'လရန', 'လဟန  ', 'နယန'],
    '၆': ['ထ၀န', 'လလန', 'သရခ', 'ရဖန', 'မအရ', 'မအန', 'ဘပန', 'ပလန', 'တသရ', 'ကသန'],
    '၇': ['ပခန', 'သနပ ', 'က၀န', '၀မန', 'ညလပ', 'ကတခ ', 'ဒဥန', 'ရကန', 'ပမန', 'ပခတ', 'ပတန', 'ပတတ ', 'သကန', 'ရတန', 'သ၀တ', 'လပတ', 'မလန', 'အဖန', 'ဇကန', 'နတလ', 'မညန', 'ကပက ', 'တငန', 'ရတရ', 'ကတန', 'ဖပန', 'အတန', 'ထတပ'],
    '၈': ['မကန', 'ရနခ ', 'ခမန', 'တတက', 'မသန', 'နမန', 'မဘန', 'ပဖန', 'ငဖန ', 'စလန', 'စတရ', 'သရန', 'မလန', 'မတန', 'ကမန ', 'အလန', 'ဆပ၀', 'ပခက', 'ရစက', 'မမန', 'ပမန', 'ဆဖန', 'ဆမန', 'ဂဂန', 'ထလန'],
    '၉': ['မရတ', 'မရမ ', 'မနတ', 'မနမ ', 'အပရ', 'ပသက', 'ပတရ', 'စကန', 'မမန', 'မကန', 'သပက', 'ကဆန', 'စကန', 'မသန', 'တတဥ ', 'မခန', 'တသန', 'နထက', 'ကပတ', 'ညဥန', 'ရမသ', 'ပဘန', 'တကန', 'ပမန', 'လ၀န', 'မထလ', 'မလန', 'သစန', '၀တန'],
    '၁၀': ['မလမ', 'ကမရ', 'ခဆန', 'သဖရ', 'မဒန', 'ရမန', 'သထန', 'ပမန', 'ကထန', 'ဘလန'],
    '၁၁': ['စတန', 'ပဏတ', 'ရသတ', 'မဥန', 'ကတန', 'မပန', 'ပတန', 'မတန', 'ဘသတ', 'ကဖန', 'မအန', 'ရပန', 'မပတ', 'အမန', 'သတန', 'တကန', 'ဂမန'],
    '၁၂': ['မဂဒ', 'အစန', 'ဥကမ', 'မရက', 'ကမရ', 'လမန', 'ဥကတ', 'သဃက', 'ရကန', 'ကမတ', 'စခန', 'အလန', 'လမတ', 'လသန', 'ပဘတ', 'ကတတ', 'ဗတထ', 'ပဇတ', 'ဗဟန', 'ဒဂန', 'မဂတ', 'တမန', 'သကတ', 'ဒပန', 'ဆကန', 'ဒလန', 'ဆကမ', 'ကကက', 'သလန', 'ကတန', 'သခန', 'ခရန', 'တတန', 'ကခက', 'ကမန', 'မဘန', 'လကန', 'တကန', 'ထတပ'],
    '၁၃': ['တကန', 'ဟပန', 'ညရန', 'ဆဆန', 'ကလန', 'ပတယ', 'ရငန', 'ရစန', 'ပလန', 'ဖခန', 'လလန', 'လခန', 'နစန', 'ကဟန', 'မနန', 'လခတ', 'မမန', 'မပန', 'ကသန', 'မကန', 'မရန', 'လရန', 'သနန', 'တယန', 'မရတ', 'ကခန', 'မဆတ', 'နခန', 'ကမန', 'နခတ', 'နဆန', 'မမတ', 'မဘန', 'သပန', 'နမတ', 'ကလတ', 'ဟပတ', 'ကကန', 'မမထ', 'ပ၀န', 'နစန', '၀ဇတ', 'ပယန', 'ကတန', 'ကတန', 'ပပတ', 'မယန', 'မခန', 'မတန', 'မဆန', 'တခလ', 'မယတ', 'မဖန'],
    '၁၄': ['ပသန', 'ပသရ', 'သပန', 'ငပတ', 'ကပန', 'ရကန', 'ကတန', 'ဟသတ', 'ဇလန', 'လမန', 'မအန', 'ကခန', 'အဂပ', 'မမန', 'အမန', 'လပတ', '၀ခမ', 'မမက', 'မအပ', 'ပတန', 'ညတန', 'ဓနဖ'],
};



export default nrcData;
