
var exports=module.exports={

diffMin:function (dt1, dt2) 
{    
 var diff =(dt2.getTime()-dt1.getTime()) / 1000;
 diff /= 60;
 return Math.abs(Math.round(diff));
 //getttime(zaman) 1970den zaman'a kadar olan süreyi milisaniye olarak verir
},


//üretim fonkları
//time dk cinsinden,, oran bonus
cowMilk:function (time,oran){//inek dakikada 1lt süt üretsin
    return oran*(time/1);
},
chickenEgg:function (time,oran){//tavuk dakikada 1 yumurta üretsin
return oran*(time/1);
},
beeHoney:function (time,oran){//arı dakikada 1br bal üretsin
return oran*(time/1);
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

//hayvanların yaşam süresini beslenmediği zamana göre güncelleme
//aç kaldığı her 10 dk için 1dk ömür kısalcak(death+=1dk)
upTime:function(time,x){
    //time güncellencek zaman,, x kaç dakika güncellenecek
    var  zaman=time.getTime();
    zaman+=(60*1000)*x;
    var tamp=new Date(zaman);
    return tamp    
}
};
