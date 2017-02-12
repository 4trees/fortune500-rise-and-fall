
//init canvas
var m = {t:30,r:20,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var svg = d3.select('#canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    // .attr('preserveAspectRatio','none')
    plot=svg.append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//set scales
var scaleColor = d3.scaleOrdinal()
	.domain(['China','Taiwan','Hongkong'])
	.range(['#A3FB66','#D65671','#2BA3E6']),
	scaleX = d3.scaleBand()
	.range([w/22,w])
    .paddingOuter(.3)
    .paddingInner(.6),
	scaleY = d3.scaleLinear()
	.domain([500,1])
	.range([h,h/500+h*.15]);
var lineGenerator = d3.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.rank)})
    .curve(d3.curveCardinal.tension(0.5));
var axisX = d3.axisBottom().tickPadding(10),
    axisY = d3.axisLeft().tickPadding(10);
var rankbg,X,Y,years,isFirst;
var Byname = JSON.parse(localStorage.getItem('Byname')) || [];
var fortune = JSON.parse(localStorage.getItem('fortune')) || [];

//add animation to lines
function setanimationline(){
    var paths = document.querySelectorAll('.country');
    paths.forEach(path=>{
        animationline(path)
        path.addEventListener("transitionend", function(d){animationline(path)});
    })
}
function animationline(path){
    // console.log(path.getTotalLength())
    var length = path.getTotalLength();
    path.style.transition = path.style.WebkitTransition = 'none';
    path.style.strokeDasharray = length+' ' + length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();
    path.style.transition = path.style.WebkitTransition = 'stroke-dashoffset 3s ease-in-out';
    path.style.strokeDashoffset = '0';
}


d3.csv('../data/fortunedata_01252017.csv',parse,dataloaded);
function dataloaded(err, fortune){
// console.table(fortune);
Byname = d3.nest()
    .key(function(d){return d.name}).sortKeys(d3.ascending)
    .rollup(function(leaves){
        var changes; 
        if(leaves[0].location == 'China' && leaves[0].rank - leaves[leaves.length - 1].rank <= -1){return {values:leaves,
        change:'down'}}
        if(leaves[0].location == 'Hongkong' && leaves[0].rank - leaves[leaves.length - 1].rank <= -1){return {values:leaves,
        change:'down'}}
        if(leaves[0].location == 'China' && leaves[0].rank-leaves[leaves.length - 1].rank >= 100){return {values:leaves,
        change:'rapid'}}
        else{return {values:leaves,change:''}
        }
    })
    .entries(fortune)
localStorage.setItem('Byname', JSON.stringify(Byname));
localStorage.setItem('fortune', JSON.stringify(fortune));
years = d3.map(fortune,function(d){return d.year})

scaleX.domain(years.keys())
axisX.scale(scaleX).tickValues(years.keys()).tickSize(0);
axisY.scale(scaleY).tickValues([1,100,200,300,400,500]).tickSize(-w);


creatediagram()
dots(fortune);lines(Byname);

window.addEventListener('scroll', debounce(checkSlide));


}
function checkSlide(e) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        console.log(slide.offsetTop,slide.clientHeight)

        // half way through the slide
        const slideInAt = (window.scrollY + window.innerHeight) - slide.clientHeight/2;
        // bottom of the slide
        const slideBottom = slide.offsetTop + slide.clientHeight*.5;
        const isHalfShown = slideInAt > slide.offsetTop;
        const isNotScrolledPast = window.scrollY < slideBottom;
        if (isHalfShown && isNotScrolledPast) {
         console.log(slide.id+' :i am in');
         switch(slide.id){  
            case 'slide1': 
                isFirst=true;
                setsight();
                plot.selectAll('.country').style('opacity',0);
                break;
            case 'slide2':
                resetline('.China');
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
         }
        } else {
          console.log(slide.id+' :i am out');
          switch(slide.id){
            case 'slide1':           
               if(isNotScrolledPast){isFirst=false;setsight();}
                break;
            case 'slide2':            
                if(isNotScrolledPast){plot.selectAll('.country').style('opacity',0)}

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
        };}
      })
}
function setsight(){
    if(isFirst){
        document.querySelector('#canvas').classList.remove('blur'); 
        document.querySelector('#diagram').classList.remove('col-lg-12', 'col-md-12', 'col-sm-12')
        document.querySelector('#diagram').classList.add('col-lg-8', 'col-md-8', 'col-sm-8')
        w = document.getElementById('canvas').clientWidth - m.l - m.r,
        h = document.getElementById('canvas').clientHeight - m.t - m.b;
        svg.attr('width', w + m.l + m.r).attr('height', h + m.t + m.b)
        scaleX.range([w/22,w])
        d3.select('.diagram').remove();
        creatediagram()
        dots(fortune);lines(Byname);
        isFirst=false;
    }
    else{
        document.querySelector('#canvas').classList.add('blur'); 
        document.querySelector('#diagram').classList.remove('col-lg-8', 'col-md-8', 'col-sm-8')
        document.querySelector('#diagram').classList.add('col-lg-12', 'col-md-12', 'col-sm-12')
        w = document.getElementById('canvas').clientWidth - m.l - m.r,
        h = document.getElementById('canvas').clientHeight - m.t - m.b;
        svg.attr('width', w + m.l + m.r).attr('height', h + m.t + m.b)
        scaleX.range([w/22,w])
        d3.select('.diagram').remove();
        creatediagram()
        dots(fortune);lines(Byname);
        isFirst=true
    }
}
function creatediagram(){

    rankbg = plot.append('g').attr('class','diagram');
    X = rankbg.append('g').attr('class','axis axis-x').attr('transform','translate(0,'+ h +')'),
    Y = rankbg.append('g').attr('class','axis axis-y');
    X.call(axisX);
    Y.call(axisY);
    rankbg.append('g').attr('class','circle');
    rankbg.append('g').attr('class','line');
    d3.selectAll('.tagprofit').remove();
    rankbg.append("text").attr('class','tagrank')
        .attr("transform", "translate(" + (w/2) + "," + (h + m.b/1.3) + ")")
        .style("text-anchor", "middle")
        .text("Year");
    rankbg.append("text").attr('class','tagrank')
        .attr("transform", "translate(" + (-m.l/4) + "," + (m.t*2) + ")")
        .style("text-anchor", "middle")
        .text("Rank");
    var keys = [];
    keys.push({country:'China'});
    keys.push({country:'Hongkong'});
    keys.push({country:'Taiwan'});
    var key=rankbg.selectAll('.key')
        .data(keys).enter()
        .append("g").attr('class','key')
        .attr("transform", function(d,i){return 'translate(' + (i + 1) * (w/4) + ',' + (m.t) + ')'})

    key.append('circle')
        .attr('r',6)
        .style('stroke',function(d){return scaleColor(d.country)})
        .style('stroke-width','2px')
        .style('fill','none')
    key.append('text')
        .style("text-anchor", "left")
        .text(function(d){return d.country})
        .attr('transform',function(d){return 'translate('+15+','+5+')'});

}
//to select specific country/industry's lines
function resetline(name,filter){
    // console.log(name.substr(1))
    if(name != '.country'){
        plot.selectAll('.dots').style('opacity',.3);

        var getchange=d3.map(Byname,function(d){return d.key})
        plot.selectAll('.dots').filter(d=>{
            // console.log(d)
            var itschange=getchange.get(d.name)
            if(filter == undefined){
                return d.location == name.substr(1);
            }
            else{
                // console.log(d.change+":"+itschange.value.change)
                return d.change == "" ? d.location == name.substr(1) && itschange.value.change == filter : d.location == name.substr(1) && d.change == filter
            }
        })
        .style('opacity',.9)  
    }
    else{plot.selectAll('.dots').style('opacity',.9)}

    plot.selectAll('.country').transition().style('opacity',0);
    plot.selectAll(name).filter(d=>{
        switch(filter){
            case 'rapid':
                switch(name){
                    case '.China':return d[0].rank - d[d.length - 1].rank >= 100;
                    break;
                    case '.Hongkong':return d[0].change == filter;
                    break;
                    case '.Taiwan':return d[0].change == filter;
                    break;
                }
            break;
            case 'down':
                switch(name){
                    case '.China':return d[0].rank - d[d.length - 1].rank <= -1;
                    break;
                    case '.Hongkong':return d[0].rank - d[d.length - 1].rank <= -1;
                    break;
                    case '.Taiwan':return d[0].change == filter;
                    break;
                }
            break;
            case 'top':
                switch(name){
                    case '.China':return d[0].change == filter;
                    break;
                    case '.Hongkong':return d[0].change == filter;
                    break;
                    case '.Taiwan':return d[0].change == filter;
                    break;
                }
            break;
            case undefined:
                return d;
            break;
        }
    })
    .transition().style('opacity',.5)   
}

//to draw line
function lines(data){
    var updateline = d3.select('.line').selectAll('.country')
        .data(data,function(d){return d.key});

    var enterline = updateline.enter()
            .append('path').attr('class',function(d){return 'country '+d.value.values[0].location + ' ' + d.value.change + ' ' + d.value.values[0].industry})
            .datum(function(d){return d.value.values})
            .attr('d',function(d){return lineGenerator(d);})
            
    updateline.merge(enterline)
            .style('stroke',function(d){return scaleColor(d[0].location)})
            .style('fill','none')
            .style('opacity',.5)
            .style('stroke-width',2)
            
    updateline.exit().remove(); 
    setanimationline();
}
//to draw dots
function dots(data){

var updatedots = d3.select('.circle').selectAll('.dots')
        .data(data);
var enterdots = updatedots.enter()
        .append('circle').attr('class',function(d){return 'dots y' + d.year})
        .attr('cx',0)
        .attr('cy',0)
        .style('stroke',function(d){return scaleColor(d.location)})
        .style('stroke-width','2px')
        .style('fill','none')
        .style('opacity',0)
        .attr('r',0)
        .on('click',function(d){console.log(d.rank)})

updatedots.merge(enterdots)
    // .transition().duration(2000)
    .attr('cx',function(d){return scaleX(d.year)})
    .attr('cy',function(d){return scaleY(d.rank)})
    .style('opacity',.5)
    .attr('r','4px')

updatedots.exit().remove(); 
}

function parse(d){
    String.prototype.replaceAll = function(target, replacement) {
      return this.split(target).join(replacement);
    };
    if(d['Location'] == "" || d['Location'] == undefined)return;
    if(d['Year'] == "2008")return;

    return {
    	year:d['Year'],
        rank:+d['Rank'],
        // prerank:+d['PreviousRank']?+d['PreviousRank']:undefined,
        name:d['Name'],
        location:d['Location'],
        // profit:d['Profits'].indexOf('(')?+(d['Profits'].replace('$','').replaceAll(',','')):-(+(d['Profits'].replace('(','').replace(')','').replace('$','').replaceAll(',',''))),
        // assets:+(d['Assets'].replace('$','').replaceAll(',','')),
        // employee:+(d['Employees'].replaceAll(',','')),
        industry:d['industry']!==""?d['industry']:'',
        change:d['Change']!==""?d['Change']:'',
    }
}
