var curUser;
var sessId;
$(document).ready(function () {

    curUser = window.location.href.split("?")[1].split("&")[0].split("=")[1];
    console.log("user is:" + curUser);
    sessId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
    console.log("sessionId is:" + sessId);
    if (curUser == undefined || curUser == null || sessId == undefined || sessId == null){
        $(window.location).attr('href', 'login.html');
    }

    checkLoginStatus();

    function checkLoginStatus(){
        $.ajax({
            url: 'login/isSession',
            type: 'POST',
            data: JSON.stringify({"username": sessId}),
            dataType: 'text',
            contentType: "application/json;charset=UTF-8",
            success:function(res){
                if(res){
                    //console.log("get session value success! -->userName="+sessId);
                }else{
                    //console.log("get session value failed!");
                    $(window.location).attr('href', 'login.html');
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                //console.log("request failed!");
                $(window.location).attr('href', 'login.html');
            }
        });
    }
    $("#hnav3").click(function(){
        var selects = $table.bootstrapTable('getSelections');
        var length = Object.keys(selects).length;
        if(length > 1){
            $('#msg').html("Only choose a station !");
            $("#modalTitle").html("Error");
            $("#modalTitle").css("color","red");
            $("#btnCloseSN").html("ok");
            $('#myModal').modal({
                keyboard: true
            });
        }else if(length == 1){
            var row = selects[0];
            //var webCtrl = row.webCtrlIp + ":" + row.webCtrlPort;
            //getCurSiteIdAndRedirectToUiChart(row.siteName, webCtrl, row.webCtrlUser, row.webCtrlPwd);
            $(window.location).attr('href', 'ui_chart.html?siteId='+row.id+'&user='+curUser+'&sessionId='+sessId);
        }else{
            $('#msg').html("Choose a station at least !");
            $("#modalTitle").html("Error");
            $("#modalTitle").css("color","red");
            $("#btnCloseSN").html("ok");
            $('#myModal').modal({
                keyboard: true
            });
        }
    });
    $("#upRule").click(function () {
        $(window.location).attr('href', 'uploadrules.html?user='+curUser+'&sessionId='+sessId);
    });
    $("#logout").click(function(){
        $.ajax({
            url: 'login/logOutSession',
            type: 'POST',
            data: JSON.stringify({"sessionId": sessId}),
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            success:function(res){
                if(res){
                    console.log("log out session  success! -->last sessionId="+sessId);
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


    $('.divDragShow').hide();
    var $table = $('#table'),
        $btnRemove = $('#btnRemove'),
        $btnNewSite = $('#btnNewSite'),
        $configsiteBtn = $('#configsiteBtn');
    selections = [];

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
                    field: 'stationName',
                    title: 'Station Name',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'location',
                    title: 'Location',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'description',
                    title: 'Description',
                    align: 'center',
                    valign: 'middle'
                }, {
                    field: 'config',
                    title: 'Config',
                    align: 'center',
                    valign: 'middle',
                    events: configEvents,
                    formatter : configFormatter
                }
            ]
        });

        $configsiteBtn.click(function(){
            var selects = $table.bootstrapTable('getSelections');
            var length = Object.keys(selects).length;
            if(length > 1){
                $('#msg').html("Only choose a station !");
                $("#modalTitle").html("Error");
                $("#modalTitle").css("color","red");
                $("#btnCloseSN").html("ok");
                $('#myModal').modal({
                    keyboard: true
                });
            }else if(length == 1){
                var row =selects[0];
                var webCtrl = row.webCtrlIp + ":" + row.webCtrlPort;
                //getCurSiteIdAndRedirect(row.siteName, webCtrl, row.webCtrlUser, row.webCtrlPwd);
                $(window.location).attr('href', 'configsite.html?siteId='+row.id+'&user='+curUser+'&sessionId='+sessId);
            }else{
                $('#msg').html("Choose a station at least !");
                $("#modalTitle").html("Error");
                $("#modalTitle").css("color","red");
                $("#btnCloseSN").html("ok");
                $('#myModal').modal({
                    keyboard: true
                });
            }
            /*var ids = $.map(selects, function (row) {
                return row.index;
            });*/
        });

        var ddtarget = document.querySelector('#tree');
        addEvent(ddtarget, 'dragover', function (e) {
            if (e.preventDefault) e.preventDefault(); // allows us to drop
            $(this).addClass('over');
            e.dataTransfer.dropEffect = 'copy';
            return false;
        });
        // to get IE to work
        addEvent(ddtarget, 'dragenter', function (e) {
            $(this).addClass('over');
            return false;
        });
        addEvent(ddtarget, 'dragleave', function () {
            $(this).removeClass('over');
        });
        addEvent(ddtarget, 'drop', function (e) {

            if (e.stopPropagation) e.stopPropagation();
            // stops the browser from redirecting...why???

            var el = document.getElementById(e.dataTransfer.getData('Text'));
            // stupid nom text + fade effect

            $(e.target).addClass('testDrag');
            var tree_target = document.getElementById("tree");
            var tree_ul_target = tree_target.getElementsByTagName("ul")[0];
            var tree_li_target = tree_ul_target.getElementsByTagName("li");

            var k = 0;
            for(var i = 0 ; i < tree_li_target.length; i++){
                var target_li = $(tree_li_target[i]);
                if (target_li.hasClass('testDrag')) {
                    k = i;
                    /*$(el) is the "p"
                    alert($(el).attr("class"));*/
                }
            }

            var nodeTarget = $('#tree').treeview('getChecked');
            // console.log($(el).sensors)
            // console.log(el.sensors);
            // console.log( $(el).attr("sensors"))
            var node_Drag = {
                text: $(el).text(),
                tooltip: el.id,
                equip_sensors: el.sensors,
                state:{checked:true, disabled:false, selected:true},
                class: $(el).attr("class")
            };

            $('#tree').treeview('addNode', [node_Drag, nodeTarget[k]]);
            $(e.target).removeClass('testDrag');

            return false;
        });
        // sometimes footer render error.
        setTimeout(function () {
            $table.bootstrapTable('resetView');
        }, 200);

        $table.on('check.bs.table uncheck.bs.table ' + 'check-all.bs.table uncheck-all.bs.table', function (row, $element) {
            $btnRemove.prop('disabled', !$table.bootstrapTable('getSelections').length);
            // save your data, here just save the current page
            //selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });

        $table.on('expand-row.bs.table', function (e, index, row, $detail) {
            if (index % 2 == 1) {
                $detail.html('Loading from ajax request...');
                $.get('LICENSE', function (res) {
                    $detail.html(res.replace(/\n/g, '<br>'));
                });
            }
        });

        $table.on('all.bs.table', function (e, name, args) {
            //console.log(name, args);
        });

        $table.on('dbl-click-row.bs.table', function(e, row, $element, field) {
            //show equipment
            $('.divDragShow').addClass('mobile-right');
            $('.rr3').addClass('mobile-right2');
            //show station Tree
            $("div#siteTree_aside").show();
        });
        $btnNewSite.click(function(){
            createNewStation();
        });
        $btnRemove.click(function () {
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

        $(window).resize(function () {
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });

        initTreeView();
        getAllStations();
        showMap();
    }

    //****************************************************************************************************

    function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }

    function removeStation(ids) {
        $.ajax({
            url: 'station/delete',
            type: 'POST',
            data: JSON.stringify({'ids':ids}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("curUser:" + curUser);
                    removeUserStationId(curUser, ids);
                } else {
                    console.log("delete station wrong:" + res);
                }
            },
            error: function (e) {
                console.log("delete station error :"+e);
            }
        });
    }

    var stationName, location, description;

    function createNewStation() {
        stationName = document.getElementById('stationName').value;
        location = document.getElementById('location').value;
        description = document.getElementById('description').value;

        //checkSiteInput();

        $.ajax({
            url: 'station/create',
            type: 'POST',
            data: JSON.stringify({"name":stationName, "location":location, "description":description}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("station id:" + res);
                    addToUser(curUser, res);
                    addStationToTable(res);
                } else {
                    console.log("createNewSite wrong:" + res);
                }
            },
            error: function () {
                console.log("createNewSite request failed");
            }
        })
    }

    function addToUser(userName, stationId) {
        $.ajax({
            url: 'user/addStation',
            type: 'POST',
            data: JSON.stringify({"name":userName, "station":stationId.toString()}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("addToUser success:" + res)
                } else {
                    console.log("addToUser wrong:" + res);
                }
            },
            error: function () {
                console.log("addToUser request failed");
            }
        })
    }

    function removeUserStationId(userName, ids) {
        console.log("try to delete station id from one user")
        $.ajax({
            url: 'user/deleteStationID',
            type: 'POST',
            data: JSON.stringify({"userName":userName, "ids":JSON.stringify(ids)}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("deleteToUser success:" + res)
                } else {
                    console.log("deleteToUser wrong:" + res);
                }
            },
            error: function () {
                console.log("deleteToUser request failed");
            }
        })
    }


    function loadSiteTree(siteId) {
        var curSiteId = siteId;
        console.log("try to load tree data...");
        $.ajax({
            url: 'station/readSiteTree',
            type: 'POST',
            data: JSON.stringify({"ID":curSiteId.toString()}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    //get json data from server.
                    console.log("get tree data success:" + res);
                    var dataStr = JSON.stringify(res);
                    var dataJson = eval('[' + dataStr + ']');
                    reInitSiteTree(dataJson);
                } else {
                    console.log("get tree data wrong:" + res)
                    $('#loading').hide();
                    document.getElementById('siteEquipTips').innerHTML = "Can't load the station equipment, the station is not valid, please check IP/User/Pwd";
                }
            },
            error: function () {
                console.log("get tree data request failed");
                $('#loading').hide();
            }
        })
    }

    function initTreeView(){
        $('#tree').treeview({
            data: getTree(),
            levels: 3,
            collapseIcon: "glyphicon glyphicon-chevron-down",
            expandIcon: "glyphicon glyphicon-chevron-right",
            showTips:true,
            onNodeSelected: function(event, data) {
                // alert('selected:');
            }
        });
    }

    function reInitSiteTree() {
        $('#tree').treeview({
            data: getTree(),
            levels: 3,
            collapseIcon: "glyphicon glyphicon-chevron-down",
            expandIcon: "glyphicon glyphicon-chevron-right",
            showTips:true,
            onNodeSelected: function(event, data) {
                // alert('selected:');
            }
        });
    }


    var DivET = document.getElementById("divET");
    function readJsonData(res, div) {
        for (var i in res.Children) {
            var oneEquipP = document.createElement("span");
            oneEquipP.setAttribute("data-toggle", "tooltip");
            oneEquipP.setAttribute("data-placement", "right");
            oneEquipP.setAttribute("title", res.Children[i].reference);
            oneEquipP.innerHTML = res.Children[i].name;
            oneEquipP.id = res.Children[i].reference;
            oneEquipP.sensors = res.Children[i].Children;

            var oneEquipLi = document.createElement("li");
            oneEquipLi.appendChild(oneEquipP);
            div.appendChild(oneEquipLi);

            if (res.Children[i].Children != undefined && res.Children[i].Children[0].Children != undefined) {
                var oneEquipUl = document.createElement("ul");
                oneEquipUl.setAttribute("style", "background-color:#262C43");
                oneEquipLi.appendChild(oneEquipUl);
                readJsonData(res.Children[i], oneEquipUl);
            }
            //changed by mq 20171030    ------------iterator to the last level node
            /*if (res.Children[i].Children != undefined && res.Children[i].Children[0].name != undefined) {
                var oneEquipUl = document.createElement("ul");
                oneEquipUl.setAttribute("style", "background-color:#262C43");
                oneEquipLi.appendChild(oneEquipUl);
                readJsonData(res.Children[i], oneEquipUl);
            }*/
            //ended
        }
    }


    function showMap() {
        var map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(121.4285700000, 31.1459900000), 14);
        map.enableScrollWheelZoom();
        var b = new BMap.Bounds(new BMap.Point(121.2, 31),new BMap.Point(121.6, 31.3));
        try {
            BMapLib.AreaRestriction.setBounds(map, b);
        } catch (e) {
            console.log(e);
        }
        // var map = new BMap.Map("allmap");
        // var point = new BMap.Point(31.1439900000, 121.4245700000);
        //
        // map.centerAndZoom(point, 12);
        // map.enableScrollWheelZoom();
        // map.enableInertialDragging();
        // map.enableContinuousZoom();
    }

    function loadMap() {
        $.ajax({
            url: 'option/showMap',
            type: 'POST',
            data: JSON.stringify({"name":curUser}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    var data = JSON.parse(JSON.stringify(res));//return JSONArray
                    var markers = [];
                    for(var i in data){
                        var cityName = data[i].cityName;
                        var pointX = parseFloat(data[i].x);
                        var pointY = parseFloat(data[i].y);
                        markers.push(new BMap.Marker(new BMap.Point(pointX,pointY)));
                    }
                    showMap(cityName,markers);
                    console.log("loadMap ok");

                } else {
                    console.log("loadMap wrong return:" + res);
                }
            },
            error: function () {
                $('#msg').html("loadMap failed");
                $("#btnCloseSN").html("ok");
                $('#myModal').modal({
                    keyboard: true
                });
            }
        })
    }

    // function getAllSites() {
    //     $.ajax({
    //         url: 'user/sites',
    //         type: 'POST',
    //         data: JSON.stringify({"name":curUser}),
    //         dataType: 'json',
    //         contentType: "application/json; charset=UTF-8",
    //         success: function (res) {
    //             if (res) {
    //                 console.log("get all sites success");
    //                 var jsonObj = JSON.parse(JSON.stringify(res));
    //                 fillSitesToTable(jsonObj.sitelist);
    //                 loadMap();
    //             } else {
    //                 console.log("wrong return:" + res);
    //             }
    //         },
    //         error: function () {
    //             $('#msg').html("get all sites failed, server no respond!");
    //             $("#btnCloseSN").html("ok");
    //             $('#myModal').modal({
    //                 keyboard: true
    //             });
    //         }
    //     })
    // }

    function getAllStations() {
        $.ajax({
            url: 'user/stations',
            type: 'POST',
            data: JSON.stringify({"name":curUser}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("get all station success");
                    var jsonObj = JSON.parse(JSON.stringify(res));
                    fillStationToTable(jsonObj.stationlist);
                    //loadMap();
                    //showMap();
                } else {
                    console.log("wrong return:" + res);
                }
            },
            error: function () {
                $('#msg').html("get all station failed, server no respond!");
                $("#btnCloseSN").html("ok");
                $('#myModal').modal({
                    keyboard: true
                });
            }
        })
    }

    function addStationToTable(id) {
        $('#table').bootstrapTable('insertRow', {
            index: 0,
            row:{
                id: id.toString(),
                stationName: stationName,
                location: location,
                description: description
            }
        });

        $('#modal_newsite').modal('hide');
    }

    function fillStationToTable(stationIdList) {
        console.log(stationIdList);
        for (var i in stationIdList) {
            $.ajax({
                url: 'station/details',
                type: 'POST',
                data: JSON.stringify({"station":stationIdList[i].toString()}),
                dataType: 'json',
                contentType: "application/json; charset=UTF-8",
                success: function (res) {
                    if (res) {
                        var jsonObj = JSON.parse(JSON.stringify(res));
                        insertStationRecord(jsonObj);
                    } else {
                        console.log("get one station wrong" + res);
                    }
                },
                error: function () {
                    console.log("get one station request failed");
                }
            })
        }
    }


    function insertOneSiteRecord(jsonObj) {
        var ipSplitArr = jsonObj.webctrlip.split(":");
        var port = 8888; //default
        var ip = ipSplitArr[0];
        if (ip == "http") {
            ip = ipSplitArr[0] + ":" + ipSplitArr[1];
            port = ipSplitArr[2];
        }else {
            port = ipSplitArr[1];
        }
        $('#table').bootstrapTable('insertRow', {
            index: 0,
            row:{
                siteName: jsonObj.name,
                webCtrlIp: ip,
                webCtrlPort: port,
                webCtrlUser: jsonObj.user,
                webCtrlPwd: jsonObj.pwd,
                description: jsonObj.description,
            }
        });
    }

    function insertStationRecord(jsonObj) {
        $('#table').bootstrapTable('insertRow', {
            index: 0,
            row:{
                id: jsonObj.id,
                stationName: jsonObj.name,
                location: jsonObj.location,
                description: jsonObj.description
            }
        });
    }

    /*** function with station end ************************************************************************/
    /*************************send mail begin********************************/
    $btnSendReport = $("#btnSendReport");

    /*************************send mail end********************************/

    function responseHandler(res) {
        $.each(res.rows, function (i, row) {
            row.state = $.inArray(row.id, selections) !== -1;
        });
        return res;
    }
    function detailFormatter(index, row) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return html.join('');
    }
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
    function getSiteIdAndLoadTree(siteName, webCtrlIp, user, pwd) {
        $.ajax({
            url: 'station/getSiteId',
            type: 'POST',
            data: JSON.stringify({"siteName":siteName, "webCtrlIp":webCtrlIp, "user":user, "pwd":pwd}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("get station id success return:" + res)
                    CurrentSiteId = parseInt(res);
                    console.log(CurrentSiteId);
                    if (CurrentSiteId != 0) {
                        reInitSiteTree();
                        getAllEquipments(CurrentSiteId);
                        //loadSiteTree(CurrentSiteId);

                    }else {
                        console.log("the station is not exist");
                        document.getElementById('siteEquipTips').innerHTML = "Can't load the station equipment, the station is not valid, please check IP/User/Pwd";
                    }
                } else {
                    console.log("wrong return:" + res)
                }
            },
            error: function () {
                console.log("get station id error");
            }
        })
        //return siteId;
    }

    // function getCurSiteIdAndRedirect(siteName, webCtrlIp, user, pwd) {
    //     $.ajax({
    //         url: 'station/getSiteId',
    //         type: 'POST',
    //         data: JSON.stringify({"siteName":siteName, "webCtrlIp":webCtrlIp, "user":user, "pwd":pwd}),
    //         dataType: 'json',
    //         contentType: "application/json; charset=UTF-8",
    //         success: function (res) {
    //             if (res) {
    //                 console.log("get station id success return:" + res)
    //                 if (res != 0) {
    //                     $(window.location).attr('href', 'configsite.html?siteId='+res+'&user='+curUser+'&sessionId='+sessId);
    //                 }else {
    //                     //alert("this station is not valid!");
    //                     console.log("the station is not exist");
    //                 }
    //             } else {
    //                 console.log("wrong return:" + res)
    //             }
    //         },
    //         error: function () {
    //             //alert("load Equipment Tree failed, check serve connect...");
    //             console.log("get station id error");
    //         }
    //     })
    //     //return siteId;
    // }

    // function getCurStationIdAndRedirectToUiChart(stationName) {
    //     $.ajax({
    //         url: 'station/getSiteId',
    //         type: 'POST',
    //         data: JSON.stringify({"siteName":siteName, "webCtrlIp":webCtrlIp, "user":user, "pwd":pwd}),
    //         dataType: 'json',
    //         contentType: "application/json; charset=UTF-8",
    //         success: function (res) {
    //             if (res) {
    //                 console.log("get station id success return:" + res)
    //                 if (res != 0) {
    //                     $(window.location).attr('href', 'ui_chart.html?siteId='+res+'&user='+curUser+'&sessionId='+sessId);
    //                 }else {
    //                     //alert("this station is not valid!");
    //                     console.log("the station is not exist");
    //                 }
    //             } else {
    //                 console.log("wrong return:" + res)
    //             }
    //         },
    //         error: function () {
    //             //alert("load Equipment Tree failed, check serve connect...");
    //             console.log("get station id error");
    //         }
    //     })
    //     //return siteId;
    // }

    // function getCurSiteIdAndRedirectToUiChart(siteName, webCtrlIp, user, pwd) {
    //     $.ajax({
    //         url: 'station/getSiteId',
    //         type: 'POST',
    //         data: JSON.stringify({"siteName":siteName, "webCtrlIp":webCtrlIp, "user":user, "pwd":pwd}),
    //         dataType: 'json',
    //         contentType: "application/json; charset=UTF-8",
    //         success: function (res) {
    //             if (res) {
    //                 console.log("get station id success return:" + res)
    //                 if (res != 0) {
    //                     $(window.location).attr('href', 'ui_chart.html?siteId='+res+'&user='+curUser+'&sessionId='+sessId);
    //                 }else {
    //                     //alert("this station is not valid!");
    //                     console.log("the station is not exist");
    //                 }
    //             } else {
    //                 console.log("wrong return:" + res)
    //             }
    //         },
    //         error: function () {
    //             //alert("load Equipment Tree failed, check serve connect...");
    //             console.log("get station id error");
    //         }
    //     })
    //     //return siteId;
    // }

    function getAllEquipments(SiteId) {
        console.log("try to get all equipment...");
        $("#divET").empty();
        document.getElementById('siteEquipTips').innerHTML = "station Equipment";
        $.ajax({
            url: 'config/SoapTree',
            type: 'POST',
            data: JSON.stringify({"station":SiteId.toString()}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("ok");
                    readJsonData(res, DivET);
                    $("#divET").treeviewJq({}); //important show!
                    $("[data-toggle='tooltip']").tooltip();
                    $('#loading').hide();
                    addDragFunc();
                } else {
                    document.getElementById('siteEquipTips').innerHTML = "Can't load the station equipment, please check IP/User/Pwd";
                    console.log("wrong " + res);
                    $('#loading').hide();
                }
            },
            error: function () {
                //alert("load Equipment Tree failed, check serve connect...");
                $('#loading').hide();
                console.log("error");
                document.getElementById('siteEquipTips').innerHTML = "Can't load the station equipment, please check IP/User/Pwd";
            }
        })
    }
    //dragAndDrop//
    function addDragFunc() {
        //var links = document.querySelectorAll('#divET li>ul>li>ul>li>span');
        var links = document.querySelectorAll('#divET li>span');
        var	el = null;
        for (var i = 0; i < links.length; i++) {
            el = links[i];

            el.setAttribute('draggable', 'true');
            el.setAttribute('aria-grabbed', 'false');
            el.setAttribute('tabindex', '0');
            addEvent(el, 'dragstart', function (e) {
                e.dataTransfer.effectAllowed = 'copy';
                // only dropEffect='copy' will be dropable
                e.dataTransfer.setData('Text', this.id);
                // required otherwise doesn't work

                console.log(" -------------- this.id:" + this.id);
            });
        }

        //add again
        var links2 = document.querySelectorAll('#divET li>ul>li>ul>li>span');
        var	el2 = null;
        for (var i = 0; i < links2.length; i++) {
            el2 = links2[i];
            el2.setAttribute('draggable', 'true');
            el.setAttribute('aria-grabbed', 'false');
            el.setAttribute('tabindex', '0');
            addEvent(el2, 'dragstart', function (e) {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('Text', this.id);
                console.log(" -------------- this.id:" + this.id);
            });
        }
    }
    function configFormatter(value, row, index) {
        var idNumShow = "showHideEquip"+index;
        var idNumConfig = "configSite"+index;
        return ['<button id="'+idNumConfig+'" type="button" class="config btn btn-primary btn-xs">config</button>',
            '<button id="'+idNumShow+'" type="button" class="showHide btn btn-primary btn-xs">show</button>'].join('  ');
    }
    window.configEvents = {
        "click .config": function (e, value, row, index) {
            var webCtrl = row.webCtrlIp + ":" + row.webCtrlPort;
            //getCurSiteIdAndRedirect(row.siteName, webCtrl, row.webCtrlUser, row.webCtrlPwd);
            $(window.location).attr('href', 'configsite.html?siteId='+row.id+'&user='+curUser+'&sessionId='+sessId);
        },
        "click .showHide": function (e, value, row, index) {
            $('.divDragShow').show();
            if (!$('.divDragShow').hasClass('mobile-right')) {
                $('.divDragShow').addClass('mobile-right');
                $('.rr3').addClass('mobile-right2');
                $('.rr2').addClass('mobile-right2');

                $("div#siteTree_aside").show();
                $('#loading').show();
                initTreeView();
                var webCtrl = row.webCtrlIp + ":" + row.webCtrlPort;
                getSiteIdAndLoadTree(row.siteName, webCtrl, row.webCtrlUser, row.webCtrlPwd);
                document.getElementById("showHideEquip"+index.toString()).innerHTML = "hide";
                //$('#loading').hide();
            }else if(document.getElementById("showHideEquip"+index.toString()).innerHTML == "hide"){
                document.getElementById("showHideEquip"+index.toString()).innerHTML = "show";
                $('.divDragShow').removeClass('mobile-right');
                $('.rr3').removeClass('mobile-right2');
                $('.rr2').removeClass('mobile-right2');
                $("div#siteTree_aside").hide();
                $('#loading').hide();
            } else {
                var showBtn = document.getElementsByClassName('showHide');
                $('#loading').show();
                $.each(showBtn,function(){
                    this.innerHTML = "show";
                });
                var webCtrl = row.webCtrlIp + ":" + row.webCtrlPort;
                getSiteIdAndLoadTree(row.siteName, webCtrl, row.webCtrlUser, row.webCtrlPwd);
                document.getElementById("showHideEquip"+index.toString()).innerHTML = "hide";

                /* */

                //$("#divET").empty();
            }
        }
    }
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

});

function getAllNodes(){
    var treeViewObject = $('#tree').data('treeview'),
        allCollapsedNodes = treeViewObject.getCollapsed(),
        allExpandedNodes = treeViewObject.getExpanded(),
        allNodes = allCollapsedNodes.concat(allExpandedNodes);

    return allNodes;
}

function getRootNode(allNodes) {
    for (var i in allNodes) {
        if (allNodes[i].level == 1) {
            break;
        }
    }
    return allNodes[i];
}

function deleteLiFunction(){
    var parentDeleteLiNode = $('#tree').treeview('getSelected');
    $('#tree').treeview('removeNode', [parentDeleteLiNode]);
}

function renameFunctionSubmit(){
    var nameValue = document.getElementById("inputRename").value;
    var parentRenameNode = $('#tree').treeview('getSelected');
    var newRenameNode = {
        text: nameValue,
        state:{checked: true,selected: false}
    };
    $('#tree').treeview('updateNode', [parentRenameNode, newRenameNode]);
}

function renameFunction(){
    $('#inputRename').val('');
    $('#myModalRename').modal('show');
}

// function getTree() {
//     var data = [{
//         text: 'station', state:{checked:true, disabled:false}, class: 'station',
//         nodes:[
//             { text: 'Chiller',state:{checked:true, disabled:false}, class: 'Area' },
//             { text: 'Chiller Plant',state:{checked:true, disabled:false}, class: 'Area' },
//             { text: 'AHU',state:{checked:true, disabled:false}, class: 'Area' },
//             { text: 'VAV',state:{checked:true, disabled:false}, class: 'Area' },
//         ]
//     }]
//     return data;
// }


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