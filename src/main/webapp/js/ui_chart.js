var selectedStationId;
var userName;
var sessionId;
$(document).ready(function(){

    selectedStationId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    console.log("selectedStationId is " + selectedStationId);
    userName = window.location.href.split("?")[1].split("&")[1].split("=")[1];
    console.log("userName is " + userName);
    sessionId = window.location.href.split("?")[1].split("&")[2].split("=")[1];
    console.log("sessionId is " + sessionId);

    checkLoginStatus();

    function checkLoginStatus(){
        $.ajax({
            url: 'login/isSession',
            type: 'POST',
            data: JSON.stringify({"username": sessionId}),
            dataType: 'text',
            contentType: "application/json;charset=UTF-8",
            success:function(res){
                if(res){
                    console.log("get session value success! -->userName="+sessionId);
                }else{
                    console.log("get session value failed!");
                    $(window.location).attr('href', 'login.html');
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log("request failed!");
                $(window.location).attr('href', 'login.html');
            }
        });
    }

    $("#lr2").css("height","1100px");
    $("#chart_table1").hide();
    $("#chart_table2").hide();
    $("#chart_Dashboard").hide();


    goConfigsiteBtn = $('#goConfigsiteBtn');
    goConfigsiteBtn.click(function(){
        if(selectedStationId == 0||selectedStationId == undefined){
            alert("siteId is invalid!");
        }else{
            $(window.location).attr('href', 'configsite.html?siteId='+selectedStationId+'&user='+userName+'&sessionId='+sessionId);
        }
    });

    $("img#hnav1").click(function () {
        $(window.location).attr('href', 'home.html?user='+userName+'&sessionId='+sessionId);
    });
    $("#upRule").click(function () {
        $(window.location).attr('href', 'uploadrules.html?siteId='+selectedStationId+'&user='+userName+'&sessionId='+sessionId);
    });
    $("#logout").click(function(){
        $.ajax({
            url: 'login/logOutSession',
            type: 'POST',
            data: JSON.stringify({"sessionId": sessionId}),
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            success:function(res){
                if(res){
                    console.log("log out session  success! -->last sessionId="+sessionId);
                    $(window.location).attr('href', 'login.html');
                }else{
                    console.log("log out session failed!");
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                console.log("request failed!");
            }
        });
    });

    initTreeView();
});

var siteChartOne1, siteChartOne2, siteChartTwo, siteChartThird;
var isCreateSite = false;
var nodes;
var equipType, equipTypeIndex;
var period = 0;


function initTreeView(){
    $('#tree').treeview({
        data: getTree(),
        levels: 3,
        collapseIcon: "glyphicon glyphicon-chevron-down",
        expandIcon: "glyphicon glyphicon-chevron-right",
        showTips:true,
        onNodeSelected: function(event, data) {
            var level = data.level;
            if (level != 1) {
                var parentId = data.parentId;
                var str = parentId.split(".");
                equipType = str[2];
                equipTypeIndex = str[3];
            }

            if (level == 1) {

            } else if (level == 2) {

                $("#chart_table1").hide();
                $("#chart_table2").hide();
                $("#chart_Dashboard").show();

                $('.form_datetime').datetimepicker({
                    //language:  'fr',
                    format: "yyyy-mm-dd hh:ii:ss",
                    weekStart: 1,
                    todayBtn:  1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    forceParse: 0,
                    showMeridian: 1
                });

                dashBoardOne_1();
                dashBoardOne_2();
                dashBoardTwo();
                dashBoardThree();

            } else if (level == 3) {

                $("#chart_table1").hide();
                $("#chart_Dashboard").hide();
                $("#chart_table2").show();

                EquipChartOne();
                EquipChartTwo();
                EquipTable();

            } else if (level == 4) {

                $("#chart_Dashboard").hide();
                $("#chart_table2").hide();
                $("#chart_table1").show();

                RuleChartTwo(false);
                RuleTable();
            }
        }
    });
}


//fake chart and table ---------------------------------------------->>
function RuleChartTwo(){
    var myChartTwo = echarts.init(document.getElementById('echartTwo'));
    var optionTwo = {
        title: {
            text: 'ECUST-Station Goods Records',
            x:'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        dataZoom: [{
                type: 'slider',
                start: 0,
                end: 20
            },{
                type: 'inside',
                start: 0,
                end: 20
            }
        ],
        legend: {
            show:true,
            data:['current','last'],
            type: 'scroll',
            orient: 'vertical',
            right: 30,
            top: 60
        },
        grid:{
            x:60,//margin-left
            x2:180,//margin-right
            y:50,//margin-top
            y2:70//margin-bottom
        },
        color:[
            '#734297',
            '#998bbc'
        ],
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type : 'category',
            name: 'Date',
            data : [],
            splitLine:{
                show: false
            }
        },
        yAxis : [{
                type : 'value',
                name : 'Count',
                axisLabel : {
                    formatter: '{value}'
                },
                splitNumber:10
            }
        ],
        series : [{
                name:'current',
                type:'bar',
                data:[],
                barWidth:25,
                barGap:'0%'
            },{
                name:'last',
                type:'bar',
                data:[],
                barWidth:25,
                barGap:'0%'
            }
        ]
    };

    myChartTwo.showLoading();
    myChartTwo.setOption(optionTwo);

    var result = {
        "valueCurrent":["27","36","38","36","44","47","31","50","40","27","36","38","36","44","47","31","50","40"],
        "valueLast":["0","27","36","38","36","44","47","31","50","40","27","36","38","36","44","47","31","50"],
        "dateStr":["2017-08-01","2017-08-02","2017-08-03","2017-08-04","2017-08-05","2017-08-06","2017-08-07","2017-08-08","2017-08-09","2017-08-10","2017-08-11","2017-08-12","2017-08-13","2017-08-14","2017-08-15","2017-08-16","2017-08-17","2017-08-18"]
    };
    var curr = [];
    var last = [];
    var dates = [];
    for (var i = 0; i < result.valueCurrent.length; i++) {
        curr.push(result.valueCurrent[i]);
        last.push(result.valueLast[i]);
        dates.push(result.dateStr[i]);
    }

    myChartTwo.hideLoading();
    myChartTwo.setOption({
        xAxis: {
            data: dates
        },
        series: [{
                name: 'last',
                data: last
            },{
                name: 'current',
                data: curr
            }
        ]
    });
}
function RuleTable(){
    getGoodsRecords(selectedStationId);

    $(function () {
        $('#reportTable').bootstrapTable({
            method: 'get',
            cache: false,
            height: 300,
            striped: true,
            pagination: true,
            pageSize: 20,
            pageNumber:1,
            pageList: [10, 20, 50, 100, 200, 500],
            sidePagination:'client',
            search: false,
            showColumns: false,
            showRefresh: false,
            showExport: false,
            exportTypes: ['csv','txt','xml'],
            clickToSelect: true,
            columns: [
                {
                    field: 'state',
                    checkbox: false,
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'id',
                    title: 'ID',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'date',
                    title: 'Date',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'barcode',
                    title: 'Barcode',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'weight',
                    title: 'Weight',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'station',
                    title: 'Station',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'inputWay',
                    title: 'Input Way',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'mark',
                    title: 'Mark',
                    align: 'center',
                    valign: 'middle'
                }
            ],
            data:[]
        });
    });
}


function EquipChartOne(){
    var myChartR = echarts.init(document.getElementById('equipEchartOneR'));
    var myChartL = echarts.init(document.getElementById('equipEchartOneL'));
    var optionR = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            textStyle:{
                fontFamily:'Arial',
                fontSize:16,
                fontStyle:'normal',
                fontWeight:'bold'
            }
        },
        legend: {
            orient : 'horizontal',
            x : 'left',
            left:60,
            data:['important','general','special']
        },
        grid: {
            x:60,//margin-left
            x2:10,//margin-right
            y:50,//margin-top
            y2:70//margin-bottom
        },
        calculable : true,
        series : [
            {
                name:'Goods Type',
                type:'pie',
                radius : ['40%', '70%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontSize : '16',
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                data:[
                    {   value:335,
                        name:'important',
                        itemStyle:{
                            normal:{
                                color:'#51ff86'
                            }
                        }
                    },
                    {value:310,
                        name:'general',
                        itemStyle:{
                            normal:{
                                color:'#ffa71d'
                            }
                        }
                    },
                    {value:234,
                        name:'special',
                        itemStyle:{
                            normal:{
                                color:'#a971ff'
                            }
                        }
                    }
                ]
            }
        ]
    };
    myChartR.setOption(optionR);
    var optionL = {
        title : {
            text: 'Xuhui Station Condition',
            subtext: '',
            x:'center',
            top:23
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {
                type: 'shadow'
            }
        },
        dataZoom: [{
                type: 'slider',
                start: 0,
                end: 20
            }, {
                type: 'inside',
                start: 0,
                end: 20
            }
        ],
        legend: {
            data:['important','general','special']
        },
        toolbox: {
            show : true,
            orient : 'vertical',
            y : 'center',
            feature : {
                mark : {show: true},
                magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [{
                type : 'category',
                name:'Date',
                data : ['7/2/2017','7/3/2017','7/4/2017','7/5/2017','7/6/2017','7/7/2017','7/8/2017']
            }
        ],
        yAxis : [{
                type : 'value',
                name:'Count',
                axisLabel : {
                    formatter: '{value}'
                },
                splitNumber:10,
                splitArea : {show : true}
            }
        ],
        grid: {
            x:60,//margin-left
            x2:80,//margin-right
            y:50,//margin-top
            y2:70//margin-bottom
        },
        series : [{
                name:'important',
                type:'bar',
                stack: 'Total',
                itemStyle:{
                    normal:{
                        color:'#51ff86'
                    }
                },
                data:[320, 332, 301, 334, 390, 330, 320]
            },{
                name:'general',
                type:'bar',
                stack: 'Total',
                itemStyle:{
                    normal:{
                        color:'#ffa71d'
                    }
                },
                data:[120, 132, 101, 134, 90, 230, 210]
            },{
                name:'special',
                type:'bar',
                stack: 'Total',
                itemStyle:{
                    normal:{
                        color:'#a971ff'
                    }
                },
                data:[220, 182, 191, 234, 290, 330, 310]
            }
        ]
    };
    myChartL.setOption(optionL);
    setTimeout(function (){
        window.onresize = function () {
            myChartR.resize();
            myChartL.resize();
        }
    },200);
}
function EquipChartTwo(){
    var myChartTwo = echarts.init(document.getElementById('equipEchartTwo'));
    var optionTwo = {
        title: {
            text: 'Xuhui Station Count/Date Statistics',
            x:'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        dataZoom: [{
                type: 'slider',
                start: 0,
                end: 20
            },{
                type: 'inside',
                start: 0,
                end: 20
            }
        ],
        legend: {
            show:true,
            data:['value'],
            type: 'scroll',
            orient: 'vertical',
            right: 30,
            top: 60
        },
        grid:{
            x:60,//margin-left
            x2:180,//margin-right
            y:50,//margin-top
            y2:70//margin-bottom
        },
        color:[
            '#138fcb'
        ],
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type : 'category',
            name:'Station',
            data : [],
            splitLine:{
                show: false
            }
        },
        yAxis : [ {
                type : 'value',
                name : 'Count',
                axisLabel : {
                    formatter: '{value}'
                },
                splitNumber:10
            }

        ],
        series : [{
                name:'value',
                type:'bar',
                data:[],
                barWidth:25,
                barGap:'0%'
            }
        ]
    };

    myChartTwo.showLoading();
    myChartTwo.setOption(optionTwo);

    var result = {
        "value":["27","36","38","19","23"],
        "dateStr":["ECUST-Station","StatonA","StatonB","StationC","StationD"]
    };

    var values = [];
    var dates = [];

    for (var i = 0; i < result.value.length; i++) {
        values.push(result.value[i]);
        dates.push(result.dateStr[i]);
    }
    myChartTwo.hideLoading();
    myChartTwo.setOption({
        xAxis: {
            data: dates
        },
        series: [{
                name: 'value',
                data: values
            }
        ]
    });
}
function EquipTable(){

    var datas  = [];
    var i = 0;
    datas[i++] = {"station":"StationA","date":"2017-11-01 13:33","barcode":"83257802129","weight":"2.0kg","inputWay":"Machine","mark":""}
    datas[i++] = {"station":"ECUST-Station","date":"2017-12-19 11:03","barcode":"00129832578","weight":"2.3kg","inputWay":"Machine","mark":"Valid"}
    datas[i++] = {"station":"StationB","date":"2017-12-19 16:21","barcode":"83543309134","weight":"1.0kg","inputWay":"Machine","mark":""}
    datas[i++] = {"station":"StationC","date":"2017-12-19 20:50","barcode":"30918354334","weight":"1.7kg","inputWay":"Machine","mark":""}
    datas[i++] = {"station":"StationD","date":"2017-12-19 20:31","barcode":"80913435433","weight":"3.0kg","inputWay":"Manual","mark":""}
    datas[i++] = {"station":"StationE","date":"2017-12-19 20:41","barcode":"A0913434393","weight":"1.1kg","inputWay":"Machine","mark":""}
    for(var j=0; j<50; ++j){
        datas[i++] = {"station":"Station" + j,"date":"2017-12-18 13:11" + j,"barcode":"83257802129","weight":"2.0kg","inputWay":"Machine","mark":""}
    }

    $(function () {
        $('#reportEquipTable').bootstrapTable({
            method: 'get',
            cache: false,
            height: 300,
            striped: true,
            pagination: true,
            pageSize: 20,
            pageNumber:1,
            pageList: [10, 20, 50, 100, 200, 500],  sidePagination:'client',
            search: false,
            showColumns: false,
            showRefresh: false,
            showExport: false,
            exportTypes: ['csv','txt','xml'],
            clickToSelect: true,
            columns: [{
                    field: 'station',
                    title: 'Station',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'date',
                    title: 'Date',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'barcode',
                    title: 'Barcode',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'weight',
                    title: 'Weight',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'inputWay',
                    title: 'Input Way',
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'mark',
                    title: 'Mark',
                    align: 'center',
                    valign: 'middle'
                }
            ],
            data:datas
        });
    });
}

//*** Site Level Chart ************************************************
function dashBoardOne_1(){

    if (!isCreateSite) {
        siteChartOne1 = echarts.init(document.getElementById('dashPieOne'));
    }

    var datas = [
        {name:'ECUST-Station', value: 1580},
        {name:'StationA', value: 1100},
        {name:'StationB', value: 700},
        {name:'StationC', value: 100},
        {name:'StationD', value: 20},
        {name:'StationE', value: 620},
        ];

    //get data end ****************************************************

    var optionPieOne = {
        title : {
            text: 'Shanghai',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['ECUST-Station','StationA','StationB','StationC',
                'StationD','StationE'
            ]
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        color : ['#2086ce','#d5c32d','#4653BC','#178ebc','#BC54B0','#32b8bd'],
        calculable : true,
        series : [
            {
                name:'count',
                type:'pie',
                radius : '55%',
                center: ['60%', '60%'],
                data: datas
            }
        ]
    };

    siteChartOne1.setOption(optionPieOne);
}
function dashBoardOne_2(){
    console.log("Step into Site ChartOne2");
    if (!isCreateSite) {
        siteChartOne2 = echarts.init(document.getElementById('dashPieTwo'));
    }

    var datas = [
        {name:'important', value:100},
        {name:'general', value:3000},
        {name:'special', value: 20}
        ];

    var optionPieTwo = {
        title : {
            text: 'Goods',
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['important','general','special'
            ]
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        color : ['#BA9cF4','#3ec81f','#bc1869'],
        series : [{
                name:'count',
                type:'pie',
                radius : '55%',
                center: ['60%', '60%'],
                data: datas
            }
        ]
    };
    siteChartOne2.setOption(optionPieTwo);
}
function dashBoardTwo(st, et, period){
    if (!isCreateSite) {
        siteChartTwo = echarts.init(document.getElementById('dashEchartTwo'));
    }

    //fake data for test ***********************
    var data = {
        counts: [240, 238, 350, 302, 330, 300, 240, 238, 350, 302, 330, 300],
        dates: [ "2017-12-08", "2017-12-09", "2017-12-10", "2017-12-11", "2017-12-12","2017-12-13", "2017-12-14", "2017-12-15","2017-12-16", "2017-12-17", "2017-12-18","2017-12-19"]
    };
    //get data end, try to adapt data **********************
    var alarmCount = data.counts;
    //var lastAlarmCount = data.lastCounts;
    var dates = data.dates;
    //date ready, try to load... ***************************

    var optionTwo = {
        title: {
            text: 'Shanghai',
            x: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        dataZoom: [
            {
                type: 'slider',
                start: 0,
                end: 20
            },
            {
                type: 'inside',
                start: 0,
                end: 20
            }
        ],
        legend: {
            show:true,
            data:['Goods Count'],
            type: 'scroll',
            orient: 'vertical',
            right: 30,
            top: 60
        },
        grid:{
            x:60,//margin-left
            x2:180,//margin-right
            y:50,//margin-top
            y2:70//margin-bottom
        },
        color:[
            '#734297'
            //'#998bbc'
        ],
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: true},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type : 'category',
            name: 'Time',
            data : [],
            splitLine:{
                show: false
            }
        },
        yAxis : [
            {
                type : 'value',
                name : 'Count',
                axisLabel : {
                    formatter: '{value}'
                },
                splitNumber:10
            }
        ],
        series : [
            {
                name: 'Goods Count',
                type: 'bar',
                data: [],
                barWidth: 25,
                barGap: '0%'
            }
        ]
    };

    siteChartTwo.showLoading();
    siteChartTwo.setOption(optionTwo);
    siteChartTwo.hideLoading();
    siteChartTwo.setOption({
        xAxis: {
            data: dates
        },
        series: [{
                name: 'Goods Count',
                data: alarmCount
            }
        ]
    });
}
function dashBoardThree(){
    console.log("dashBoardThree begin");

    if (!isCreateSite) {
        siteChartThird = echarts.init(document.getElementById('dashEchartThree'));
    }

    //fake data for test ***********************
    var data = {
        counts: [814, 630, 600, 780, 500, 800],
        equipName: ["ECUST-Station", "StationA", "StationB", "StationC", "StationD", "StationE"]
    };
    //get data end, try to adapt data **********************
    var alarmCount = data.counts;
    var equipName = data.equipName;
    //date ready, try to load... ***************************

    var optionTwo = {
        title: {
            text: 'Stations',
            x:'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        dataZoom: [
            {
                type: 'slider',
                start: 0,
                end: 20
            },
            {
                type: 'inside',
                start: 0,
                end: 20
            }
        ],
        legend: {
            show:true,
            data:['Goods Count'],
            type: 'scroll',
            orient: 'vertical',
            right: 30,
            top: 60
        },
        grid:{
            x:60,//margin-left
            x2:180,//margin-right
            y:50,//margin-top
            y2:70//margin-bottom
        },
        color:[
            '#734297'
        ],
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type : 'category',
            name:'Stations',
            data : [],
            splitLine:{
                show: false
            }
        },
        yAxis : [
            {
                type : 'value',
                name : 'Count',
                axisLabel : {
                    formatter: '{value}'
                },
                splitNumber:10
            }
        ],
        series : [
            {
                name: 'Goods Count',
                type: 'bar',
                data: [],
                barWidth: 25,
                barGap: '0%'
            }
        ]
    };
    siteChartThird.showLoading();
    siteChartThird.setOption(optionTwo); //necessary?
    siteChartThird.hideLoading();
    siteChartThird.setOption({
        xAxis: {
            data: equipName
        },
        series: [
            {
                name: 'Goods Count',
                data: alarmCount
            }
        ]
    });
}

//<<-------------------------- Chart Show Area ----------------------------------------------->>

function getGoodsRecords(stationId) {
    console.log("try to get goods records");
    $.ajax({
        url: 'goods/getGoodsRecords',
        type: 'POST',
        data: JSON.stringify({"stationId":stationId.toString()}),
        dataType: 'json',
        contentType: "application/json; charset=UTF-8",
        success: function (res) {
            if (res != "N") {
                fillGoodsToTable(res);
            } else {
                console.log("getGoodsRecords wrong:" + res)
            }
        },
        error: function () {
            console.log("getGoodsRecords error");
        }
    });
}

function fillGoodsToTable(data) {
    for (var i in data) {
        var innerData = data[i];
        $('#reportTable').bootstrapTable('insertRow', {
            index: $('#reportTable').bootstrapTable('getOptions').totalRows,
            row:{
                id: innerData.id,
                date: innerData.date,
                barcode: innerData.barcode,
                weight: innerData.weight,
                station: innerData.station,
                inputWay: innerData.inputWay,
                mark: innerData.mark
            }
        });
    }
}

function getTree() {
    var data = [{
        text: 'Station', state:{checked:true, disabled:false}, class: 'Area',
        nodes:[
            { text: 'Shanghai', state:{checked:true, disabled:false}, class: 'Area',
                nodes:[
                { text: 'Xuhui',state:{checked:true, disabled:false}, class: 'Area',
                    nodes:[
                    { text: 'ECUST-Station',state:{checked:true, disabled:false}, class: 'Area' },
                        { text: 'StationA',state:{checked:true, disabled:false}, class: 'Area' },
                        { text: 'StationB',state:{checked:true, disabled:false}, class: 'Area' },
                        { text: 'StationC',state:{checked:true, disabled:false}, class: 'Area' },
                        { text: 'StationD',state:{checked:true, disabled:false}, class: 'Area' },
                        { text: 'StationE',state:{checked:true, disabled:false}, class: 'Area' }
                ]}
            ]}
        ]
    }];
    return data;
}