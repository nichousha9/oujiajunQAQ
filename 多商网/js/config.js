require.config({
    'paths': {
        'jq': '../lib/jquery-1.10.1.min',
        'lun': '../lib/lunbo/js/carousel',
        'fen': '../lib/jqueryxlpaging/xlPaging',
        'fang': '../lib/fangdajing/js/fangdajing',
        'xxk':'../lib/xxk/option'
    },
    'shim': {
        'ku': ['jq'],
        'lun': ['ku'],
        'fen': ['jq'],
        'fang':['ku']
    }
});