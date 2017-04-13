function Chain() {
	this.taskList = [], 
  this.errorList = [], 
  this.successList = [],
  this.length = arguments.length;
	for (i = 0; i < this.length; i++) {
		this.taskList.push(arguments[i]);
	}

  this.add = function(){
    if(typeof(arguments[0])== Number){
      this.taskList.splice(arguments[0],0,arguments[1]);
    }
    else{
      this.taskList.push(arguments[0]);
    }
  }
	this.next = function() {
		if (this.taskList.length > 0) this.inject(this.taskList[0]);
		else console.log('任务全部完成');
	}

	this.start = function() {
    console.log('开始执行。总共' + this.taskList.length + '个任务\n');
		this.next();
	}

	this.setTimeout = function(fn, time) {
		var _this = this;
		fn = "setTimeout(" + fn + ",0)";
		setTimeout(function() {
			eval(fn);
			setTimeout(function() {
				_this.taskList.shift();
				_this.next();
			}, 0);
		}, time);
	}

	this.ajax = function() {
  var _this = this;
		var ajaxData = {
			type: arguments[0].type || "GET",
			url: arguments[0].url || "",
			async: arguments[0].async || "true",
			data: arguments[0].data || null,
			dataType: arguments[0].dataType || "text",
			contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
			beforeSend: arguments[0].beforeSend ||
			function() {},
			success: arguments[0].success ||
			function(response) {
				//console.log(response);
			},
			error: arguments[0].error ||
			function() {
				console.log("error");
			}
		}
		ajaxData.beforeSend();
		var xhr = createxmlHttpRequest();
		xhr.responseType = ajaxData.dataType;
		xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
		xhr.setRequestHeader("Content-Type", ajaxData.contentType);
		xhr.send(convertData(ajaxData.data));
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200 || xhr.status == 304) {
					ajaxData.success(xhr.response);
					_this.taskList.shift();
          _this.next();
				} else {
					ajaxData.error();
					_this.errorList.push('ajax');
				}
			}
		}

		function createxmlHttpRequest() {
			if (window.ActiveXObject) {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} else if (window.XMLHttpRequest) {
				return new XMLHttpRequest();
			}
		}

		function convertData(data) {
			if (typeof data === 'object') {
				var convertResult = "";
				for (var c in data) {
					convertResult += c + "=" + data[c] + "&";
				}
				convertResult = convertResult.substring(0, convertResult.length - 1)
				return convertResult;
			} else {
				return data;
			}
		}
	}


	this.inject = function(fn) {
		var source = fn.toString(),
			startPos = source.indexOf('{') + 1,
			endPos = source.lastIndexOf('}');
		source = source.substring(startPos, endPos).trim();
		if (source.indexOf('setTimeout') != -1) {
			var pos = match(source, 'setTimeout', '()'),
				pos1 = source.lastIndexOf(',', pos[1]),
				originalTime = source.substring(pos1 + 1, pos[1]),
				originalSource = source.substring(pos[0] + 1, pos1);
			this.successList.push(fn.name);
			this.setTimeout(originalSource, originalTime);
		} else if (source.indexOf('ajax') != -1) {
			var pos = match(source, 'ajax(', '{}'),
			param = source.substring(pos[0], pos[1] + 1);
      this.ajax(eval('obj='+param));
      this.successList.push(fn.name);
		} else {
			source += ";this.taskList.shift();this.successList.push(fn.name);this.next();";
			try {
				eval(source);
			} catch (err) {
				console.warn(err);
				this.errorList.push(fn.name);
			}
		}
	}
	console.log('链表初始化完毕');
}

function match(str, startStr, item) {
	var counter = 0,
		end = -1,
		matchLeft = item.charAt(0),
		matchRight = item.charAt(1),
		start = str.indexOf(startStr) + startStr.length;
	search(start + 1);

	function search(position) {
		end = str.indexOf(matchRight, position);
		if (end != -1) {
			counter++;
			var subStr = str.substring(start + 1, end).match(eval("/\\" + matchLeft + "/g"));
			if (subStr !== null) {
				var numsOfMatchLeft = subStr.length;
			} else if (subStr === null) {
				return;
			}

			if (counter > numsOfMatchLeft) {
				return;
			} else {
				arguments.callee(end + 1);
			}
		} else {
			console.warn('输入的配对符号有误');
		}
	}

	return [start, end];
}