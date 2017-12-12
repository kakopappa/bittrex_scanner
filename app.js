const bx = require('./bittrex.js');
const tech = require('technicalindicators')

function getPairs() {
	bx.getPairs(100).then(pairs => { 

        // console.log(pairs);
        //pairs = pairs.slice(-1);

        pairs.map(function(val, index, arr) {
            bx.getCandles(val, 'day').then(res => { 
                tradePair(res)
            }).catch(res => console.log('Error', res.message))
        });         


    }).catch(function (reason) {

    });
}

getPairs()

const tradePair = (arr) => {
  return new Promise((resolve, reject) => {
	   
       let input = arr.data.map(x => x.C)
       let v = arr.data.map(x => x.V)

       let ema10Arr = tech.EMA.calculate({period: 10, values: input}).reverse();
       let ema50Arr = tech.EMA.calculate({period: 50, values: input}).reverse();
       let ema200Arr = tech.EMA.calculate({period: 200, values: input}).reverse();

       let rsi = tech.RSI.calculate({values: input, period: 14}).reverse()

       //ema10[0] > ema30[0] > ema200[0];
             
       if(!empty(ema10Arr[0]) && !empty(ema50Arr[0]) && !empty(ema200Arr[0])) {
           let ema10 = ema10Arr[0].toFixed(10);
           let ema50 = ema50Arr[0].toFixed(10);
           let ema200 = ema200Arr[0].toFixed(10);

           // 1. all EMAs should be below 200
           var buySignal = false;

           if(ema200 > ema50 && ema200 > ema10) {
               //2. EMA10 CRoSSING EMA50
               if(ema10 > ema50) {
                   console.log("BUY Pair:" + arr.pair + ", ema10: " + ema10 + ", ema50: " + ema50 + ", ema200:  " + ema200 + ", rsi: " + rsi[0] );
               }                
           }

        //    if (ema10 < ema50 && ema50 < ema200) {
        //         console.log("pair:" + arr.pair + ", ema10: " + ema10 + ", ema50: " + ema50 + ", ema200:  " + ema200 + ", rsi: " + rsi[0] );
        //         console.log("buySignal ? " + buySignal);
        //         console.log("");
        //     }
           
           
           
       }
       

  }) 
};

function empty(v) {
        let type = typeof v;
        if(type === 'undefined') {
            return true;
        }
        if(type=== 'boolean') {
            return !v;
        }
        if(v === null) {
            return true;
        }
        if(v === undefined) {
            return true;
        }
        if(v instanceof Array) {
            if(v.length < 1) {
                return true;
            }
        }
        else if(type === 'string') {
            if(v.length < 1) {
                return true;
            }
            if(v==='0') {
                return true;
            }
        }
        else if(type === 'object') {
            if(Object.keys(v).length < 1) {
                return true;
            }
        }
        else if(type === 'number') {
            if(v===0) {
                return true;
            }
        }
        return false;
}