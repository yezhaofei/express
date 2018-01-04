var selectedStationId;
var userName;
var sessionId;
$(document).ready(function () {

    var paramLenth = window.location.href.split("?")[1].split("&").length;
    if(paramLenth == 3){
        selectedStationId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        console.log("selectedStationId is " + selectedStationId);
        userName = window.location.href.split("?")[1].split("&")[1].split("=")[1];
        console.log("userName is " + userName);
        sessionId = window.location.href.split("?")[1].split("&")[2].split("=")[1];
        console.log("sessionId is " + sessionId);
    }else if(paramLenth == 2){
        userName = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        console.log("userName is " + userName);
        sessionId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
        console.log("sessionId is " + sessionId);
    }
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

    $('div#divTableMatch').hide();
    $('div#divEquipment').hide();
    $('#onLoading').hide();
    var hnavDiv1=document.getElementById("lr211"),
        hnavDiv2=document.getElementById("lr212");
    hnavDiv1.style.backgroundColor = "#262c43";
    hnavDiv2.style.backgroundColor = "#eee";

    var $table = $('#table'),
        $btnDelete = $('#btnDelete');
    $goChartBtn = $("#goChartBtn");


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
    function initTable() {
        $table.bootstrapTable({
            height: getHeight(),
            columns: [
                {
                    field: 'state',
                    checkbox: true,
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
            //onExpandRow: expandDetailRow
        });
        // sometimes footer render error.
        setTimeout(function () {
            $table.bootstrapTable('resetView');
        }, 200);
        $(window).resize(function () {
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
        $table.on('check.bs.table uncheck.bs.table ' + 'check-all.bs.table uncheck-all.bs.table', function () {
            $btnDelete.prop('disabled', !$table.bootstrapTable('getSelections').length);
        });

        $('#btnUpdate').click(function() {
            console.log("refresh")
            //refresh page.
            //document.execCommand('Refresh'); //not valid
            location.reload();
        });

        getGoodsRecords(selectedStationId);
    }

    $goChartBtn.click(function(){
        if(selectedStationId == 0||selectedStationId == undefined){
            $('#msg').html("siteId is invalid!");
            $("#btnCloseSN").html("ok");
            $('#myModal').modal({
                keyboard: true
            });
        }else{
            getCurSiteIdAndRedirect(selectedStationId,userName,sessionId);
        }

    });
    //get current siteId and then redirect to ui_chart.html
    function getCurSiteIdAndRedirect(selectedStationId,userName,sessionId) {
        $(window.location).attr('href', 'ui_chart.html?siteId='+selectedStationId+'&user='+userName+'&sessionId='+sessionId);
    }

    $btnDelete.click(function() {
        removeRow();
    });

    function removeRow() {
        var ids = getIdSelections();
        console.log("ids:" + ids);
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        removeStation(ids);
    }

    function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }

    function removeStation(ids) {
        $.ajax({
            url: 'goods/delete',
            type: 'POST',
            data: JSON.stringify({'ids':ids}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("delete success");
                } else {
                    console.log("delete station wrong:" + res);
                }
            },
            error: function (e) {
                console.log("delete station error :"+e);
            }
        });
    }


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
        console.log("try to fill...");
        for (var i in data) {
            var innerData = data[i];
            $('#table').bootstrapTable('insertRow', {
                index: $('#table').bootstrapTable('getOptions').totalRows,
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


    $('#tree').treeview({
        data: getTree(),
        levels: 3,
        collapseIcon: "glyphicon glyphicon-chevron-down",
        expandIcon: "glyphicon glyphicon-chevron-right",
        showTips:true,
        onNodeSelected: function(event, data) {
        }
    });

    function getHeight() {
        return $(window).height() - $('h1').outerHeight(true);
    }
    $(function () {
        var scripts = [
                '../js/bootstrap-table.js',
                '../js/bootstrap-table-editable.js',
                '../js/bootstrap-editable.js'
            ],
            eachSeries = function (arr, iterator, callback) {
                callback = callback || function () {};
                if (!arr.length) {
                    return callback();
                }
                var completed = 0;
                var iterate = function () {
                    iterator(arr[completed], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            if (completed >= arr.length) {
                                callback(null);
                            }
                            else {
                                iterate();
                            }
                        }
                    });
                };
                iterate();
            };
        eachSeries(scripts, getScript, initTable);
    });
    function getScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = url;
        var done = false;
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState ||
                    this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;
                if (callback)
                    callback();
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
            }
        };
        head.appendChild(script);
        // We handle everything using the script element injection
        return undefined;
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
})


