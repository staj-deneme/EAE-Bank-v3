
var exports=module.exports={

diffMin:function (dt1, dt2) 
{    
 var diff =(dt2.getTime()-dt1.getTime()) / 1000;
 diff /= 60;
 return Math.abs(Math.round(diff));
 //getttime(zaman) 1970den zaman'a kadar olan süreyi milisaniye olarak verir
},


//üretim fonkları
//time dk cinsinden
cowMilk:function (time){//inek dakikada 1lt süt üretsin
    return time/1;
},
chickenEgg:function (time){//tavuk dakikada 1 yumurta üretsin
return time/1;
},
beeHoney:function (time){//arı dakikada 1br bal üretsin
return time/1;
},

//satış fonkları
sellMilk:function(quantity){//1lt süt 5coin
    return quantity*5;
},
sellEgg:function(quantity){//1 yumurta 2 coin
    return quantity*2;
},
sellHoney:function(quantity){//1br bal 1coin
    return quantity*1;
},

//hayvanların yem tüketimi

eatSeedCow:function(time){//inek dkda 5 yem
    return time*5;
},
eatSeedChicken:function(time){//tavuk dkda 2 yem
    return time*2;
},
eatSeedBee:function(time){//arı dkda 1 yem
    return time*1;
},

// Hayvanların Ölüm Süreleri
deathCow:function(){//inek 20 dk yaşasın
    return 5;
},
deathChicken:function(){//tavuk 15 dk yaşasın
    return 5;
},
deathBee:function(){//arı 10 dk yaşasın
    return 5;
},
};
