var layer = L.tileLayer('https://api.mapbox.com/styles/v1/livenlulu/citnptqn5005x2itj0fnx1u0v/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl2ZW5sdWx1IiwiYSI6ImNpZ3h0ZzltbzB1cTQ0cG0zamthcno1dmwifQ.vZrmbXCCq15ZVuF6g6vhkA', {
  attribution: ''
});

var map = L.map('myMap',{tap:false, attributionControl: false}).setView( [40.738153,-73.913612], 11);
map.addLayer(layer);


var price_from, price_to;
var safety, safetyweight;
var felonyrecord = 0;
var felonysum = 0;
var felonyavg = 0;
$.getJSON('data/comm.geojson', function(data) {
    var f = data.features.map(function (item) {
    // sum all the felony numbers
    if (item.properties.felony) {
      this.felonyrecord = this.felonyrecord + 1;
      this.felonysum = parseInt(item.properties.felony)+ this.felonysum;
    }
  });
  felonyavg = felonysum / felonyrecord;
  //alert("first read: " + felonyrecord + "," + felonysum + "," + felonyavg.toFixed(3));
});

$(document).ready(function() {
  
  // get parameters from form
  var strUrl = location.search;
  var getPara, ParaVal;
  var aryPara = [];
  var rent;
  var rentopt, safeopt;
 
  if (strUrl.indexOf("?") != -1) {
      var getSearch = strUrl.split("?");
      getPara = getSearch[1].split("&");
      for (i = 0; i < getPara.length; i++) {
        ParaVal = getPara[i].split("=");
        aryPara.push(ParaVal[0]);
        aryPara[ParaVal[0]] = ParaVal[1];
      }
  }
  rent = aryPara["rentslider"];
  safety = aryPara["safeslider"];
  price_from = 0;
  
  if (rent == 6){
    rentopt = 6;
    price_to = 10000;
  } else if (rent == 5){
    rentopt = 5;
    price_to = 2400;
  } else if (rent == 4){
    rentopt = 4;
    price_to = 2000;  
  } else if (rent == 3){
    rentopt = 3;
    price_to = 1600;  
  } else if (rent == 2){
    rentopt = 2;
    price_to = 1200;
  } else if (rent == 1){
    rentopt = 1;
    price_to = 800;
  } else {
    rentopt = 6;
    price_to = 10000;
  }
  
  // get safety value 
  if (safety == 5){
    safeopt = 5;
    safetyweight = 0.6;
  } else if (safety == 4){
    safeopt = 4;
    safetyweight = 0.8;
  } else if (safety == 3){
    safeopt = 3;
    safetyweight = 1;
  } else if (safety == 2){
    safeopt = 2;
    safetyweight = 1.2;
  } else if (safety == 1){
    safeopt = 1;
    safetyweight = 2.5;
  } else {
    safety = 1;
    safeopt = 1;
    safetyweight = 2.5;
  }
  
  $("#r").text(rent);
  $("#s").text(safety);
  $("#r").hide();
  $("#s").hide();
  
  //alert(rentopt);
    var rslider = new Slider("#rentslider", {
    ticks: [1, 2, 3, 4, 5, 6],
    value: rentopt,
    tooltip: 'hide',
    step: 1,
    //ticks_labels: ['<$800', '$1200', '$1600', '$2000', '$2400', '>$2400'],
  });
  
  var sslider = new Slider("#safeslider", {
    ticks: [1, 2, 3, 4, 5],
    value: safeopt,
    tooltip: 'hide',
    step: 1,
    //ticks_labels: ['Low Risk', '', 'Medium Risk', '', 'High Risk'],
  });
  
  //$("#aboutModal").modal("show");
    //$(".navbar-collapse.in").collapse("hide");
    //return false;
  
});



var rentData = [];
rentData[0]={};
var currid=0;
var med=0;
    

var chart;

var manhattan = [40.763121,-73.948288];
var brooklyn = [40.637925,-73.948288];
var bronx = [40.841606, -73.874817];
var queens = [40.716298,-73.853874];
var statenisland = [40.571719,-74.148788];

var panOptions = {
    animate: true,
    duration: 2
 	}

      $(".myButton").click(function() {
      if($(this).attr('id') == 'one' ) {
        map.panTo(manhattan, panOptions);
      } 
      
      else if 
      ($(this).attr('id') == 'two' ) {
        $(this).css('background-color','#000');
        map.panTo(brooklyn, panOptions);
      } 

      else if 
      ($(this).attr('id') == 'three' ) {
        $(this).css('background-color','#000');
        map.panTo(bronx, panOptions);
      } 

      else if 
      ($(this).attr('id') == 'four' ) {
        $(this).css('background-color','#000');
        map.panTo(queens, panOptions);
      } 

      else {
        $(this).css('background-color','#000');
        map.panTo(statenisland, panOptions);
      }
    });
      
// function onEachFeature(feature, layer) {
//     // does this feature have a property named popupContent?
//     if (feature.properties && feature.properties.popupContent) {
//         layer.bindPopup(feature.properties.popupContent);
//     }
// }

  $("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
    });

  var geojson;
  var matchr=0;


  $.getJSON('data/comm.geojson', function(data) {
    
      var f = data.features.map(function(item) {
    
    if (parseInt(item.properties.felony) < safetyweight*felonyavg && parseInt(item.properties.medianrent) < price_to){
      setTimeout(function(){
            matchr = matchr + 1;
            


    geojson = L.geoJson(item, {style: style, onEachFeature: onEachFeature}).addTo(map);
updateChart(data.features[currid].properties)
            
          });
    }
    
    });


  $("#about-btn").click(function() {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
  });


 });

  function getColor(d) {
    return d > .06 ? '#900000' :
           d > .045  ? '#BD0026' :
           d > .035  ? '#E31A1C' :
           d > .025  ? '#FC4E2A' :
           d > .02  ? '#FD8D3C' :
           d > .01  ? '#FEB24C' :
           d > .005  ? '#FED976' :
                     '#FFEDA0' ;
  }


  function style(feature) {
    return {
        fillColor: getColor(feature.properties.vacancy),
        weight: .7,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.7
    };
  }

  function mouseoverFunction(e) {
    var layer = e.target;
    // med value
    //med = e.target.feature.properties.median_income;
    //console.log(med);

    layer.setStyle({
        weight: 5,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    function onClick(e) {
      var layer = e.target;
    // med value
    //med = e.target.feature.properties.median_income;
    //console.log(med);

    layer.setStyle({
        weight: 5,
        opacity: 1,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    }

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    // try updatechart
    updateChart(e.target.feature.properties);

    // console.log(layer.feature.properties.income);
    $('#side').html('<h3>' + layer.feature.properties.Location + ' ' + '</h3>' + '<h4>' + '<b>' + (layer.feature.properties.vacancy*100).toFixed(1) + '%</b>' + ' of units available for rent (monthly)' + '</h4>');
  	}

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: mouseoverFunction,
        
        mouseout: resetHighlight
        //click: zoomToFeature
    });
   
  }

// subway stations
// $.getJSON('data/subwaystop.geojson', function(data2) {
//   // console.log(data);

// var subwaystations = {
//     radius: 2,
//     fillColor: "green",
//     color: "#fff",
//     weight: .5,
//     opacity: 1,
//     fillOpacity: 01,
    
// };

// L.geoJson(data2, {
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, subwaystations);
//     }
// }).addTo(map);
// });

//dropdown scroll
  $(".dropdown-menu li a").click(function(){
  var selText = $(this).text();
  $(this).parents('.dropdown').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
  });


//bar chart
nv.addGraph(function() {
  chart = nv.models.discreteBarChart()
    .x(function(d) { return d.label })
    .y(function(d) { return d.value })
    .staggerLabels(true)
    .showValues(true)
    .margin({left:0,right:0})
    .color(['rgb(77,175,74)','rgb(55,126,184)','rgb(228,26,28)'])
    .valueFormat(function(d){
        return Math.round(d * 10)/10;
      });
    ;

  nv.utils.windowResize(chart.update);

  return chart;
});


//Each bar represents a single discrete quantity.
function updateChart(f){

  rentData[0].key = "vacancyrent";
  rentData[0].values =
    [
        { 
          "label" : "Rent" , 
          "value" : f.medianrent
        } , 
        { 
          "label" : "30% Income" , 
          "value" : f.income * .3
        } , 
        { 
          "label" : "Felonies" , 
          "value" : f.felony
        } 
      ]
    d3.select('#chart svg')
    .datum(rentData)
    .transition().duration(500)
    .call(chart);
  
}

$('#ex1').slider({
  formatter: function(value) {
    return 'Current value: ' + value;
  }
});


//bulletchart
// nv.addGraph(function() {  
//   var chart2 = nv.models.bulletChart();

//   d3.select('#chart2 svg')
//       .datum(exampleData())
//       .transition().duration(1000)
//       .call(chart2);

//   return chart2;
// });


// function exampleData() {
//   return {
//     "title":"Revenue",    //Label the bullet chart
//     "subtitle":"US$",   //sub-label for bullet chart
//     "ranges":[150,225,300],  //Minimum, mean and maximum values.
//     "measures":[220],    //Value representing current measurement (the thick blue line in the example)
//     "markers":[250]      //Place a marker on the chart (the white triangle marker)
//   };
// }


