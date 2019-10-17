require.config({
  paths: {
    jq: "../lib/jquery-1.10.1.min",
    lun: "../lib/lunbo/js/carousel2",
    fen: "../lib/jqueryxlpaging/xlPaging",
    fang: "../lib/fangdajing/js/fangdajing",
    xxk: "../lib/xxk/option",
    nav: "../js/nav",
  },
  shim: {
    ku: ["jq"],
    lun: ["ku"],
    fen: ["jq"],
    fang: ["ku"],
    nav: ["jq"],
  }
});
