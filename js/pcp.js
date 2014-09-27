/*


JAYANT PARCHURE
Graduate Programming Assignment 3

*/



var dragging = {};
var chart;
var tooltip;
var colorBar="";
var colorPoint="";
var bargraphdrawn=false;


//Gets called when the page is loaded.
function init(){

	colorBar=0;
  d3.csv('data/movies.csv',update);

}

//Called when data is loaded
function update(rawdata){
  rawdata.forEach(function(d,i) {

   
    d.Asia = parseFloat(d.Asia);
    d.Africa = parseFloat(d.Africa);
    d.Europe= parseFloat(d.Europe);
    d["South America"]=parseFloat(d["South America"]);
    d["North America"]=parseFloat(d["North America"]);
    d.Australia=parseFloat(d.Australia);
  })
  plotGraph(rawdata); 
}


function plotGraph(dataset)
{ 


var m = [20, 10, 10, 10],
    w = 860 - m[1] - m[3],
    h = 440 - m[0] - m[2],
    w1=520,
 	  h1=400 + m[0] + m[2];   

var x = d3.scale.ordinal().rangePoints([0, w], 1),
    y = {},
    x2 =d3.scale.ordinal().rangePoints([0, w1], 1),
    y2= d3.scale.linear(),

    dragging = {},
    maxVar=0,
    temp2="";

//Drawing the parallel coordinates plot




var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("#pc").style({"float":"left"}).append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
    
//Defining x and y domains for PCP
   x.domain(dimensions = d3.keys(dataset[1]).filter(function(d) {
    return d != "Genre" && (y[d] = d3.scale.linear()
        .domain(d3.extent(dataset, function(p) {return +p[d]; }))
        .range([h, 0]).nice());
  }));

//The variable "dimensions" is nothing but a list of all continent


background = svg.append("svg:g")
      .attr("class", "background")
      .selectAll("path")
      .data(dataset)
      .enter().append("svg:path")
      .attr("d", path);

val=totalvalue();
xValues=val.keys();
drawGraph(xValues, val);
var selectflag= true;
maxVargenre = maxVariance();
selectflag= false;
maxVarcon= maxVariance();
var group;
var diff1="";


 $(document).ready(function() { //Housekeeping stuff: Actions defined on radio and reset buttons
          maxVar=maxVariance().keys()[0];

          $("#radiodiv input[name='radio']").click(function(){
            reset();
           
            if(jQuery( 'input[name=radio]:checked' ).val() == "genre"){   
              var colval="";
              selectflag=true;
              d3.selectAll('path').data(dataset).transition().style("stroke", function(d){
                colval = setmaxvariancestyle(d["Genre"])
                if(colval=="SlateBlue"){diff1=d["Genre"];}
                return colval;
                //
                 });
              d3.selectAll('.dimension').data(dimensions).transition().style("stroke", "");
              }
            else{
              selectflag=false;

              d3.selectAll('path').data(dataset).transition().style("stroke", "");
              d3.selectAll('.dimension').data(dimensions).transition().style("stroke", function(d){return setmaxvariancestyle(d)});
            }  

          })
          $('#reset').click(function(){reset()});      
                               
      });


var c=false,trackline=[];

//Draw the PCP Lines
drawLines(dataset);


//Select various axes for PCP
var group = selectPCPAxes(dimensions);
//PCP Labels
group.append("svg:g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);


function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
  }
function transition(g) {
  return g.transition().duration(500);
  }
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
  }
function ovalue(e){
  //Returns a map of the form [<name of genre>, <values for all continents>]
	var valuemap=d3.map();
	dataset.map(function(d){return valuemap.set(d["Genre"],d[e])});
	return valuemap;
  }

//Draw PCP Lines
function drawLines(dataset){  

   //Calculate the field with maximum variance
  var linedetails=[],linevalue=[],lined;
  foreground = svg.append("svg:g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(dataset)
      .enter().append("svg:path")
      .attr("d", path)

      foreground  

      .on("click", function(d,i){
         if(selectflag){
          if(d["Genre"]==diff1){d3.selectAll(this).style(show_maxvar(diff1))}//Actions on Click

        linevalue = d3.map(d).values();
        linevalue.shift();
        if(trackline.length==0){  //If clicked for the first time        
              d3.select(this).transition().style({'stroke': 'black', 'stroke-width': 4, 'stroke-opacity': 0.5})
              trackline.push(this);
              linedetails.push([d["Genre"], linevalue]);
            }           
        else{ //If not clicking for first time
          
          if(trackline[0]!==this && trackline[1]!==this){
            if(trackline.length==2){ 
              linedetails.shift();
              d3.select(trackline.shift()).transition().style({'stroke': '', 'stroke-width': '', 'stroke-opacity': ''});
            }
           trackline.push(this);
            linedetails.push([d["Genre"], linevalue]);
            //Make a map of linedetails
            lined=d3.map();
            lined.set(linedetails[0][0], linedetails[0][1]);
            lined.set(linedetails[1][0], linedetails[1][1]);
            drawGraph2(lined, lined.keys(),"Genres");
            d3.select(this).transition().style({'stroke': coeff_color([linedetails[0][1],linedetails[1][1]]), 'stroke-width': '4', 'stroke-opacity': '0.5'});
            d3.select(trackline[0]).transition().style({'stroke': coeff_color([linedetails[0][1],linedetails[1][1]]), 'stroke-width': '4', 'stroke-opacity': '0.5'})
            
            show_coeff([linedetails[0][1],linedetails[1][1]]);
          }
          else{
                d3.selectAll('p').transition().duration(500).text("The genre Drama has the maximum viewers accross all continents");
                d3.select(this).transition().style({'stroke': '', 'stroke-width': '', 'stroke-opacity': ''});  
                if(trackline[0]==this){
                trackline.shift();  
                linedetails.shift();}
                else{
                  trackline.pop();  
                linedetails.pop();}
                drawGraph(xValues, val);
        
            }
          } 
        }
        else{linedetails=[],linevalue=[];}//If flag is false
        
       }
      )
      .style("stroke", function(d){setmaxvariancestyle(d["Genre"]);}, "stroke-opacity", "0.2");
    };
  
//Draw PCP Axes
function selectPCPAxes(dimensions){
var count=0,temp,trackaxis=[],val,xAxis,yAxis,xScale,yScale, selections=[],diff2="";
var group = svg.selectAll(".dimension")
      .data(dimensions)
      .enter().append("svg:g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      
      group  
      .on("click", function(d,i) {    if(!selectflag){
            
        
        if(d==diff2){show_maxvar(diff2);}
        val = ovalue(d);
        var xValues =val.keys();
       //If selecting for the first time
       
        if(trackaxis.length==0){

        d3.select(this).transition().style({"fill":"black", "font-size":"15", "font-weight":"bold"});
        
        trackaxis.push([this,val]);
        selections.push(d);
        
        }
      //If selecting for the second time
        else if(trackaxis.length==1){

            if(trackaxis[0][0]===this){d3.select(trackaxis[0][0]).style({"fill":"","font-size":"", "font-weight":""});
            d3.selectAll('p').transition().duration(500).text("The genre Drama has the maximum viewers accross all continents");
            selections.shift();
            trackaxis.shift();
            chart.remove();
            val=totalvalue();
            xValues=val.keys();
            drawGraph(xValues, val);}
        else{ 
              
              selections.push(d);
              trackaxis.push([this,val]);
        
              drawGraph2(trackaxis,selections);}
              if(trackaxis.length==2){
              var compare_val=[trackaxis[0][1].values(),trackaxis[1][1].values()];
              var nodelist=[trackaxis[0][0],trackaxis[1][0]];

              d3.select(trackaxis[0][0]).transition().style({"fill":coeff_color(compare_val), "font-size":"15", "font-weight":"bold"});
              d3.select(this).transition().style({"fill":coeff_color(compare_val), "font-size":"15", "font-weight":"bold"});
              show_coeff(compare_val);
            }
          }
      //If selecting for the third time
      else{
          //Check if already selected, if so unselect the axis
          if(trackaxis[0][0]===this){d3.select(trackaxis[0][0]).style({"fill":"","font-size":"", "font-weight":""});
            selections.shift();
            trackaxis.shift();
            drawGraph(trackaxis[0][1].keys(),trackaxis[0][1]);
            d3.selectAll('p').transition().duration(500).text("The genre Drama has the maximum viewers accross all continents");
          } 
          else if(trackaxis[1][0]===this){d3.select(trackaxis[1][0]).style({"fill":"","font-size":"", "font-weight":""});
            trackaxis.pop();
            selections.pop();
            drawGraph(trackaxis[0][1].keys(),trackaxis[0][1]);
            d3.selectAll('p').transition().duration(500).text("The genre Drama has the maximum viewers accross all continents");
          }
          else{//If selecting a totally new axis, then unselect the oldest selection and continue
            selections.shift();
            temp=trackaxis.shift();
            
            d3.select(temp[0]).style({"fill":"","font-size":"", "font-weight":""});
             
            trackaxis.push([this,val]);
            selections.push(d);
            drawGraph2(trackaxis,selections);
            var compare_val=[trackaxis[0][1].values(),trackaxis[1][1].values()];
            var nodelist=[trackaxis[0][0],trackaxis[1][0]];
            //coeff_color(compare_val);  
            d3.select(this).transition().style({"fill":coeff_color(compare_val),"font-size":"15", "font-weight":"bold"});        
            show_coeff(compare_val);
          }
      }
      }})
      .style("stroke",function(d){colval = setmaxvariancestyle(d)
                if(colval=="SlateBlue"){diff2=d;}
                return colval;});//Color of axes based on variance

      return group;
  }
//Draw the Bar Graph when one axes is selected
function drawGraph(xValues, val){
		
		//Get maximum value
    
		Array.prototype.max = function() {
		return Math.max.apply(null, this);
		};
		var maximum = Math.max.apply(null, val.values()); 
		//Gives you the largest viewing percentage of all genres (Numeric)
  		if(typeof(chart)!='undefined'){chart.remove();}  //To remove existing chart(if any)
     
  		chart = d3.select("#vis").style({"float":"right"}).append('svg');
		  //Define values for x and y axis for the bar graph
		xPlotValues=val.values();//Holds a list of the %values of respective genres. 
		  //These will be used to define the x Axis of barplot		(Numeric Values)
		yPlotValues=xValues; //Holds a list of all the genres.  (Nominal Values)
		  //These will be marked on the y Axis of barplot
  		vis = chart
    	.attr("width", w1 + m[1] + m[3])
    	.attr("height", h1 + m[0] + m[2])
  		.append("svg:g")
		//Scales for Bar Graph

		xScale = d3.scale.linear().domain([0, d3.max(xPlotValues)])
                 .range([0,h1]);
		yScale = d3.scale.ordinal().domain(yPlotValues)
            .rangeBands([ 0,w1*0.8],0.1);
    
		var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(0);
		var yAxis = d3.svg.axis().scale(yScale).orient('left').tickSize(1);

		vis.append("g")
			.attr("transform","translate(75,"+ (h1-13.5) +")")
			.attr("class", "x axis")
			.on("click", function(){
          //BEHAVIOR OF PLOT ON CLICK, IT SORTS THE BARS BASED ON THE AXIS CLICKED
					vis.selectAll(".axis").remove();
					//Get The sorted values for x & y
					xPlotValues=val.values().sort(d3.ascending); 
					yPlotValues=getSortedKeys(val);
//Scales for updating axis on click ***********
            var xScale2 = d3.scale.linear().domain([0, d3.max(xPlotValues)])
                 .range([0,h1]);
            var yScale2 = d3.scale.ordinal().domain(yPlotValues)//.map(function(d) { return d; }))
            .rangeBands([ 0,w1*0.8],0.1);
    
            var xAxis2 = d3.svg.axis().scale(xScale2).orient('bottom').tickSize(0);
            var yAxis2 = d3.svg.axis().scale(yScale2).orient('left').tickSize(1);
//*****************************************************************************
         
					//Draw Updated X Axes   
		           vis.append("g")
                  .attr("transform","translate(75,"+ (h1-13.5) +")")
                  .attr("class", "x axis")
                  .transition()
                  .call(xAxis2);
					//Draw Updated yAxis
	                vis.append("g")
	                .attr("transform", "translate(" + (75)+ ",0)")
		              .attr("class", "y axis")
                  .on("click",function(d){
                  vis.selectAll("g").remove();
                  drawGraph(xValues,val);
                  })
		             .transition()
		            .call(yAxis2);

		  bars(xPlotValues,maximum);//Draw the bars		
		})
		.transition()
		.call(xAxis);
		
		vis.append("g")
		.attr("transform", "translate(" + (75)+ ",0)")
		.attr("class", "y axis")
		.transition()
		.call(yAxis);

    vis.append("text")      // text label for the x axis
        .attr("x", 265 )
        .attr("y",  h1+10 )
        .style("text-anchor", "middle")
        .text("Percentage")

		bars(xPlotValues,maximum);   			

}
//The scatter plot with 2 axes
function drawGraph2(trackaxis, con){
  		
  		if(typeof(chart)!='undefined'){chart.remove();}
  		chart = d3.select('#vis').style({"float":"right"}).append('svg')
  		vis = chart
    	.attr("width", w1 + m[1] + m[3])
    	.attr("height", h1 + m[0] + m[2])
  		.append("svg:g");
      //Value is an array containing pair of points that are being plotted
      if(!selectflag){//If we want scatter plot of axes (Continents)
  		value=d3.zip(trackaxis[0][1].values(), trackaxis[1][1].values());   
      //Defining scales for scatter plot
		  xScale = d3.scale.linear().domain([0, d3.max(trackaxis[0][1].values())])
                 .range([0,w1*0.9]).nice();
      yScale = d3.scale.linear().domain([0, d3.max(trackaxis[1][1].values())])
                 .range([h1*0.95,0]).nice();
      }
      else{ //If we want scatter plot of lines (Genres)
        value=d3.zip(trackaxis.values()[0], trackaxis.values()[1]);
        //Defining scales for scatter plot
      xScale = d3.scale.linear().domain([0, d3.max(trackaxis.values()[0])])
                 .range([0,w1*0.87]).nice();
      yScale = d3.scale.linear().domain([0, d3.max(trackaxis.values()[1])])
                 .range([h1*0.95,0]).nice();
      }
      //Defining axes for scatter plot
      var xAxis = d3.svg.axis().scale(xScale).orient('bottom').tickSize(0,1);
		  var yAxis = d3.svg.axis().scale(yScale).orient('left').tickSize(0,1);
	
    //Draw Axes for scatter plot  
		vis.append("g")         //X Axis
		    .attr("class", "x axis")  
		    .attr("transform","translate(30,"+ (h1-12) +")")
		    .transition()
		    .call(xAxis);

    vis.append("text")      // text label for the x axis
        .attr("x", 265 )
        .attr("y",  h1+10 )
        .style({"font-size":15, "font-weight":"bold", "text-anchor": "middle"})
        .text(con[0]);

		vis.append("g")       //Y Axis
		    .attr("class", "y axis") 
		    .transition() 
		    .attr("transform", "translate(" + "30,10)")
		    .call(yAxis);

    vis.append("text")      // text label for the y axis
        .attr("x", 32 )
        .attr("y",  25 )
        .transition()
        .style({"font-size":15, "font-weight":"bold"})
        .text(con[1]);

		//Plot the scatterplot
		vis.selectAll("circle")
   		.data(value)
   		.enter()
   		.append("circle")
           	.attr("cx", function(d,i) {
        	return xScale(d[0])+30;
        		
   			})
   			.attr("cy", function(d,i) {
        	return yScale(d[1])+8;

   			}).attr("r",function(d){
              return "3";
            }
      )
      .style("fill", function(d){
              return "tomato";
        })
   		.style("stroke","black");

  }

function totalvalue(){
  //Returns a map of the form:
  //[<name of the genre>, <average viewing percent of that genre accross all continents> ]
	var valuemap=d3.map();
	dataset.map(function(d){
						value=0;
						dimensions.map(function(e){
						value=value+(d[e]/5);
						return valuemap.set(d["Genre"],d[e])})
						});
					
	return valuemap;
  }

function getSortedKeys(obj) {// Given a set of sorted values, return the sorted keys
    var keys = []; for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){return obj[a]-obj[b]});
	
  }

function maxVariance(){
//The variable "dimensions" is nothing but a list of all continents
      var variances=d3.map();
      var temp1=[],temp2;
      var co=0;
      if(selectflag){
      dataset.forEach(function(d){ //for each entry in the database
        temp1=[];
        dimensions.map(function(e){     
          temp1.push(d[e]); 
		  //Every entry in temp1 is a list of values for each genre accross diff continents    
        })
        variances.set(d["Genre"], science.stats.variance(temp1))

		//Calculates the variance of each genre and stores it in the map called "variances"
		//as a key value pair where the key is the genre and the value is the variance for
		//that genre
      })}
      else{
        dimensions.map(function(d){
          temp2=ovalue(d);
          temp2.values();
          variances.set(d, science.stats.variance(temp2.values()));
          
        })
      }
      var sol=d3.map();
      var minvalue=d3.min(variances.values());
      var minattr=getKeyByValue(variances, d3.min(variances.values()));  
      minattr=minattr.trim().substr(1);
      sol.set(minattr, minvalue); 
      return  sol; 
	  //Returns the NAME of the genre with maximum variance
}

function getKeyByValue(hash, value){
  //Function to get the key in a map, given a value
  //Note:The assumption is that in this case we don't
  //have any duplicate valuess
  return String((_.invert(hash))[value]);
  }
function bars(xPlotValues,max){		
    //Draw the bars in BarPlot
		vis.selectAll("rect").remove();
		vis.selectAll("rect")
           	.data(xPlotValues)
           	.enter()
           	.append("rect")
           	.transition()
           	.attr("x", 75)
            .attr("y", function(d, i){
                return yScale(i);
            })
            .attr("width", function(d) {
                return xScale(d);
            })
            .attr("height", yScale.rangeBand())
   			    .style("stroke","black")
   	        .style("fill",function(d,i){
   	    		    if(d==max){		//Colors the genre with max viewers percentage as blue
							       return "SlateBlue";}
   	    		    else{
					           return "Tomato";}    		    
   	        })
    }

function reset(){
              d3.selectAll('p').transition().duration(500).text("The genre Drama has the maximum viewers accross all continents");
              if(typeof(chart)!='undefined'){chart.remove();
                val=totalvalue();
                xValues=val.keys();
                drawGraph(xValues, val);
              }
              d3.selectAll('path').transition().style({'stroke': '', 'stroke-width': '', 'stroke-opacity': ''});
              d3.selectAll('.dimension').transition().style({"fill":"","font-size":"", "font-weight":""});
  }

function setmaxvariancestyle(d) {   
  maxVar=maxVariance().keys()[0];
  if(d.valueOf() === maxVar.valueOf()){    return "SlateBlue";}
  }

function coeff_color(linedetails){
  var corr_coeff = ss.sample_correlation(linedetails[0],linedetails[1] );
  if(corr_coeff<0){ var col="red"}
              else{var col="green"}
    return col;
  }

function show_coeff(linedetails){
  var corr=ss.sample_correlation(linedetails[0],linedetails[1] );
  //d3.selectAll("p").transition().duration(900).style({"color": "white"});
  d3.selectAll("p")
   .text("Coefficient of Correlation:" + parseFloat(Math.round(corr * 1000) / 1000).toFixed(3) )
   .transition().duration(900).style({"color": "purple"});
  }

function show_maxvar(value){
  if(selectflag){var variable="genre"}
  else{var variable="continent"}
  d3.selectAll("p")
   .text("The " + variable + " " + value + " has the minimum variation amongst all " +  variable + "s")
   .transition().duration(900).style({"color": "purple"});
  }


}
