(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{42:function(e,t,a){e.exports=a(85)},47:function(e,t,a){},48:function(e,t,a){},81:function(e,t){},85:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a.n(n),r=a(38),s=a.n(r),o=(a(47),a(48),a(1)),c=a(2),l=a.n(c),m=function(){var e=Object(n.useState)(""),t=Object(o.a)(e,2),a=t[0],r=t[1],s=Object(n.useState)(""),c=Object(o.a)(s,2),m=c[0],u=c[1],w=Object(n.useState)(""),h=Object(o.a)(w,2),d=h[0],g=h[1],y=Object(n.useState)(""),f=Object(o.a)(y,2),p=f[0],E=f[1];return Object(n.useEffect)((function(){!function e(){g(l()().format("hh")),r(l()().format("mm")),u(l()().format("ss")),E(l()().format("A")),setTimeout(e,1e3)}()}),[]),i.a.createElement("div",{className:"display-4 clock-size"},i.a.createElement("span",{className:""},d),":",i.a.createElement("span",{className:""},a),i.a.createElement("span",{className:"seconds "},m),i.a.createElement("span",{className:"periods "},p))},u=a(40),w=function(e){var t=new Date,a=new Date(t.getFullYear(),t.getMonth(),t.getDate(),e,0,0,0)-t;return a<0&&(a+=864e5),a},h=w,d=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var n=t.map((function(e){return w(e)}));return Math.min.apply(Math,Object(u.a)(n))},g=function(){var e=Object(n.useState)(l()().format("LL")),t=Object(o.a)(e,2),a=t[0],r=t[1];return Object(n.useEffect)((function(){!function e(){r(l()().format("dddd, MMMM Do"));var t=h(0);setTimeout(e,t)}()})),i.a.createElement("div",{className:""},a)},y=a(9),f=a.n(y),p=a(14),E="https://dog.ceo/api/breeds/image/random",b=function(){var e=Object(n.useState)(""),t=Object(o.a)(e,2),a=t[0],r=t[1];return Object(n.useEffect)((function(){function e(){return t.apply(this,arguments)}function t(){return(t=Object(p.a)(f.a.mark((function t(){var a,n,i,s;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(E);case 2:return a=t.sent,t.next=5,a.json();case 5:n=t.sent,i=n.message,r(i),s=d(10,22),setTimeout(e,s);case 10:case"end":return t.stop()}}),t)})))).apply(this,arguments)}e()}),[]),a?i.a.createElement("div",{className:"float-right"},i.a.createElement("img",{src:a,alt:"dog",width:"300",height:"300"})):i.a.createElement("div",null,"no image")},v=a(86),j=a(87),O=a(88),N=(a(15),{updateTime:9e5,ZIP:"44240",api_key:"b8d8163c79b9574cc193215f73d445c9",day:{200:"wi-day-storm-showers",201:"wi-day-storm-showers",202:"wi-day-thunderstorm",210:"wi-day-thunderstorm",211:"wi-day-thunderstorm",212:"wi-day-thunderstorm",221:"wi-day-thunderstorm",230:"wi-day-thunderstorm",231:"wi-day-thunderstorm",232:"wi-day-thunderstorm",300:"wi-day-sprinkle",301:"wi-day-sprinkle",302:"wi-day-showers",310:"wi-day-showers",311:"wi-day-showers",312:"wi-day-showers",313:"wi-day-showers",314:"wi-day-showers",321:"wi-day-showers",500:"wi-day-showers",501:"wi-day-showers",502:"wi-day-rain",503:"wi-day-rain",504:"wi-day-rain",511:"wi-day-hail",520:"wi-day-rain",521:"wi-day-rain",522:"wi-day-rain",531:"wi-day-rain",600:"wi-day-snow",601:"wi-day-snow",602:"wi-day-snow",611:"wi-day-sleet",612:"wi-day-sleet",613:"wi-day-sleet",615:"wi-day-rain-mix",616:"wi-day-rain-mix",620:"wi-day-rain-mix",621:"wi-day-rain-mix",622:"wi-day-rain-mix",701:"wi-day-fog",711:"wi-day-fog",721:"wi-day-haze",731:"wi-sandstorm",741:"wi-day-fog",751:"wi-sandstorm",761:"wi-sandstorm",762:"wi-sandstorm",771:"wi-sandstorm",781:"wi-tornado",800:"wi-day-sunny",801:"wi-day-cloudy",802:"wi-cloud",803:"wi-cloudy",804:"wi-cloudy"},night:{200:"wi-night-thunderstorm",201:"wi-night-storm-showers",202:"wi-night-thunderstorm",210:"wi-night-thunderstorm",211:"wi-night-thunderstorm",212:"wi-night-thunderstorm",221:"wi-night-thunderstorm",230:"wi-night-thunderstorm",231:"wi-night-thunderstorm",232:"wi-night-thunderstorm",300:"wi-night-alt-sprinkle",301:"wi-night-alt-sprinkle",302:"wi-night-showers",310:"wi-night-showers",311:"wi-night-showers",312:"wi-night-showers",313:"wi-night-showers",314:"wi-night-showers",321:"wi-night-showers",500:"wi-night-showers",501:"wi-night-showers",502:"wi-night-alt-rain",503:"wi-night-alt-rain",504:"wi-night-alt-rain",511:"wi-night-hail",520:"wi-night-alt-rain",521:"wi-night-alt-rain",522:"wi-night-alt-rain",531:"wi-night-alt-rain",600:"wi-night-snow",601:"wi-night-snow",602:"wi-night-snow",611:"wi-night-alt-sleet",612:"wi-night-alt-sleet",613:"wi-night-alt-sleet",615:"wi-night-rain-mix",616:"wi-night-rain-mix",620:"wi-night-alt-rain-mix",621:"wi-night-alt-rain-mix",622:"wi-night-alt-rain-mix",701:"wi-night-fog",711:"wi-night-fog",721:"wi-fog",731:"wi-sandstorm",741:"wi-night-fog",751:"wi-sandstorm",761:"wi-sandstorm",762:"wi-sandstorm",771:"wi-sandstorm",781:"wi-tornado",800:"wi-night-clear",801:"wi-night-alt-cloudy",802:"wi-cloud",803:"wi-cloudy",804:"wi-cloudy"}}),x="https://api.openweathermap.org/data/2.5/weather?zip=".concat(N.ZIP,",us&units=imperial&appid=").concat(N.api_key),S=N.updateTime,k=function(){var e=Object(n.useState)("condition"),t=Object(o.a)(e,2),a=t[0],r=t[1],s=Object(n.useState)("69"),c=Object(o.a)(s,2),m=c[0],u=c[1],w=Object(n.useState)("200"),h=Object(o.a)(w,2),d=h[0],g=h[1],y=Object(n.useState)(N.day),E=Object(o.a)(y,2),b=E[0],k=E[1],M=Object(n.useState)({high:0,low:0}),I=Object(o.a)(M,2),H=I[0],T=I[1],D=Object(n.useState)(0),B=Object(o.a)(D,2),Y=B[0],P=B[1],z=function(){var e=l()().hour();k(e>=22||e>=0&&e<7?N.night:N.day)};return Object(n.useEffect)((function(){var e=function(){var t=Object(p.a)(f.a.mark((function t(){var a,n;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(x);case 2:return a=t.sent,t.next=5,a.json();case 5:n=t.sent,u(n.main.temp),r(n.weather[0].description),g(n.weather[0].id.toString()),T({high:n.main.temp_max,low:n.main.temp_min}),P(n.sys.sunset),z(),setTimeout(e,S);case 13:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();e()}),[]),i.a.createElement("div",{className:""},i.a.createElement(v.a,{fluid:!0},i.a.createElement(j.a,{className:"weather-text"},i.a.createElement(O.a,{className:"text-right weather-col"},i.a.createElement("div",{className:"high-low"},"high ",Math.round(H.high),"\xb0 / low ",Math.round(H.low),"\xb0",i.a.createElement("i",{className:"wi wi-sunset"}),l.a.unix(Y).format("hh:mm")),i.a.createElement("div",{className:""},i.a.createElement("i",{className:"wi ".concat(b[d]," tempDegree")}),i.a.createElement("span",{className:"temp tempDegree"},Math.round(Number(m)),"\xb0"),i.a.createElement("div",{className:"condition"},a))))))},M=a(39),I=function(e){var t=e.songInfo;return i.a.createElement("div",null,i.a.createElement("div",{className:"songInfo"},i.a.createElement("img",{src:t.imgURL,alt:"album",width:"200",height:"200"})),i.a.createElement("div",{className:"songInfo below-album-img"},i.a.createElement("i",{className:"fa fa-music"}),t.songTitle),i.a.createElement("div",{className:"songInfo"},i.a.createElement("i",{className:"fa fa-user"}),t.artist),i.a.createElement("div",{className:"songInfo"},i.a.createElement("i",{className:"fa fa-folder"}),t.album))},H=a.n(M)()("http://localhost:5000/"),T=function(){var e=Object(n.useState)({noSong:!0}),t=Object(o.a)(e,2),a=t[0],r=t[1];return Object(n.useEffect)((function(){H.on("getPlayBackState",(function(e){r(e)}))}),[]),a.noSong?i.a.createElement("div",null,i.a.createElement("img",{src:"./png/spotify.png",alt:"spotify",width:"150",height:"150",className:"top-buffer"})):i.a.createElement(I,{songInfo:a})},D={anyTime:["I love you","Hey there sexy","Hello Paige","You look beautiful","You're a boob","What a sweetheart","Sweetheart","You're a cutie","Are you from Tennessee? Because you're the only 10 I see","My princess","I hope you're having a good day","Hello","Hey there","If you were a chicken you'd be impeccable","Did you just come out of the oven? Because you're hot","You're so sweet, you're giving me a toothache","Is it hot in here? Or is it just you","Did you have lucky charms for breakfast? Because you look magically delicious","Nice legs","Hey there beautiful"],morning:["Good morning","I hope you slept well","How was your sleep?","Enjoy your day","Good morning sunshine"],evening:["Goodnight","Sleep well","Sweet dreams"],holidays:{"01-01":"Happy New Years!","02-14":"Happy Valentines day!","07-24":"Happy Aniversary!","07-29":"Happy Birthday!","10-31":"Happy Halloween!","11-24":"Merry Christmas Eve","11-25":"Merry Christmas!","11-31":"Happy New Years Eve!"}},B=5,Y=12,P=22,z=5,A=function(){var e=l()().format("MM-DD").toString();return D.holidays.hasOwnProperty(e)?D.holidays[e]:null},_=function(){var e=Object(n.useState)("Hello Paige"),t=Object(o.a)(e,2),a=t[0],r=t[1],s=Object(n.useState)(""),c=Object(o.a)(s,2);c[0],c[1];return Object(n.useEffect)((function(){var e=function e(){if(null!==A()){var t=A();r(t)}else{var a=function(){var e=l()().hour();return e>=B&&e<Y?D.morning:e>=P||e>=0&&e<z?D.evening:D.anyTime}();r(function(e){var t=e.length-1;return e[Math.floor(Math.random()*t)]}(a))}var n=d(B,Y,P);setTimeout(e,n)};setTimeout((function(){e()}),5e3)}),[]),i.a.createElement("div",{className:""},i.a.createElement("span",{className:""},a))};var C=function(){return i.a.createElement("div",null,i.a.createElement(v.a,{fluid:!0},i.a.createElement(j.a,{className:""},i.a.createElement(O.a,{md:6,className:""},i.a.createElement(g,{className:"Date"}),i.a.createElement(m,{className:"Clock"})),i.a.createElement(O.a,{md:{span:4,offset:2},className:"text-right"},i.a.createElement(k,null))),i.a.createElement(j.a,{className:"second-bottom message-size"},i.a.createElement(O.a,{md:{span:11,offset:0},className:"text-center"},i.a.createElement(_,null))),i.a.createElement(j.a,{className:"bottom "},i.a.createElement(O.a,{md:6,className:"spotify mt-auto"},i.a.createElement(T,null)),i.a.createElement(O.a,{md:{span:3,offset:3},className:""},i.a.createElement(b,null)))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(84);s.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(C,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[42,1,2]]]);
//# sourceMappingURL=main.5ab74ccd.chunk.js.map