

//init canvas
var m = {t:30,r:20,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//set scales
var scaleColor=d3.scaleOrdinal()
	.domain(['China','Taiwan','Hongkong'])
	.range(['#A3FB66','#D65671','#2BA3E6']),
	scaleX=d3.scaleBand()
	.range([w/22,w])
    .paddingOuter(.3)
    .paddingInner(.6),
	scaleY=d3.scaleLinear()
	.domain([500,1])
	.range([h,h/500]);
var scaleProfit=d3.scalePow()
    .exponent(.5)
    .range([h,0]),
    scaleAsset=d3.scalePow()
    .exponent(.5)
    .range([w/22,w]),
    scaleEmployee=d3.scaleLinear()
    .range([3,30]);
var lineGenerator = d3.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.rank)})
    .curve(d3.curveCardinal.tension(0.5));
var axisX = d3.axisBottom().tickPadding(10),
    axisY = d3.axisLeft().tickPadding(10);
var Byname,fortune,updatedots,enterdots,rankbg,X,Y,isCreated,years;
isCreated=false;
// console.log(isCreated)

//add animation to lines
function animationline(){
    var paths=document.querySelectorAll('.country');
    paths.forEach(path=>{
    // console.log(path)
    var length=path.getTotalLength();
    path.style.transition=path.style.WebkitTransition='none';
    path.style.strokeDasharray=length+' '+length;
    path.style.strokeDashoffset=length;
    path.getBoundingClientRect();
    path.style.transition=path.style.WebkitTransition='stroke-dashoffset 3s ease-in-out';
    path.style.strokeDashoffset='0';

})
}


d3.csv('../data/fortunedata_01252017.csv',parse,dataloaded);

function dataloaded(err, fortune){
// console.table(fortune);


Byname=d3.nest()
    .key(function(d){return d.name}).sortKeys(d3.ascending)
    .entries(fortune)
years=d3.map(fortune,function(d){return d.year})
// console.log(years.keys())
scaleX.domain(years.keys())


const slides = document.querySelectorAll('.slide');
// const dia = document.querySelector('#diagram');
function checkSlide(e) {
    // console.log(e)
    //     const diaInAt = (window.scrollY + window.innerHeight) - dia.clientHeight*1.5 ;
    //     // bottom of the diagram
    //     const diaBottom = dia.offsetTop + dia.clientHeight;
    //     const diaisHalfShown = diaInAt > dia.offsetTop;
    //     const diaisNotScrolledPast = window.scrollY < diaBottom;     
    // if(diaisHalfShown&&diaisNotScrolledPast){
    //     dia.classList.add('fix');
    // }
      slides.forEach(slide => {
        // console.log(slide.offsetTop)
        // half way through the slide
        const slideInAt = (window.scrollY + window.innerHeight) - slide.clientHeight*1.4 ;
        // bottom of the slide
        const slideBottom = slide.offsetTop + slide.clientHeight;
        const isHalfShown = slideInAt > slide.offsetTop;
        const isNotScrolledPast = window.scrollY < slideBottom;
        if (isHalfShown && isNotScrolledPast) {
         // console.log(slide.id+' :i am in');
         switch(slide.id){
            case 'slide1':
                plot.selectAll('.country').remove();
                if(!isCreated){creatediagram()}
                dots(fortune);
                break;
            case 'slide2':
                plot.selectAll('.dots').transition().style('opacity',.5);lines(Byname);resetline('.China');
                // slide.classList.add('fix');
                break;
            case 'slide3':
                resetline('.China','top');
                break;
            case 'slide4':
                resetline('.China','rapid');
                break;
            case 'slide5':
                resetline('.China','down');
                break;    
            case 'slide6':
                resetline('.Hongkong');
                break;
            case 'slide7':
                resetline('.Hongkong','top');
                break;
            case 'slide8':
                resetline('.Hongkong','rapid');
                break;
            case 'slide9':
                resetline('.Taiwan');
                break;
            case 'slide10':
                resetline('.Taiwan','top');
                break;
            case 'slide11':
                resetline('.Taiwan','rapid');
                break;
            case 'slide12':
                resetline('.Taiwan','down');
                break;
            case 'slide13':
                resetline('.country');
                break;
            case 'slide14':
                resetline('.industrial');
                break;
            case 'slide15':
                resetline('.money');
                break;
            case 'slide16':
                plot.selectAll('.country').transition().style('opacity',0);
                new2016();
                break;
            case 'slide17':
                plot.selectAll('.line').transition().style('opacity',0);
                profit(fortune);
                break;
         }
        } else {
          // console.log(slide.id+' :i am out');
          switch(slide.id){
            case 'slide1':
           
               if(isNotScrolledPast){plot.select('.rank').remove();isCreated=false;}
                break;
            case 'slide2':            
                if(isNotScrolledPast){plot.selectAll('.country').remove();}

                break;
            case 'slide3':
                if(!isNotScrolledPast){resetline('.China');}
                break;
            case 'slide4':
                if(!isNotScrolledPast){resetline('.China','top');}
                break;
            case 'slide5':
                if(!isNotScrolledPast){resetline('.China','rapid');}
                break;
            case 'slide6':
                if(!isNotScrolledPast){resetline('.China','down');}
                break;
            case 'slide7':
                if(!isNotScrolledPast){resetline('.Hongkong');}
                break;
            case 'slide8':
                if(!isNotScrolledPast){resetline('.Hongkong','top');}
                break;
            case 'slide9':
                if(!isNotScrolledPast){resetline('.Hongkong','rapid');}
                break;
            case 'slide10':
                if(!isNotScrolledPast){resetline('.Taiwan')}
                break;
            case 'slide11':
                if(!isNotScrolledPast){resetline('.Taiwan','top')}
                break;
            case 'slide12':
                if(!isNotScrolledPast){resetline('.Taiwan','rapid')}
                break;
            case 'slide13':
                if(!isNotScrolledPast){resetline('.Taiwan','down')}
                break;
            case 'slide14':
                if(!isNotScrolledPast){resetline('.country')}
                break;
            case 'slide15':
                if(!isNotScrolledPast){resetline('.industrial')}
                break;
            case 'slide16':
                if(!isNotScrolledPast){resetline('.money');}
                break;
            case 'slide17':
                if(!isNotScrolledPast){resetprofit();new2016()}
                // if(X!==undefined){if(!isNotScrolledPast){resetprofit();}}
                
                break;
        };}
      })
}
window.addEventListener('scroll', debounce(checkSlide));


}

function creatediagram(){
rankbg=plot.append('g').attr('class','rank');
X=rankbg.append('g').attr('class','axis axis-x').attr('transform','translate(0,'+h+')'),
Y=rankbg.append('g').attr('class','axis axis-y');
rankbg.append('g').attr('class','circle');
rankbg.append('g').attr('class','line');
isCreated=true;
}
//to select specific country/industry's lines
function resetline(name,filter){
plot.selectAll('.dots').style('opacity',.5);

    plot.selectAll('.country').transition().style('opacity',0);
    plot.selectAll(name).filter(d=>{
    switch(filter){
        case 'rapid':
            switch(name){
                case '.China':return d[0].rank-d[d.length-1].rank>=100;
                break;
                case '.Hongkong':return d[0].change==filter;
                break;
                case '.Taiwan':return d[0].change==filter;
                break;
            }
        break;
        case 'down':
            switch(name){
                case '.China':return d[0].rank-d[d.length-1].rank<0;
                break;
                case '.Hongkong':return d[0].rank-d[d.length-1].rank<0;
                break;
                case '.Taiwan':return d[0].change==filter;
                break;
            }
        break;
        case 'top':
            switch(name){
                case '.China':return d[0].change==filter;
                break;
                case '.Hongkong':return d[0].change==filter;
                break;
                case '.Taiwan':return d[0].change==filter;
                break;
            }
        break;
        case undefined:
        return d;
        break;
    }
        
    })
    .transition().duration(1000).style('opacity',.5)   
    animationline();
}

//to draw line
function lines(data){
var updateline=plot.select('.line').selectAll('.country')
    .data(data,function(d){return d.key});

axisX.scale(scaleX).tickValues(years.keys()).tickSize(0);
axisY.scale(scaleY).tickValues([1,100,200,300,400,500]).tickSize(-w);
X.call(axisX);
Y.call(axisY);
var enterline=updateline.enter()
        .append('path').attr('class',function(d){return 'country '+d.values[0].location+' '+d.values[0].change+' '+d.values[0].industry})
        .datum(function(d){return d.values})
        .attr('d',function(d){return lineGenerator(d);})
        
updateline.merge(enterline)
        .style('stroke',function(d){return d[0].rank-d[d.length-1].rank>=0?scaleColor(d[0].location):'#999'})
        .style('fill','none')
        .style('opacity',.5)
        .style('stroke-width',2)
        
updateline.exit().remove(); 
animationline();

}
//to draw dots
function dots(data){

axisX.scale(scaleX).tickValues(years.keys()).tickSize(0);
axisY.scale(scaleY).tickValues([1,100,200,300,400,500]).tickSize(-w);
X.call(axisX);
Y.call(axisY);
updatedots=plot.select('.circle').selectAll('.dots')
    .data(data);
enterdots=updatedots.enter()
    .append('circle').attr('class',function(d){return d.year=='2016'&&d.prerank==undefined?'dots new2016 y'+d.year:'dots y'+d.year})
    .attr('cx',0)
    .attr('cy',0)
    .style('stroke',function(d){return scaleColor(d.location)})
    .style('stroke-width','2px')
    .style('fill','none')
    .style('opacity',0)
    .attr('r',0)
    .on('click',function(d){console.log(d.rank)})
    
updatedots.merge(enterdots)
    .transition().duration(2000)
    .attr('cx',function(d){return scaleX(d.year)})
    .attr('cy',function(d){return scaleY(d.rank)})
    .style('opacity',.5)
    .attr('r','4px')

updatedots.exit().remove(); 
}

//only 2016 new
function new2016(){
// plot.select('.rank').attr('transform','translate('+ (-w/2)+','+ 0+')');
plot.selectAll('.dots').transition().duration(1000).style('opacity',0.1);
plot.selectAll('.new2016').transition().duration(1000).style('opacity',1)
}

//draw profit
function profit(data){
const data20152016=data.filter(d=>{return d.year=='2015'||d.year=='2016';})
// console.table(data20152016)
plot.selectAll('.country').style('opacity',0);
scaleProfit.domain(d3.extent(data20152016,function(d){return d.profit}))
scaleAsset.domain(d3.extent(data20152016,function(d){return d.assets}))
scaleEmployee.domain(d3.extent(data20152016,function(d){return d.employee}))


updatedots.merge(enterdots)
    .style('opacity',function(d){if(d.year!='2016'&&d.year!='2015'){return 0;}else{return d.year=='2016'?1:0.3;}})
    .transition().duration(2000)
    .attr('cx',function(d){return (d.year=='2016'||d.year=='2015')?scaleAsset(d.assets):w/2})
    .attr('cy',function(d){return (d.year=='2016'||d.year=='2015')?scaleProfit(d.profit):h/2})
    .attr('r',function(d){return (d.year=='2016'||d.year=='2015')?(scaleEmployee(d.employee)+'px'):'0px'});

axisX.scale(scaleAsset).tickValues([250000,500000,1000000,2000000,2500000]);
axisY.scale(scaleProfit).tickValues([-20000,-10000,0,10000,20000,30000,40000,50000]).tickSize(-w);

X.call(axisX);
Y.call(axisY); 


 }
function resetprofit(){
    console.log(years)
plot.selectAll('.dots').style('opacity',.5)
axisX.scale(scaleX).tickValues(years.keys()).tickSize(0);
axisY.scale(scaleY).tickValues([1,100,200,300,400,500]).tickSize(-w);
Y.call(axisY);
X.call(axisX);
updatedots.merge(enterdots)
    .attr('cx',function(d){return scaleX(d.year)})
    .attr('cy',function(d){return scaleY(d.rank)})
    .attr('r','4px')


}

function parse(d){
String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};
if(d['Location']==""||d['Location']==undefined)return;
if(d['Year']=="2008")return;

    return {
    	year:d['Year'],
        rank:+d['Rank'],
        prerank:+d['PreviousRank']?+d['PreviousRank']:undefined,
        name:d['Name'],
        location:d['Location'],
        profit:d['Profits'].indexOf('(')?+(d['Profits'].replace('$','').replaceAll(',','')):-(+(d['Profits'].replace('(','').replace(')','').replace('$','').replaceAll(',',''))),
        assets:+(d['Assets'].replace('$','').replaceAll(',','')),
        employee:+(d['Employees'].replaceAll(',','')),
        industry:d['industry']!==""?d['industry']:'',
        change:d['Change']!==""?d['Change']:'',
    }
}
