var selectedSiteId;
var userName;
var sessionId;
$(document).ready(function() {
    var paramLenth = window.location.href.split("?")[1].split("&").length;
    if(paramLenth == 3){
        selectedSiteId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        console.log("selectedSiteId is " + selectedSiteId);
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

    var $table = $('#table'),
	$remove = $('#remove'),
    selections = [];

    $("img#hnav1").click(function () {
        $(window.location).attr('href', 'home.html?user='+userName+'&sessionId='+sessionId);
    });
    $("img#hnav2").click(function () {
        if(paramLenth == 3){
            $(window.location).attr('href', 'configsite.html?siteId='+selectedSiteId+'&user='+userName+'&sessionId='+sessionId);
        }else if(paramLenth == 2){
            $(window.location).attr('href', 'configsite.html?user='+userName+'&sessionId='+sessionId);
        }

    });
    $("img#hnav3").click(function () {
        if(paramLenth == 3){
            $(window.location).attr('href', 'ui_chart.html?siteId='+selectedSiteId+'&user='+userName+'&sessionId='+sessionId);
        }else if(paramLenth == 2){
            alert("Can not redirect to this page ! Must select a site!");
        }
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

    function updateTable() {
        $.ajax({
            url: 'rule/getRules',
            type: 'POST',
            data: null,
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    fillRulesToTable(res);
                } else {
                    console.log("updateTable wrong:" + res)
                }
            },
            error: function () {
                alert("updateTable failed, check serve connect...");
            }
        })
    }


    function initTable() {
        $table.bootstrapTable({
            height: getHeight(),
            rowStyle: myRowStyle,
            columns: [
                {
                    field: 'state',
                    checkbox: true,
                    align: 'center',
                    valign: 'middle'
                },{
                    field: 'name',
                    title: 'Station Name',
                    align: 'center',
                    cellStyle:formatTableName
                }, {
                    field: 'description',
                    title: 'Station Description',
                    align: 'center'
                }
            ]
        });
		$('#detailtable a').editable({
			type: 'text',
			mode: 'inline',
			name: 'value'
		});

		function formatTableName(value, row, index, field) {
			return {
				classes: 'text-nowrap another-class',
				css: {"color": "blue", "text-decoration": "underline", "cursor": "pointer"}
			};
		}
        // sometimes footer render error.
        setTimeout(function () {
            $table.bootstrapTable('resetView');
        }, 200);
		
        $table.on('check.bs.table uncheck.bs.table ' +
                'check-all.bs.table uncheck-all.bs.table', function () {
            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
            // save your data, here just save the current page
            selections = getIdSelections();
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
        $remove.click(function () {
            var ids = getIdSelections();

            //console.log("ids:" + ids);
            removeRule(ids);

            $table.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });

            $remove.prop('disabled', true);
        });
        $(window).resize(function () {
            $table.bootstrapTable('resetView', {
                height: getHeight()
            });
        });
    }

    function removeRule(ids) {
        $.ajax({
            url: 'rule/deleteRule',
            type: 'POST',
            data: JSON.stringify({"ids": JSON.stringify(ids)}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    //console.log("removeRule ok");
                } else {
                    console.log("removeRule wrong:" + res)
                }
            },
            error: function () {
                alert("removeRule request faild!")
            }
        })
    }

	function myRowStyle(row, index) {
		return {
			classes: 'text-nowrap another-class',
			css: {"color": "black", "font-size": "1.6rem", "height": "30px"}
		};
	}

	$('button#btn_add').click(function () {
		$("#file").trigger("click")
    });

    $('button#btnDetailOK').click(function () {
        $.ajax({
            url: 'rule/update',
            type: 'POST',
            data: JSON.stringify({"ruleID":ruleID.toString(), "conditions":JSON.stringify(ruleData)}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    console.log("save detail config success:" + res);
                } else {
                    console.log("save detail config wrong:" + res)
                }
            },
            error: function () {
                alert("save detail config failed, check serve connect...");
            }
        })
    });

	$table.on('click-row.bs.table', function (e, row, $element, field) {
		if (field == "name") {
			$("#ruleDetial").modal('show');
            ruleID = row.id;
			getRuleDetails(row.id)
		}
	});

	var ruleData;
	var ruleID;
	function getRuleDetails(ruleID){
        $.ajax({
            url: 'rule/getRuleDetail',
            type: 'POST',
            data: JSON.stringify({"ruleID":ruleID.toString()}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
                if (res) {
                    ruleData = res;
                    showDetails(res);
                } else {
                    console.log("getRuleDetails wrong:" + res)
                }
            },
            error: function () {
                alert("getRuleDetails failed, check serve connect...");
            }
        })
	}

	function showDetails(data) {
        var detailText = document.getElementById('detailText');
        detailText.innerHTML = "rule_name:  " + "<span style='color:#c0a16b;'>" + data.rule_name + "</span> " + "<br>" +
                                "rule_type:  " + "<span style='color:#c0a16b;'>" + data.rule_type + "</span> " + "<br>" +
                                "rule_category:  " + "<span style='color:#c0a16b;'>" + data.rule_category + "</span> " + "<br>" +
                                "rule_description:  " + "<span style='color:#c0a16b;'>" + data.rule_description + "</span> " + "<br>" +
                                "rule_suggestion:  " +  "<span style='color:#c0a16b;'>" + data.rule_suggestion ;
        initTableParas();
        initTableDelay();
        initTableSensors();

        $('#tableParas').bootstrapTable('load', data.parameters);
        $('#tableDelays').bootstrapTable('load', data.delays);
        $('#tableSensors').bootstrapTable('load', data.sensors);
    }

    function initTableSensors() {
        $('#tableSensors').bootstrapTable({
            height: getHeight(),
            columns: [
                 {
                    field: 'ref_name',
                    title: 'ref_name',
                    align: 'center'
                }, {
                    field: 'data_type',
                    title: 'data_type',
                    align: 'center'
                }, {
                    field: 'mandatory',
                    title: 'mandatory',
                    align: 'center'
                }
            ]
        });
    }

    function initTableParas() {
        $('#tableParas').bootstrapTable({
            height: getHeight(),
            columns: [{
                    field: 'name',
                    title: 'name',
                    align: 'center'
                }, {
                    field: 'value',
                    title: 'value',
                    align: 'center',
                    editable: true
                }, {
                    field: 'description',
                    title: 'description',
                    align: 'center'
                }]
        });
        $('#tableParas a').editable({
            type: 'text',
            mode: 'inline',
            name: 'value'
        });
    }

    function initTableDelay() {
        $('#tableDelays').bootstrapTable({
            height: getHeight(),
            columns: [{
                    field: 'name',
                    title: 'name',
                    align: 'center'
                }, {
                    field: 'value',
                    title: 'value',
                    align: 'center',
                    editable: true
                }, {
                    field: 'description',
                    title: 'description',
                    align: 'center'
                }]
        });
        $('#tableDelays a').editable({
            type: 'text',
            mode: 'inline',
            name: 'value'
        });
    }



	var filePaths;
	jQuery('input:file').change(function(){
		filePaths = $("#file")[0].files;
		uploadrules();
        //updateTable();
		//createTable()
	 });
	
	function uploadrules(){

		console.log("start to uploading...");
		
		for (var i=0; i<filePaths.length; ++i) {
			getAsText(filePaths[i].name, filePaths[i]);
		}
	}
	
	/*******************************************************/
	function getAsText(fileName, readFile) {

		var reader = new FileReader();
		reader.fileName = fileName;
		
		// Read file into memory as UTF-16
		reader.readAsText(readFile);

		// Handle progress, success, and errors
		reader.onprogress = updateProgress;
		reader.onerror = errorHandler;
		reader.onload = loaded;
	}

	function updateProgress(evt) {
		if (evt.lengthComputable) {
			// evt.loaded and evt.total are ProgressEvent properties
			var loaded = (evt.loaded / evt.total);
			if (loaded < 1) {
			  // Increase the prog bar length
			  // style.width = (loaded * 200) + "px";
			}
		}
	}

	function loaded(evt) {
		// Obtain the read file data
		var fileString = evt.target.result;
		var fileName = evt.target.fileName;
		console.log("uploading:" + evt.target.fileName + "...");
		//console.log("file content: " + fileString);
		//console.log(fileString);
		
		// // Handle UTF-16 file dump
		// if(utils.regexp.isChinese(fileString)) {
		// //Chinese Characters + Name validation
		// }
		// else {
		// // run other charset test
		// }

		// xhr.send(fileString)
		$.ajax({
            url: 'rule/store',
            type: 'POST',
            data: JSON.stringify({"name": fileName, "text": fileString}),
            dataType: 'json',
            contentType: "application/json; charset=UTF-8",
            success: function (res) {
            if (res) {
				//alert("success " + res);
                console.log("success:" + res);
                //refresh table
                updateTable();
                //
            } else {
                    console.log("wrong string... return " + res)
                }
            },
            error: function () {
                alert("request faild!")
            }
        })
	}

	function errorHandler(evt) {
		if(evt.target.error.name == "NotReadableError") {
		// The file could not be read
			console.log("The file could not be read");
		}
	}
	/*******************************************************/

	var cnt = 0
	function createTable(){  
		for (var i=0; i<filePaths.length; ++i, ++cnt)
		{
			$('#table').bootstrapTable('insertRow', {
				index: cnt-1,
				row:{
					id: cnt.toString(),
					name: filePaths[i].name,
					description: "description" + cnt
				}
			});
		}
    }

    function fillRulesToTable(data) {
        var mData = [];

        for (var i in data) {
            var innerData = JSON.parse(data[i]);
            var oneRule = {
                id: innerData.id,
                name: innerData.name,
                description: innerData.description
            }
            mData.push(oneRule);
        }

        $('#table').bootstrapTable('load', mData);
    }

	
	function getIdSelections() {
        return $.map($table.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }
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
})