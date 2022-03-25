const WebSocket = new require("ws");
let ws = new WebSocket("wss://ftx.com/ws/");

/*
var coins = [
    'ADA-PERP','1INCH-PERP','AAVE-PERP','ALGO-PERP','ALPHA-PERP','ALT-PERP','AMPL-PERP','AR-PERP','ATOM-PERP','AVAX-PERP','BADGER-PERP','BAND-PERP','BAO-PERP','BAT-PERP','BCH-PERP','BNB-PERP',
    'BNT-PERP','BRZ-PERP','BSV-PERP','BTC-PERP','BTMX-PERP','BTT-PERP','CAKE-PERP','CHZ-PERP','COMP-PERP','CREAM-PERP','CRO-PERP','CRV-PERP','DASH-PERP','DEFI-PERP','DMG-PERP','DOT-PERP','DRGN-PERP',
    'EGLD-PERP','ENJ-PERP','EOS-PERP','ETH-PERP','EXCH-PERP','FIDA-PERP','FIL-PERP','FLM-PERP','FLOW-PERP','FTM-PERP','FTT-PERP','GRT-PERP','HOLY-PERP','HOT-PERP','HT-PERP','KAVA-PERP',
    'KIN-PERP','KNC-PERP','KSM-PERP','LEO-PERP','LINA-PERP','LINK-PERP','LRC-PERP','LTC-PERP','LUNA-PERP','MAPS-PERP','MATIC-PERP','MID-PERP','MKR-PERP','MTA-PERP','NEAR-PERP','NEO-PERP','NPXS-PERP',
    'OKB-PERP','OMG-PERP','ONT-PERP','OXY-PERP','PAXG-PERP','PERP-PERP','PRIV-PERP','QTUM-PERP','RAY-PERP','REEF-PERP','REN-PERP','ROOK-PERP','RSR-PERP','RUNE-PERP','SAND-PERP','SC-PERP','SHIT-PERP',
    'SNX-PERP','SOL-PERP','SRM-PERP','SUSHI-PERP','SXP-PERP','THETA-PERP','TOMO-PERP','TRU-PERP','TRX-PERP','UNI-PERP','UNISWAP-PERP','VET-PERP','WAVES-PERP','XAUT-PERP','XLM-PERP',
    'XMR-PERP','XRP-PERP','XTZ-PERP','ZEC-PERP','ZIL-PERP','ZRX-PERP'
];
*/

var coins = [
    'BTC-PERP'
];


takibe_al = (ws, dizi) => {
    if ( dizi && dizi.length > 0 ) {
        dizi.forEach((market, k) => {
            ws.send( JSON.stringify( {'op': 'subscribe', 'channel': 'trades', 'market': market} ) );
        });
    }
}


ws.on("open", data => {
    console.log("WebSocket Bağlantısı Başarılı");
    takibe_al(ws, coins);
});

let balancing = {buy:0, sell:0, difference:0, notification_limit:1000};

ws.on("message", data => {
    data = JSON.parse(data.toString());
    if ( data.data && data.data[0] ) {

        let info = {
            market: data.market,
            price:data.data[0].price,
            size: data.data[0].size,
            dolar: parseInt(data.data[0].price * data.data[0].size),
            side: data.data[0].side
        }

        if ( info.side === "sell" ){
            balancing.sell += info.dolar
        }
        if ( info.side === "buy" ) {
            balancing.buy += info.dolar;
        }
        if ( info.dolar >= balancing.notification_limit ){
            if ( info.side == "sell" ){
                console.log("\x1b[31m","## ["+info.market+"] # HIGH "+info.side+"["+parseInt(info.dolar/1000)+" x] ### "+ info.dolar + "$ " + "|"+info.price+"|");
            }
            if ( info.side == "buy" ){
                console.log("\x1b[32m","## ["+info.market+"] # HIGH "+info.side+"["+parseInt(info.dolar/1000)+" x] ### "+ info.dolar + "$ " + "|"+info.price+"|");
            }
        }
        //console.log( {info, balancing} );
    }
});
