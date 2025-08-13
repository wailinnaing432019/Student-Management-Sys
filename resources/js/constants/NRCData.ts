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
    '1': ['မကန', 'ဝမန', 'အဂရ', 'မကတ', 'မညန', 'ကမန', 'တမန', 'တနန', 'ကဖန', 'ဆလန', 'ဗမန', 'ယကန', 'မမန', 'မစန', 'ပတအ', 'ဆပဗ', 'မခဘ', 'ခဗဒ', 'နမန'],
    '2': ['လကန', 'ဒမစ', 'ဖယစ', 'ယတန', 'ဖစန', 'ဘလခ'],
    '3': ['ဘအန', 'လဘန', 'ဖပန', 'သတန', 'ကကယ', 'မဝတ', 'ကစက'],
    '4': ['ဟခန', 'ဖလန', 'ဌတလ', 'တတန', 'ဌဇန', 'မတန', 'မတပ', 'ကပလ', 'ပလဝ'],
    '5': ['ဆကန', 'မမတ', 'မမန', 'ငဇန', 'ယဘန', 'ခအန', 'ဝလန', 'ကဘလ', 'ယအန', 'ဒပယ', 'တဆန', 'မယန', 'ဗတလ', 'အယတ', 'ခအတ', 'ယမပ', 'ကနန', 'ဆလက', 'ပလန', 'ကသန', 'အထန', 'ဌခန', 'ဘမန', 'ကလတ', 'ဝသန', 'ပလဗ', 'မလန', 'ဘပန', 'တမန', 'ကလဝ', 'ကလဌ', 'မကန', 'ခတန', 'ဟမလ', 'လယန', 'လဟန', 'နယန'],
    '6': ['ဌဝန', 'လလန', 'သယခ', 'ယဖန', 'မအယ', 'မအန', 'ဗပန', 'ပလန', 'တဌယ', 'ကသန'],
    '7': ['ပခန', 'သနပ', 'ကဝန', 'ဝမန', 'ညလပ', 'ကတခ', 'ဓအန', 'ယကန', 'ပမန', 'ပခတ', 'ပတန', 'ပတတ', 'သကန', 'ယတန', 'သဝတ', 'လပတ', 'မလန', 'အဖန', 'ဇကန', 'နတလ', 'မညန', 'ကပက', 'တငန', 'ယတယ', 'ကတန', 'ဖပန', 'အထန', 'ဌတပ'],
    '8': ['မကန', 'ယနခ', 'ခမန', 'တတက', 'မသန', 'နမန', 'မဘန', 'ပဖန', 'ငဖန', 'ဆလန', 'ဆတယ', 'သယန', 'မလန', 'မတန', 'ကမန', 'အလန', 'ဆပဝ', 'ပခက', 'ယသက', 'မမန', 'ပမန', 'ဆဖန', 'ဆမန', 'ဂဂန', 'ဌလန'],
    '9': ['မယတ', 'မယမ', 'မနတ', 'မနမ', 'အပယ', 'ပသက', 'ပတယ', 'ဆကန', 'မသန', 'တတဦ', 'မခန', 'တဌန', 'နဌက', 'ကပတ', 'ညအန', 'ယမသ', 'ပဗန', 'တကန', 'ပမန', 'လဝန', 'မဌလ', 'မလန', 'သဆန', 'ဝတန'],
    '10': ['မလမ', 'ကမယ', 'ခစန', 'သဖယ', 'မဓန', 'ယမန', 'သဌန', 'ပမန', 'ကဌန', 'ဗလန'],
    '11': ['ဆတန', 'ပနတ', 'ယသတ', 'မအန', 'ကတန', 'မပန', 'ပတန', 'မတန', 'ဗသတ', 'ကဖန', 'မအန', 'ယပန', 'မပတ', 'အမန', 'သတန', 'တကန', 'ဂမန'],
    '12': ['မဂဓ', 'အစန', 'အကမ', 'မယက', 'ကမယ', 'လမန', 'အကတ', 'သဂက', 'ယကန', 'ကမတ', 'ဆခန', 'အလန', 'လမတ', 'လသန', 'ပဗတ', 'ကတတ', 'ဘထဌ', 'ပဇတ', 'ဘဟန', 'ဓဂန', 'မဂတ', 'တမန', 'သကတ', 'ဓပန', 'ဆကန', 'ဓလန', 'ဆကမ', 'ကကက', 'သလန', 'ကတန', 'သခန', 'ခယန', 'တတန', 'ကခက', 'ကမန', 'မဘန', 'လကန', 'တကန', 'ဌတပ'],
    '13': ['တကန', 'ဟပန', 'ညယန', 'ဆဆန', 'ကလန', 'ပတယ', 'ယငန', 'ယစန', 'ပလန', 'ဖခန', 'လလန', 'လခန', 'နစန', 'ကဟန', 'မနန', 'လခတ', 'မမန', 'မပန', 'ကသန', 'မကန', 'မယန', 'လယန', 'သနန', 'တယန', 'မယတ', 'ကခန', 'မစတ', 'နခန', 'ကမန', 'နခတ', 'နစန', 'မမတ', 'မဘန', 'သပန', 'နမတ', 'ကလတ', 'ဟပတ', 'ကကန', 'မမဌ', 'ပဝန', 'နစန', 'ဝဇတ', 'ပယန', 'ကတန', 'ပပတ', 'မယန', 'မခန', 'မတန', 'မစန', 'တခလ', 'မယတ', 'မဖန'],
    '14': ['ပသန', 'ပသယ', 'သပန', 'ငပတ', 'ကပန', 'ယကန', 'ကတန', 'ဟသတ', 'ဇလန', 'လမန', 'မအန', 'ကခန', 'အဂပ', 'မမန', 'အမန', 'လပတ', 'ဝခမ', 'မမက', 'မအပ', 'ပတန', 'ညတန', 'ဒနဖ']
};

export default nrcData;
