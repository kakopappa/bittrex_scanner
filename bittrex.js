var request = require('request');

exports.getCandles = function(pair, tickInterval) {
    return new Promise ((resolve, reject) => {
        let url = 'https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName='+pair+'&tickInterval=' + tickInterval;

        request(url, function (err, response, body) {
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            
            if(err) {
                reject(err);
            }
            else {
                let data = JSON.parse(body);
                let output = {pair: pair, data: data.result}
                resolve(output);
            }
        });
    });
};

exports.getPairs  = function(minVol) {
     return new Promise ((resolve, reject) => {
        let url = 'https://bittrex.com/api/v1.1/public/getmarketsummaries';

        request(url, function (err, response, body) {
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

            if(err) {
                reject(err);
            }
            else {
                let data = JSON.parse(body);
                let result = data.result.filter(cur => {
                    return cur.BaseVolume > minVol && cur.MarketName.match(/^(BTC)/g)
                })
                .map(cur => {
                    return cur.MarketName
                })

                resolve(result);
            }
        });
     });
}